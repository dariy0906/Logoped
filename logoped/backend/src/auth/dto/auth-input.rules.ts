import { Transform } from 'class-transformer';
import {
  Matches,
  type ValidationArguments,
  type ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

const DANGEROUS_INPUT_PATTERN =
  /(<[^>]*>|javascript:|data:text\/html|vbscript:|on\w+\s*=|alert\s*\(|confirm\s*\(|prompt\s*\(|document\.|window\.|eval\s*\(|function\s*\(|settimeout\s*\(|setinterval\s*\(|fetch\s*\(|xmlhttprequest|process\.|require\s*\(|import\s*\(|drop\s+table|union\s+select|delete\s+from|insert\s+into|update\s+.+set|select\s+.+from|--|\/\*|\*\/)/i;

const SAFE_USERNAME_PATTERN = /^[\p{L}\p{N}_. -]+$/u;

@ValidatorConstraint({ name: 'isSafeText', async: false })
class SafeTextConstraint implements ValidatorConstraintInterface {
  validate(value: unknown) {
    return typeof value === 'string' && !DANGEROUS_INPUT_PATTERN.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} contains forbidden code-like content`;
  }
}

function normalizeString(value: unknown) {
  if (typeof value !== 'string') {
    return value;
  }

  return value.normalize('NFKC').replace(/\u0000/g, '').trim();
}

export function NormalizeInput() {
  return Transform(({ value }) => normalizeString(value));
}

export function NormalizeEmail() {
  return Transform(({ value }) => {
    const normalized = normalizeString(value);
    return typeof normalized === 'string' ? normalized.toLowerCase() : normalized;
  });
}

export function IsSafeText(
  message = 'Field contains forbidden code-like content',
  validationOptions?: ValidationOptions,
) {
  return (target: object, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options: {
        ...validationOptions,
        message,
      },
      validator: SafeTextConstraint,
    });
  };
}

export function IsSafeUsername() {
  return Matches(SAFE_USERNAME_PATTERN, {
    message: 'Username contains unsupported characters',
  });
}
