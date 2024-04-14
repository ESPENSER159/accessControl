import { NextResponse } from "next/server"
import { conn } from '../../../libs/mysql'

export async function POST(request: Request) {
    const { id } = await request.json()

    // Validar los campos de entrada
    if (!id) return NextResponse.json({ status: 400, message: 'Empty fields' })

    try {
        // Validate if exist
        const search: any = await conn.query('SELECT id FROM residents WHERE id = ?', [id])
        const getData = search[0]

        await conn.end()

        if (!getData) return NextResponse.json({ status: 400, message: 'Not exists' })

        // Validate users associated
        const getAuthorized: any = await conn.query('SELECT residents.id, residents.first_name, residents.last_name, residents.condominium AS condominium_ID, residents.address, authorized.id AS authorized_ID, authorized.resident_ID, authorized.type, authorized.first_name, authorized.last_name, authorized.phone1, authorized.condominium, authorized.address FROM residents INNER JOIN authorized ON residents.id = authorized.resident_ID WHERE residents.id = ?', [id])

        await conn.end()

        // Delete authorized persons
        if (getAuthorized.length) {
            for (let i = 0; i < getAuthorized.length; i++) {
                await conn.query('DELETE FROM authorized WHERE id = ?', [getAuthorized[i].authorized_ID])
                await conn.end()
            }
        }

        await conn.query('DELETE FROM residents WHERE id = ?', [id])

        return NextResponse.json({ status: 200 })

    } catch (error) {
        console.error('Error DB:', error);
        return NextResponse.json({ status: 400, message: 'Error DB.' });
    }
}