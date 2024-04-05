import { NextResponse, NextRequest } from "next/server"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
const saltRounds = 10

dotenv.config()

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}

export async function GET(request: NextRequest) {

  return NextResponse.json(`${request}`)
}

export async function HEAD(request: Request) { }

export async function POST(request: Request) {
  const { user, pass } = await request.json()

  // Validar los campos de entrada
  if (!user || !pass) {
    return NextResponse.json({ message: 'Por favor, proporciona un usuario y una contraseña.' })
  }

  try {
    // Conectar a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Consultar el usuario por email
    const [rows] = await connection.execute('SELECT id, user, password FROM users WHERE user = ?', [user])
    const getUser: any = rows[0]

    console.log(getUser)

    if (!getUser) {
      return NextResponse.json({ message: 'Invalid credentials.' })
    }

    // Verificar la contraseña
    const encryptPassword = bcrypt.hashSync(pass, saltRounds)
    console.log(encryptPassword)

    console.log(getUser.password)
    const isValidPassword = await bcrypt.compare(pass, getUser.password)

    console.log(isValidPassword)

    if (!isValidPassword) {
      return NextResponse.json({ message: 'Invalid credentials.' })
    }

    // Generar un token JWT
    const token = jwt.sign({ id: getUser.id, user: getUser.user }, process.env.JWT_SECRET, { expiresIn: '24h' })

    return NextResponse.json({ status: 200, token })
  } catch (error: any) {
    console.error('Error de conexión a la base de datos:', error);
    return NextResponse.json({ status: 400, message: 'Error de conexión a la base de datos.' });
  }
}

export async function PUT(request: Request) { }

export async function DELETE(request: Request) { }

export async function PATCH(request: Request) { }

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request: Request) { }