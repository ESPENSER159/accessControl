import { NextResponse } from "next/server"
import { conn } from '../../libs/mysql'

export async function POST(request: Request) {
    const { id } = await request.json()

    // Validar los campos de entrada
    if (!id) return NextResponse.json({ status: 400, message: 'Empty fields' })

    try {
        // Validate if user exist
        const search: any = await conn.query('SELECT authorized.id, authorized.resident_ID, authorized.type, authorized.first_name AS firstName, authorized.last_name AS lastName, authorized.phone1 AS phone, authorized.phone2, authorized.phone3, authorized.phone4, authorized.phone5, authorized.condominium, authorized.address FROM residents INNER JOIN authorized ON residents.id = authorized.resident_ID WHERE residents.id = ?', [id])
        const getInfo = search

        await conn.end()

        return NextResponse.json({ status: 200, info: getInfo })

    } catch (error) {
        console.error('Error DB:', error);
        return NextResponse.json({ status: 400, message: 'Error DB' });
    }
}