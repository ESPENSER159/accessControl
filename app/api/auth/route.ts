import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { headers } from 'next/headers'

dotenv.config()

export async function POST(request: Request) {
  const headersList = headers()
  const getToken = headersList.get('authorization')

  if (!getToken) {
    return NextResponse.json({ message: 'Token de autenticación no proporcionado.' })
  }

  const token = getToken.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ status: 401, message: 'Token de autenticación inválido' });
  }

  return NextResponse.json({ status: 200, message: decoded })
}

const verifyToken = (token: any) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};