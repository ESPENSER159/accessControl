import { NextResponse } from "next/server"
import { conn } from '../../../libs/mysql'

export async function GET(request: Request) {
    try {
        // Validate if user exist
        const search: any = await conn.query('SELECT ag.id, ag.resident_ID, (SELECT first_name FROM residents WHERE id = ag.resident_ID) AS resident_name, (SELECT last_name FROM residents WHERE id = ag.resident_ID) AS resident_last_name, ag.condominium_ID, (SELECT name FROM condominiums WHERE id = ag.condominium_ID) AS condominium_name, (SELECT address FROM condominiums WHERE id = ag.condominium_ID) AS condominium_address, ag.address, ag.type, ag.guest_name, ag.license_num, ag.card_num, ag.memo, ag.access_by, ag.date FROM access_guest ag')
        const getInfo = search

        await conn.end()

        return NextResponse.json({ status: 200, info: getInfo })

    } catch (error) {
        console.error('Error DB:', error);
        return NextResponse.json({ status: 400, message: 'Error DB' });
    }
}