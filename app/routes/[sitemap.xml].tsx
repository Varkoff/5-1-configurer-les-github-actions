import { href } from "react-router"
import { serverEnv } from "~/server/env.server"

const pages = [
    {
        title: "Home",
        path: href("/")
    },
    {
        title: "Blog",
        path: href('/blog')
    }
]

export function loader() {
    const { FRONTEND_URL } = serverEnv
    const pagesAsXml = pages.map(page => `
<url>
    <loc>${FRONTEND_URL}${page.path}</loc>
</url>`)

    const sitemap = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pagesAsXml.join("\n")}</urlset>
`
    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml"
        }
    })
}