import { NextResponse } from "next/server"
import { conn } from '../../../libs/mysql'

export async function POST(request: Request) {
    const { user, pass, condominium, type } = await request.json()

    // Validar los campos de entrada
    if (!user || !pass || !condominium) return NextResponse.json({ status: 400, message: 'Empty fields' })

    try {
        // Validate if user exist
        const searchUser: any = await conn.query('SELECT user, condominium FROM users WHERE user = ? AND condominium = ?', [user, condominium])
        const getUser = searchUser[0]

        if (getUser) return NextResponse.json({ status: 400, message: 'User already exists' })

        let typeUser = type
        type ? typeUser = 'admin' : typeUser = 'user'

        // Create user
        const create: any = await conn.query('INSERT INTO users (user, password, condominium, type) VALUES (?, ?, ?, ?)', [user, pass, condominium, typeUser])
        const ifCreate = create[0]

        if (ifCreate) return NextResponse.json({ status: 400, message: 'Error to create user' })

        return NextResponse.json({ status: 200 })
    } catch (error) {
        console.error('Error DB:', error);
        return NextResponse.json({ status: 400, message: 'Error DB.' });
    }
}