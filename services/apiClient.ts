export const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
};

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  token?: string;
}

export async function apiFetch<T>(endpoint: string, options: ApiFetchOptions = {}): Promise<T> {
  const url = `${getBaseUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers || {});
  
  if (options.token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  let body = options.body;

  if (body && !(body instanceof FormData) && typeof body === 'object') {
    body = JSON.stringify(body);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body: body as BodyInit,
  });

  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      // Ignore
    }
    throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
  }

  // If response has no content, return empty object to prevent JSON parse error
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}
