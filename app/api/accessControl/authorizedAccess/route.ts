import { NextResponse } from "next/server"
import { conn } from '../../../libs/mysql'
import { getCurrentDate } from '../../../libs/getCurrentDate'

export async function POST(request: Request) {
    const { info, accessBy } = await request.json()

    // Validar los campos de entrada
    if (!info.id) return NextResponse.json({ status: 400, message: 'Empty fields' })

    try {

        const creationDate = getCurrentDate()

        await conn.query('INSERT INTO access_authorized (resident_ID, authorized_ID, condominium_ID, address, type, first_name, last_name, access_by, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [info.resident_ID, info.id, info.condominium, info.address, info.type, info.firstName, info.lastName, accessBy, creationDate])

        await conn.end()

        return NextResponse.json({ status: 200 })

    } catch (error) {
        console.error('Error DB:', error);
        return NextResponse.json({ status: 400, message: 'Error DB' });
    }
}