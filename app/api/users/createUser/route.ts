import { NextResponse } from "next/server"
import { conn } from '../../../libs/mysql'
import bcrypt from 'bcryptjs'
const saltRounds = 10

export async function POST(request: Request) {
    const { user, pass, condominium, type } = await request.json()

    // Validar los campos de entrada
    if (!user || !pass || !condominium) return NextResponse.json({ status: 400, message: 'Empty fields' })

    try {
        // Validate if user exist
        const searchUser: any = await conn.query('SELECT user, condominium FROM users WHERE user = ? AND condominium = ?', [user, condominium])
        const getUser = searchUser[0]

        await conn.end()

        if (getUser) return NextResponse.json({ status: 400, message: 'User already exists' })

        const encryptPassword = bcrypt.hashSync(pass, saltRounds)

        const creationDate = formatedTimestamp()

        // Create user
        const create: any = await conn.query('INSERT INTO users (user, password, condominium, type, creation_date) VALUES (?, ?, ?, ?, ?)', [user, encryptPassword, condominium, type, creationDate])
        const ifCreate = create[0]

        await conn.end()

        if (ifCreate) return NextResponse.json({ status: 400, message: 'Error to create user' })

        return NextResponse.json({ status: 200 })
    } catch (error) {
        console.error('Error DB:', error);
        return NextResponse.json({ status: 400, message: 'Error DB' });
    }
}

const formatedTimestamp = () => {
    const d = new Date()
    const date = d.toISOString().split('T')[0]
    const time = d.toTimeString().split(' ')[0]
    return `${date} ${time}`
}