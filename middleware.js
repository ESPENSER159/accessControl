export { default } from "next-auth/middleware"

export const config = {
    matcher: [
        "/users",
        "/createUser",
        "/createAccess",
        "/registerAccess",
        "/api/:path*"
    ]
}