import { NextResponse } from "next/server"
import { conn } from '../../../libs/mysql'
import { getCurrentDate } from '../../../libs/getCurrentDate'

export async function POST(request: Request) {
    const { name, address, textTicket } = await request.json()

    // Validar los campos de entrada
    if (!name || !address) return NextResponse.json({ status: 400, message: 'Empty fields' })

    try {
        // Validate if exist
        const search: any = await conn.query('SELECT name, address, text_ticket FROM condominiums WHERE name = ? AND address = ?', [name, address])
        const getData = search[0]

        await conn.end()

        if (getData) return NextResponse.json({ status: 400, message: 'Already exists' })

        const creationDate = getCurrentDate()

        // Create
        const create: any = await conn.query('INSERT INTO condominiums (name, address, text_ticket, creation_date) VALUES (?, ?, ?, ?)', [name, address, textTicket, creationDate])
        const ifCreate = create[0]

        await conn.end()

        if (ifCreate) return NextResponse.json({ status: 400, message: 'Error to create' })

        return NextResponse.json({ status: 200 })
    } catch (error) {
        console.error('Error DB:', error);
        return NextResponse.json({ status: 400, message: 'Error DB' });
    }
}