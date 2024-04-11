export { default } from "next-auth/middleware"

export const config = {
    matcher: [
        "/users/:path*",
        "/createAccess/:path*",
        "/registerAccess/:path*",
        "/api/((?!condominiums).*)"
    ]
}