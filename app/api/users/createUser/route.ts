import { NextResponse, NextRequest } from "next/server"
import { conn } from '../../../libs/mysql'

export async function GET(request: NextRequest) {

    return NextResponse.json(`${request}`)
}

export async function POST(request: Request) {
    const { user, pass, condominium, type } = await request.json()

    // Validar los campos de entrada
    if (!user || !pass || !condominium) return NextResponse.json({ status: 400, message: 'Empty fields' })

    console.log(user)
    console.log(pass)
    console.log(condominium)
    console.log(type)

    try {
        // Validate if user exist
        const searchUser: any = await conn.query('SELECT user, condominium FROM users WHERE user = ? AND condominium = ?', [user, condominium])
        const getUser = searchUser[0]

        if (getUser) return NextResponse.json({ status: 400, message: 'User already exists' })

        // Create user
        // const create: any = await conn.query('INSERT INTO users (user, password, condominium, type) VALUES (?, ?, ?, ?)', [user, pass, condominium, type])
        // const ifCreate = create[0]

        // console.log(create)

        // if (!create) return NextResponse.json({ status: 400, message: '' })

        return NextResponse.json({ status: 200 })
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error);
        return NextResponse.json({ status: 400, message: 'Error de conexión a la base de datos.' });
    }
}