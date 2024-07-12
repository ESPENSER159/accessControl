import { NextResponse } from "next/server"
import { conn } from '../../../libs/mysql'

export async function POST(request: Request) {
    const { idGuest, cardtag } = await request.json()

    // Validar los campos de entrada
    if (!idGuest) return NextResponse.json({ status: 400, message: 'Empty fields' })

    try {
        const rows: any = await conn.query('UPDATE access_guest SET card_num = ? WHERE id = ?', [cardtag, idGuest])
        const getInfo = rows

        return NextResponse.json({ status: 200, info: getInfo })
    } catch (error: any) {
        console.error('Database connection error:', error);
        return NextResponse.json({ status: 400, message: 'Database connection error' });
    }
}