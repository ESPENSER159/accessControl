import { NextResponse } from "next/server"
import { conn } from '../../../libs/mysql'
import { getCurrentDate } from '../../../libs/getCurrentDate'

export async function POST(request: Request) {
    const { infoResident, infoGuest, accessBy } = await request.json()

    // Validar los campos de entrada
    if (!infoResident.id) return NextResponse.json({ status: 400, message: 'Empty fields' })

    try {
        const creationDate = getCurrentDate()

        infoGuest.delivery ? infoGuest.delivery = 'delivery' : infoGuest.delivery = 'guest'

        await conn.query('INSERT INTO access_guest (resident_ID, condominium_ID, address, type, guest_name, license_num, card_num, memo, access_by, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [infoResident.id, infoResident.condominiumID, infoResident.address, infoGuest.delivery, infoGuest.guestName, infoGuest.licenseNum, infoGuest.cardNum, infoGuest.memo, accessBy, creationDate])

        await conn.end()

        return NextResponse.json({ status: 200 })

    } catch (error) {
        console.error('Error DB:', error);
        return NextResponse.json({ status: 400, message: 'Error DB' });
    }
}