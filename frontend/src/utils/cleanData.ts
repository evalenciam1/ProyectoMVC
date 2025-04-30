export function cleanData<T extends Record<string, any>>(data: T, allowedFields: (keyof T)[]): Partial<T> {
  const cleaned: Partial<T> = {};

  allowedFields.forEach((key) => {
    if (key in data) {
      cleaned[key] = data[key];
    }
  });

  return cleaned;
}
