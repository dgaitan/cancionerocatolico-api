import type { ApiResponse } from '../types/api';

export function ok<T>(data: T, meta?: Record<string, unknown>): ApiResponse<T> {
  return { success: true, data, error: null, ...(meta && { meta }) };
}

export function fail(
  message: string,
  code?: string,
  details?: unknown,
): ApiResponse<never> {
  return { success: false, data: null, error: { message, ...(code && { code }), ...(details !== undefined && { details }) } };
}
