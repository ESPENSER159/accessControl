import { NextResponse } from "next/server"
import { conn } from '../../libs/mysql'

export async function GET() {
    try {
        // Get all users
        const rows: any = await conn.query('SELECT id, user, condominium, type FROM users')
        const getUsers = rows

        if (!getUsers) throw new Error('No users')

        return NextResponse.json({ status: 200, users: getUsers })
    } catch (error: any) {
        console.error('Error de conexión a la base de datos:', error);
        return NextResponse.json({ status: 400, message: 'Error de conexión a la base de datos.' });
    }
}