const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000];
const REQUEST_TIMEOUT = 10000;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: 'TIMEOUT' | 'RATE_LIMIT' | 'UPSTREAM_ERROR',
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function classifyError(status: number): ApiError['code'] {
  if (status === 429) return 'RATE_LIMIT';
  return 'UPSTREAM_ERROR';
}

async function fetchWithTimeout(url: string, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(`Request timed out after ${timeout}ms`, 408, 'TIMEOUT');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export async function apiGet<T>(url: string): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(url, REQUEST_TIMEOUT);

      if (!response.ok) {
        const code = classifyError(response.status);
        // Don't retry rate limits
        if (code === 'RATE_LIMIT') {
          throw new ApiError(
            `Rate limited by ${new URL(url).hostname}`,
            response.status,
            code,
          );
        }
        throw new ApiError(
          `HTTP ${response.status} from ${new URL(url).hostname}`,
          response.status,
          code,
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error as Error;

      if (error instanceof ApiError && error.code === 'RATE_LIMIT') {
        throw error;
      }

      if (attempt < MAX_RETRIES - 1) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt]));
      }
    }
  }

  if (lastError instanceof ApiError) throw lastError;
  throw new ApiError(
    lastError?.message ?? 'Unknown error',
    500,
    'UPSTREAM_ERROR',
  );
}
