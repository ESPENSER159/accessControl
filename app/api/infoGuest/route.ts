import { NextResponse } from "next/server"
import { conn } from '../../libs/mysql'

export async function POST(request: Request) {
    const { idGuest } = await request.json()

    // Validar los campos de entrada
    if (!idGuest) return NextResponse.json({ status: 400, message: 'Empty fields' })

    try {
        const rows: any = await conn.query('SELECT id, resident_ID, condominium_ID, address, guest_name, license_num, card_num, access_by, `date` FROM access_guest WHERE id = ?', [idGuest])
        const getInfo = rows

        return NextResponse.json({ status: 200, info: getInfo[0] })
    } catch (error: any) {
        console.error('Database connection error:', error);
        return NextResponse.json({ status: 400, message: 'Database connection error' });
    }
}