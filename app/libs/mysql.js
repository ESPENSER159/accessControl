import mysql from 'serverless-mysql'
import dotenv from 'dotenv'

dotenv.config()

export const conn = mysql({
    config: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: 3306,
        database: process.env.DB_NAME
    }
})