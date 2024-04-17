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
            async authorize(credentials, req) {

                // Consultar el usuario por email
                const rows = await conn.query('SELECT id, user, password, type, condominium FROM users WHERE user = ? AND condominium = ?', [credentials.email, credentials.condominium])
                const getUser = rows[0]

                await conn.end()

                if (!getUser) throw new Error('Invalid credentials')

                const isValidPassword = await bcrypt.compare(credentials.password, getUser.password)

                if (!isValidPassword) throw new Error('Invalid credentials')

                return {
                    id: getUser.id,
                    name: getUser.user,
                    email: getUser.type,
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