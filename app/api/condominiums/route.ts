import { NextResponse } from "next/server"
import { conn } from '../../libs/mysql'

export async function GET() {
    try {
        // Get all users
        const rows: any = await conn.query('SELECT id, name FROM condominiums')
        const getInfo = rows

        if (!getInfo) throw new Error('No info')

        return NextResponse.json({ status: 200, info: getInfo })
    } catch (error: any) {
        console.error('Database connection error:', error);
        return NextResponse.json({ status: 400, message: 'Database connection error' });
    }
}