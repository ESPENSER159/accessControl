import { NextResponse } from "next/server"
import { conn } from '../../../libs/mysql'

export async function POST(request: Request) {

    const { idCondominium } = await request.json()

    try {
        // Validate if user exist
        const search: any = await conn.query(`SELECT ag.id, ag.resident_ID, (SELECT first_name FROM residents WHERE id = ag.resident_ID) AS resident_name, (SELECT last_name FROM residents WHERE id = ag.resident_ID) AS resident_last_name, (SELECT phone1 FROM residents WHERE id = ag.resident_ID) AS phone, ag.condominium_ID, (SELECT name FROM condominiums WHERE id = ag.condominium_ID) AS condominium_name, (SELECT address FROM condominiums WHERE id = ag.condominium_ID) AS condominium_address, ag.address, ag.type, ag.guest_name AS firstName, ag.license_num, ag.card_num, ag.memo, ag.access_by, ag.date FROM access_guest ag ${idCondominium ? `WHERE condominium_ID = ${idCondominium}` : ''} ORDER BY date DESC`)
        const getInfo = search

        await conn.end()

        return NextResponse.json({ status: 200, info: getInfo })

    } catch (error) {
        console.error('Error DB:', error);
        return NextResponse.json({ status: 400, message: 'Error DB' });
    }
}