import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const dbConfig = {
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "user", type: "text" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials: any, req) {

                // Conectar a la base de datos
                const connection = await mysql.createConnection(dbConfig)

                if (!connection) throw new Error('Error de conexión a la base de datos')

                // Consultar el usuario por email
                const [rows]: any = await connection.execute('SELECT id, user, password FROM users WHERE user = ?', [credentials.email])
                const getUser: any = rows[0]

                if (!getUser) throw new Error('Invalid credentials')

                const isValidPassword = await bcrypt.compare(credentials.password, getUser.password)

                if (!isValidPassword) throw new Error('Invalid credentials')

                return {
                    id: getUser.id,
                    user: getUser.user
                }
            }
        })
    ],
    pages: {
        signIn: '/login'
    },
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }