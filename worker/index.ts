export default {
  fetch(request: Request): Response {
    const url = new URL(request.url)

    // 1️⃣ 헬스체크
    if (url.pathname === "/api/health") {
      return new Response(
        JSON.stringify({
          status: "ok",
          service: "moajim",
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // 2️⃣ users API (임시)
    if (url.pathname === "/api/users") {
      return Response.json({
        users: [
          { id: 1, name: "Nate" },
          { id: 2, name: "Moajim" },
        ],
      })
    }

    // 3️⃣ 나머지 요청
    return new Response("Not Found", { status: 404 })
  },
}
