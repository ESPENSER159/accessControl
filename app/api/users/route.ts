import { NextResponse } from "next/server"
import { conn } from '../../libs/mysql'
import bcrypt from 'bcryptjs'
const saltRounds = 10

export async function GET() {
    try {
        // Get all users
        // const rows: any = await conn.query('SELECT id, user, condominium, type FROM users')
        const rows: any = await conn.query('SELECT users.id, users.user, users.type, condominiums.id AS condominiumID, condominiums.name AS condominium FROM users INNER JOIN condominiums ON users.condominium = condominiums.id')
        const getUsers = rows

        await conn.end()

        if (!getUsers) throw new Error('No users')

        return NextResponse.json({ status: 200, users: getUsers })
    } catch (error: any) {
        console.error('Error de conexión a la base de datos:', error);
        return NextResponse.json({ status: 400, message: 'Error de conexión a la base de datos.' });
    }
}

export async function POST(request: Request) {
    const { id, edit, userToEdit, condominiumToEdit, user, pass, condominium, type } = await request.json()

    // Validar los campos de entrada
    if (!user || !pass || !condominium) return NextResponse.json({ status: 400, message: 'Empty fields' })

    try {
        // Validate if user exist
        const searchUser: any = await conn.query('SELECT id, user, condominium FROM users WHERE user = ? AND condominium = ?', [user, condominium])
        const getUser = searchUser[0]

        const encryptPassword = bcrypt.hashSync(pass, saltRounds)

        const currentDate = formatedTimestamp()

        const editUser = async () => {
            // Edit user
            const edit: any = await conn.query(`UPDATE users SET user=?, password=?, condominium=?, type=?, edit_date=? WHERE id=? AND user='${userToEdit}' AND condominium='${condominiumToEdit}'`, [user, encryptPassword, condominium, type, currentDate, id])
            const res = edit[0]

            await conn.end()

            if (res) return NextResponse.json({ status: 400, message: 'Error to create user' })

            return NextResponse.json({ status: 200 })
        }

        if (edit) {

            if (getUser) {
                if (getUser.id === id) {
                    return await editUser()
                } else {
                    return NextResponse.json({ status: 400, message: 'User already exists' })
                }
            } else {
                return await editUser()
            }

        } else {
            if (getUser) return NextResponse.json({ status: 400, message: 'User already exists' })

            // Create user
            const create: any = await conn.query('INSERT INTO users (user, password, condominium, type, creation_date) VALUES (?, ?, ?, ?, ?)', [user, encryptPassword, condominium, type, currentDate])
            const ifCreate = create[0]

            await conn.end()

            if (ifCreate) return NextResponse.json({ status: 400, message: 'Error to create user' })

            return NextResponse.json({ status: 200 })
        }

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