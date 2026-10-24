export function randomString(length = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function randomNumber(min = 1, max = 1000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomEmail(): string {
  return `test.${randomString(8)}@example.com`;
}

export function randomPhone(): string {
  return `+1-${randomNumber(200, 999)}-${randomNumber(200, 999)}-${randomNumber(1000, 9999)}`;
}

export function randomPostalCode(): string {
  return String(randomNumber(10000, 99999));
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function calculateTax(subtotal: number, taxRate = 0.08): number {
  return Math.round(subtotal * taxRate * 100) / 100;
}

export function calculateTotal(subtotal: number, tax: number): number {
  return Math.round((subtotal + tax) * 100) / 100;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function retry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> {
  return fn().catch((error) => {
    if (retries <= 0) throw error;
    return delay(delayMs).then(() => retry(fn, retries - 1, delayMs * 2));
  });
}
