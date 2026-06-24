import { jsonResponse } from '../middleware/cors'

/**
 * 헬스체크 엔드포인트
 */
export function handleHealthCheck(): Response {
  return jsonResponse({
    status: 'ok',
    service: 'moajim',
  })
}
