export { default } from "next-auth/middleware"

export const config = {
    matcher: [
        "/createAccess",
        "/registerAccess",
        "/api/:path*"
    ]
}