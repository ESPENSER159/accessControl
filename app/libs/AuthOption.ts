import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'
import { conn } from './mysql'

const secret = process.env.NEXTAUTH_SECRET

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "user", type: "text" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials: any, req) {

                // Consultar el usuario por email
                const rows: any = await conn.query('SELECT id, user, password, type, condominium FROM users WHERE user = ? AND condominium = ?', [credentials.email, credentials.condominium])
                const getUser: any = rows[0]

                await conn.end()

                if (!getUser) throw new Error('Invalid credentials')

                const isValidPassword = await bcrypt.compare(credentials.password, getUser.password)

                if (!isValidPassword) throw new Error('Invalid credentials')

                return {
                    id: getUser.id,
                    name: getUser.user,
                    type: getUser.type,
                    condominium: getUser.condominium
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user }) {

            // console.log(user)

            return user

            const isAllowedToSignIn = true
            if (isAllowedToSignIn) {
                return true
            } else {
                // Return false to display a default error message
                return false
                // Or you can return a URL to redirect to:
                // return '/unauthorized'
            }
        },
        // async jwt({ token, account, profile }) {
        //     // console.log(profile)
        //     // Persist the OAuth access_token and or the user id to the token right after signin
        //     if (account) {
        //         token.accessToken = account.access_token
        //         token.id = profile.id
        //     }
        //     return token
        // },
        // async session({ session, token, name }) {
        //     // Send properties to the client, like an access_token and user id from a provider.
        //     session.accessToken = token.accessToken
        //     session.user.id = token.id

        //     // console.log(token)

        //     return session
        // }
    },
    pages: {
        signIn: '/auth'
    },
    secret: secret
}