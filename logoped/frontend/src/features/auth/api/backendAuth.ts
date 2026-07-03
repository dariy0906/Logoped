type BackendAuthResponse = {
  accessToken?: string
  profile: {
    id: string
    name: string
    email: string
    role: 'child' | 'parent' | null
  }
}

const BACKEND_TOKEN_KEY = 'logoped_backend_access_token'

function getBackendApiUrl() {
  return (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '')
}

export function getBackendAccessToken() {
  return localStorage.getItem(BACKEND_TOKEN_KEY)
}

export function clearBackendAccessToken() {
  localStorage.removeItem(BACKEND_TOKEN_KEY)
}

function saveBackendAccessToken(token: string) {
  localStorage.setItem(BACKEND_TOKEN_KEY, token)
}

async function postJson<T>(path: string, body: unknown, token?: string): Promise<T> {
  const response = await fetch(`${getBackendApiUrl()}${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(await response.text())
  }

  return response.json() as Promise<T>
}

async function patchJson<T>(path: string, body: unknown, token?: string): Promise<T> {
  const response = await fetch(`${getBackendApiUrl()}${path}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(await response.text())
  }

  return response.json() as Promise<T>
}

export async function registerBackendUser(
  email: string,
  password: string,
  username: string,
  role: 'child' | 'parent' = 'child',
) {
  const data = await postJson<BackendAuthResponse>('/auth/register', {
    email,
    password,
    name: username,
    role,
  })

  if (data.accessToken) {
    saveBackendAccessToken(data.accessToken)
  }
  return data
}

export async function loginBackendUser(email: string, password: string) {
  const data = await postJson<BackendAuthResponse>('/auth/login', {
    email,
    password,
  })

  if (data.accessToken) {
    saveBackendAccessToken(data.accessToken)
  }
  return data
}

export async function updateBackendUserRole(role: 'child' | 'parent') {
  const token = getBackendAccessToken()

  if (!token) {
    throw new Error('Backend auth token is missing')
  }

  return patchJson<BackendAuthResponse['profile']>('/auth/role', { role }, token)
}
