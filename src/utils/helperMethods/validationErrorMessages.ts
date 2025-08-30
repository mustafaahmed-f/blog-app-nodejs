export function requiredFieldMsg(field: string): string {
  return `${field} is required`;
}

export function minLengthMsg(minLength: number): string {
  return `Min. length ${minLength}`;
}

export function maxLengthMsg(maxLength: number): string {
  return `Max. length ${maxLength}`;
}

export function invalidSchemaFormatMsg(field: string, format: string): string {
  return `${field} should match : ${format}`;
}

export function invalidEmailMsg(): string {
  return `Invalid email format`;
}

export function invalidPasswordMsg(): string {
  return `Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.`;
}

export function invalidDateMsg(): string[] {
  return ["Date must be in the future", "Invalid date format"];
}

export function invalidNumberMsg(field: string): string {
  return `Invalid number format for field : ${field}`;
}

export function positiveNumberMsg(field: string): string {
  return `${field} should be positive`;
}

export function invalidUrlMsg(): string {
  return `Invalid URL`;
}
