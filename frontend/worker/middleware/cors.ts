/**
 * CORS 헤더
 */
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

/**
 * CORS preflight 요청 처리
 */
export function handleCorsOptions(): Response {
  return new Response(null, { headers: CORS_HEADERS })
}

/**
 * JSON 응답 생성
 */
export function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: CORS_HEADERS,
  })
}
