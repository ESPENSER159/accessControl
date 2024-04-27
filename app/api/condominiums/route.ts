import { NextResponse } from "next/server"
import { conn } from '../../libs/mysql'
import { getCurrentDate } from '../../libs/getCurrentDate'

export async function GET() {
    try {
        // Get all users
        const rows: any = await conn.query('SELECT id, name, address, text_ticket, print_ticket FROM condominiums')
        const getInfo = rows

        await conn.end()

        if (!getInfo) throw new Error('No info')

        return NextResponse.json({ status: 200, info: getInfo })
    } catch (error: any) {
        console.error('Database connection error:', error);
        return NextResponse.json({ status: 400, message: 'Database connection error' });
    }
}

export async function POST(request: Request) {
    const { id, edit, toEdit, name, address, textTicket, printTicket } = await request.json()

    // Validar los campos de entrada
    if (!name || !address) return NextResponse.json({ status: 400, message: 'Empty fields' })

    try {
        // Validate if user exist
        const search: any = await conn.query('SELECT id, name, address, text_ticket FROM condominiums WHERE name = ? AND address = ?', [name, address])
        const getData = search[0]

        const currentDate = getCurrentDate()

        const editQuery = async () => {
            // Edit
            const edit: any = await conn.query(`UPDATE condominiums SET name=?, address=?, text_ticket=?, print_ticket=?, edit_date=? WHERE id=? AND name='${toEdit}'`, [name, address, textTicket, printTicket ? 'YES' : 'NO', currentDate, id])
            const res = edit[0]

            await conn.end()

            if (res) return NextResponse.json({ status: 400, message: 'Error to create user' })

            return NextResponse.json({ status: 200 })
        }

        if (edit) {

            if (getData) {
                if (getData.id === id) {
                    return await editQuery()
                } else {
                    return NextResponse.json({ status: 400, message: 'User already exists' })
                }
            } else {
                return await editQuery()
            }

        } else {
            if (getData) return NextResponse.json({ status: 400, message: 'User already exists' })

            // Create
            const create: any = await conn.query('INSERT INTO condominiums (name, address, text_ticket, print_ticket, creation_date) VALUES (?, ?, ?, ?, ?)', [name, address, textTicket, printTicket ? 'YES' : 'NO', currentDate])
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