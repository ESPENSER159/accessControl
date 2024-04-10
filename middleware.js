export { default } from "next-auth/middleware"

export const config = {
    matcher: [
        "/createUser/:path*",
        "/createAccess/:path*",
        "/registerAccess/:path*",
        "/api/:path*"
    ]
}