type DenoRuntime = {
  env: {
    get(key: string): string | undefined
  }
  serve(handler: (request: Request) => Response | Promise<Response>): void
}

const denoRuntime = globalThis as typeof globalThis & { Deno: DenoRuntime }

type SpeechAnalysisResult = {
  score: number
  level: number
  clarity: number
  speechQuality: number
  effort: number
  praises: [string, string]
  suggestion: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function clampScore(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)))
}

function normalizeResult(data: Partial<SpeechAnalysisResult>): SpeechAnalysisResult {
  return {
    score: clampScore(data.score ?? 80),
    level: Math.max(1, Math.round(data.level ?? 1)),
    clarity: clampScore(data.clarity ?? 80),
    speechQuality: clampScore(data.speechQuality ?? 80),
    effort: clampScore(data.effort ?? 90),
    praises:
      Array.isArray(data.praises) && data.praises.length >= 2
        ? [String(data.praises[0]), String(data.praises[1])]
        : ['Ты отлично постарался!', 'У тебя становится всё лучше!'],
    suggestion: String(data.suggestion ?? 'Попробуй говорить чуть медленнее ❤️'),
  }
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function getOutputText(data: unknown) {
  if (typeof data !== 'object' || data === null) {
    return '{}'
  }

  const responseData = data as {
    output_text?: unknown
    output?: Array<{ content?: Array<{ text?: unknown }> }>
  }

  return typeof responseData.output_text === 'string'
    ? responseData.output_text
    : typeof responseData.output?.[0]?.content?.[0]?.text === 'string'
      ? responseData.output[0].content[0].text
      : '{}'
}

denoRuntime.Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  try {
    const body = await request.json().catch(() => null)
    const text = typeof body === 'object' && body !== null && 'text' in body ? body.text : null

    if (!text || typeof text !== 'string') {
      return jsonResponse({ error: 'Text is required' }, 400)
    }

    const openAiApiKey = denoRuntime.Deno.env.get('OPENAI_API_KEY')

    if (!openAiApiKey) {
      return jsonResponse({ error: 'OPENAI_API_KEY is not configured' }, 500)
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: denoRuntime.Deno.env.get('OPENAI_MODEL') ?? 'gpt-4o-mini',
        input: [
          {
            role: 'system',
            content:
              'Ты добрый детский логопед. Оцени речь ребенка мягко и коротко. Верни только JSON по схеме.',
          },
          {
            role: 'user',
            content: `Текст ребенка: ${text}`,
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'child_speech_analysis',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              required: [
                'score',
                'level',
                'clarity',
                'speechQuality',
                'effort',
                'praises',
                'suggestion',
              ],
              properties: {
                score: { type: 'integer', minimum: 0, maximum: 100 },
                level: { type: 'integer', minimum: 1, maximum: 100 },
                clarity: { type: 'integer', minimum: 0, maximum: 100 },
                speechQuality: { type: 'integer', minimum: 0, maximum: 100 },
                effort: { type: 'integer', minimum: 0, maximum: 100 },
                praises: {
                  type: 'array',
                  minItems: 2,
                  maxItems: 2,
                  items: { type: 'string' },
                },
                suggestion: { type: 'string' },
              },
            },
          },
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return jsonResponse({ error: errorText }, response.status)
    }

    const data = await response.json()
    const outputText = getOutputText(data)
    const result = normalizeResult(JSON.parse(outputText))

    return jsonResponse(result)
  } catch (error) {
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500,
    )
  }
})
