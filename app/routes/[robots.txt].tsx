import { serverEnv } from "~/server/env.server"

export function loader() {
    const { FRONTEND_URL } = serverEnv

    return new Response(
        `
            User-Agent: *
            Allow: /
            Disallow: /login
            Disallow: /register

            Sitemap: ${FRONTEND_URL}/sitemap.xml`, {
        headers: {
            "Content-Type": "text/plain"
        }
    })
}