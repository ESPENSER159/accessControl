import NextAuth from 'next-auth'
import { authOptions } from "../../../libs/AuthOption"
 
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }