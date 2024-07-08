import { NextResponse } from "next/server"
import { authOptions } from "../../libs/AuthOption";
import { getServerSession } from "next-auth";

export async function GET() {
    const session = await getServerSession(authOptions)
    // const type = session?.user.email

    return NextResponse.json({ status: 200, session: session })
}