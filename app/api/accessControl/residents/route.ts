import { NextResponse } from "next/server"
import { conn } from '../../../libs/mysql'
import { getCurrentDate } from '../../../libs/getCurrentDate'


export async function POST(request: Request) {
    const { idCondominium } = await request.json()

    // Validar los campos de entrada
    if (!idCondominium) return NextResponse.json({ status: 400, message: 'Empty fields' })

    try {
        const rows: any = await conn.query('SELECT residents.id, residents.first_name, residents.last_name, residents.phone1, residents.phone2, residents.phone3, residents.phone4, residents.phone5, residents.condominium, residents.address, condominiums.id AS condominiumID, condominiums.name AS condominium_name, condominiums.text_ticket FROM residents INNER JOIN condominiums ON residents.condominium = condominiums.id WHERE residents.condominium =?', [idCondominium])
        const getInfo = rows

        let family: any = []
        let authorized: any = []

        if (getInfo.length) {
            for (let i = 0; i < getInfo.length; i++) {
                family = []
                authorized = []

                const getAuthorized: any = await conn.query('SELECT authorized.id, authorized.resident_ID, authorized.type, authorized.first_name AS firstName, authorized.last_name AS lastName, authorized.phone1 AS phone, authorized.phone2, authorized.phone3, authorized.phone4, authorized.phone5, authorized.condominium, authorized.address FROM residents INNER JOIN authorized ON residents.id = authorized.resident_ID WHERE residents.id = ?', [getInfo[i].id])

                if (getAuthorized.length) {
                    for (let j = 0; j < getAuthorized.length; j++) {
                        if (getAuthorized[j].type === 'family') {
                            family.push(getAuthorized[j])
                        } else {
                            authorized.push(getAuthorized[j])
                        }
                    }

                }

                getInfo[i].family = family
                getInfo[i].authorized = authorized
            }
        }

        if (!getInfo) throw new Error('No info')

        return NextResponse.json({ status: 200, info: getInfo })
    } catch (error: any) {
        console.error('Database connection error:', error);
        return NextResponse.json({ status: 400, message: 'Database connection error' });
    }
}