import { NextResponse } from "next/server"
import { conn } from '../../../libs/mysql'

export async function POST(request: Request) {
    const { id, user, condominium } = await request.json()

    // Validar los campos de entrada
    if (!id || !user || !condominium) return NextResponse.json({ status: 400, message: 'Empty fields' })

    try {
        // Validate if user exist
        const searchUser: any = await conn.query('SELECT id, user, condominium FROM users WHERE id = ? AND user = ? AND condominium = ?', [id, user, condominium])
        const getUser = searchUser[0]

        await conn.end()

        if (!getUser) return NextResponse.json({ status: 400, message: 'User no exists' })

        // Delete user
        const row: any = await conn.query('DELETE FROM users WHERE id = ? AND user = ? AND condominium = ?', [id, user, condominium])
        const res = row[0]

        await conn.end()

        if (res) return NextResponse.json({ status: 400, message: 'Error to delete user' })

        return NextResponse.json({ status: 200 })
    } catch (error) {
        console.error('Error DB:', error);
        return NextResponse.json({ status: 400, message: 'Error DB.' });
    }
}