// shared/db/errors.ts (or database/errors.ts, wherever your other db helpers live)
export function isUniqueViolation(
  error: unknown,
  constraintName?: string,
): boolean {
  const pgError = (error as { cause?: { code?: string; constraint?: string } })
    .cause;
  if (pgError?.code !== "23505") return false;
  return constraintName ? pgError.constraint === constraintName : true;
}
