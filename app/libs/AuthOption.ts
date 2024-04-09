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
                const rows: any = await conn.query('SELECT id, user, password, condominium FROM users WHERE user = ? AND condominium = ?', [credentials.email, credentials.condominium])
                const getUser: any = rows[0]

                if (!getUser) throw new Error('Invalid credentials')

                const isValidPassword = await bcrypt.compare(credentials.password, getUser.password)

                if (!isValidPassword) throw new Error('Invalid credentials')

                return {
                    id: getUser.id,
                    user: getUser.user,
                    condominium: getUser.condominium
                }
            }
        })
    ],
    pages: {
        signIn: '/auth'
    },
    secret: secret
}