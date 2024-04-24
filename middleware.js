export { default } from "next-auth/middleware"

export const config = {
    matcher: [
        "/users/:path*",
        "/condominiums/:path*",
        "/residents/:path*",
        "/incomeRecord/:path*",
        "/accessControl/:path*",
        "/api/((?!condominiums).*)"
    ]
}