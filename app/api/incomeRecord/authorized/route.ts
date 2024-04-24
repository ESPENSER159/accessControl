import { NextResponse } from "next/server"
import { conn } from '../../../libs/mysql'

export async function POST() {
    try {
        // Validate if user exist
        const search: any = await conn.query('SELECT au.id, au.resident_ID, (SELECT first_name FROM residents WHERE id = au.resident_ID) AS resident_name, (SELECT last_name FROM residents WHERE id = au.resident_ID) AS resident_last_name, (SELECT phone1 FROM residents WHERE id = au.resident_ID) AS phone, au.authorized_ID, au.condominium_ID, (SELECT name FROM condominiums WHERE id = au.condominium_ID) AS condominium_name, (SELECT address FROM condominiums WHERE id = au.condominium_ID) AS condominium_address, au.address, au.type, au.first_name AS firstName, au.last_name AS lastName, au.access_by, au.date FROM access_authorized au')
        const getInfo = search

        await conn.end()

        return NextResponse.json({ status: 200, info: getInfo })

    } catch (error) {
        console.error('Error DB:', error);
        return NextResponse.json({ status: 400, message: 'Error DB' });
    }
}