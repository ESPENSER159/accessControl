export { default } from "next-auth/middleware"

export const config = {
    matcher: [
        "/users/:path*",
        "/residents/:path*",
        "/condominiums/:path*",
        "/accessControl/:path*",
        "/api/((?!condominiums).*)"
    ]
}