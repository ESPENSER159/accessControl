import { NextResponse } from "next/server"
import { conn } from '../../../libs/mysql'

export async function POST(request: Request) {
    const { id, name, address } = await request.json()

    // Validar los campos de entrada
    if (!id || !name || !address) return NextResponse.json({ status: 400, message: 'Empty fields' })

    try {
        // Validate if exist
        const search: any = await conn.query('SELECT id, name, address FROM condominiums WHERE id = ? AND name = ?', [id, name])
        const getData = search[0]

        await conn.end()

        if (!getData) return NextResponse.json({ status: 400, message: 'Not exists' })

        // Validate users associated
        const validateUser: any = await conn.query('SELECT users.id AS userID, users.user, users.type, condominiums.id AS condominiumID, condominiums.name AS condominium, condominiums.address FROM users INNER JOIN condominiums ON users.condominium = condominiums.id WHERE condominiums.id = ?', [id])
        const getUsers = validateUser

        await conn.end()

        if (getUsers.length) return NextResponse.json({ status: 400, message: 'To delete condominium you must not have associated users' })

        // Delete
        const row: any = await conn.query('DELETE FROM condominiums WHERE id = ? AND name = ?', [id, name])
        const res = row[0]

        await conn.end()

        if (res) return NextResponse.json({ status: 400, message: 'Error to delete user' })

        return NextResponse.json({ status: 200 })
    } catch (error) {
        console.error('Error DB:', error);
        return NextResponse.json({ status: 400, message: 'Error DB.' });
    }
}