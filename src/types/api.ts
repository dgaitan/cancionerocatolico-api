export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: { message: string; code?: string; details?: unknown } | null;
  meta?: Record<string, unknown>;
}
