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
                const rows = await conn.query('SELECT id, user, password, type, condominium FROM users WHERE user = ?', [credentials.email])
                const getUser = rows[0]

                const getCondominium = await conn.query('SELECT id, name FROM condominiums WHERE id = ?', [getUser.condominium])

                await conn.end()

                if (!getUser) throw new Error('Invalid credentials')

                const isValidPassword = await bcrypt.compare(credentials.password, getUser.password)

                if (!isValidPassword) throw new Error('Invalid credentials')

                return {
                    id: getUser.id,
                    name: getUser.user,
                    email: getUser.type,
                    image: [getUser.condominium, getCondominium[0].name]
                }
            }
        })
    ],
    pages: {
        signIn: '/auth'
    },
    secret: secret
}