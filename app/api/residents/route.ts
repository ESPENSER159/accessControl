import { NextResponse } from "next/server"
import { conn } from '../../libs/mysql'
import { getCurrentDate } from '../../libs/getCurrentDate'

export async function GET() {
    try {
        // Get all users
        // SELECT users.id, users.user, users.type, condominiums.id AS condominiumID, condominiums.name AS condominium FROM users INNER JOIN condominiums ON users.condominium = condominiums.id

        // const rows: any = await conn.query('SELECT id, first_name, last_name, phone1, phone2, phone3, phone4, phone5, condominium, address FROM residents')

        const rows: any = await conn.query('SELECT residents.id, residents.first_name, residents.last_name, residents.phone1, residents.phone2, residents.phone3, residents.phone4, residents.phone5, residents.condominium, residents.address, condominiums.id AS condominiumID, condominiums.name AS condominium_name FROM residents INNER JOIN condominiums ON residents.condominium = condominiums.id')
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

export async function POST(request: Request) {
    const { id, edit, toEdit, firstName, lastName, condominium, address, phone, alternativePhones, family, authorized } = await request.json()

    // Validar los campos de entrada
    if (!firstName || !lastName || !condominium || !address || !phone) return NextResponse.json({ status: 400, message: 'Empty fields' })

    try {
        // Validate if user exist
        const search: any = await conn.query('SELECT id, condominium, address FROM residents WHERE condominium = ? AND address = ?', [condominium, address])
        const getData = search[0]

        const currentDate = getCurrentDate()

        const deleteAllAuthorized = async (id: any) => {
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
        }

        const createAllAuthorized = async (id: any) => {
            // Create Authorized
            if (family) {
                for (let i = 0; i < family.length; i++) {
                    await conn.query('INSERT INTO authorized (resident_ID, type,first_name, last_name, phone1, phone2, phone3, phone4, phone5, condominium, address, creation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, 'family', family[i].firstName, family[i].lastName, family[i].phone, family[i].phone2, family[i].phone3, family[i].phone4, family[i].phone5, condominium, address, currentDate])

                    await conn.end()
                }
            }

            if (authorized) {
                for (let i = 0; i < authorized.length; i++) {
                    await conn.query('INSERT INTO authorized (resident_ID, type,first_name, last_name, phone1, phone2, phone3, phone4, phone5, condominium, address, creation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, 'authorized', authorized[i].firstName, authorized[i].lastName, authorized[i].phone, authorized[i].phone2, authorized[i].phone3, authorized[i].phone4, authorized[i].phone5, condominium, address, currentDate])

                    await conn.end()
                }
            }
        }

        const editQuery = async () => {
            // Edit
            const edit: any = await conn.query(`UPDATE residents SET first_name=?, last_name=?, phone1=?, phone2=?, phone3=?, phone4=?, phone5=?, condominium=?, address=?, edit_date=? WHERE id=? AND address='${toEdit}'`, [firstName, lastName, phone, alternativePhones.phone2, alternativePhones.phone3, alternativePhones.phone4, alternativePhones.phone5, condominium, address, currentDate, id])
            const res = edit[0]

            await conn.end()

            if (res) return NextResponse.json({ status: 400, message: 'Error update' })

            await deleteAllAuthorized(id)
            await createAllAuthorized(id)

            return NextResponse.json({ status: 200 })
        }

        if (edit) {

            if (getData) {
                if (getData.id === id) {
                    return await editQuery()
                } else {
                    return NextResponse.json({ status: 400, message: 'User already exists' })
                }
            } else {
                return await editQuery()
            }

        } else {
            if (getData) return NextResponse.json({ status: 400, message: 'Already exists' })

            // Create
            const create: any = await conn.query('INSERT INTO residents (first_name, last_name, phone1, phone2, phone3, phone4, phone5, condominium, address, creation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, phone, alternativePhones.phone2, alternativePhones.phone3, alternativePhones.phone4, alternativePhones.phone5, condominium, address, currentDate])
            const ifCreate = create

            await conn.end()

            if (!ifCreate) return NextResponse.json({ status: 400, message: 'Error to create user' })

            let getCreatedID = ifCreate.insertId

            createAllAuthorized(getCreatedID)

            return NextResponse.json({ status: 200 })
        }

    } catch (error) {
        console.error('Error DB:', error);
        return NextResponse.json({ status: 400, message: 'Error DB' });
    }
}