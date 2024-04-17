import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth/next"
import { authOptions } from "./libs/AuthOption";
import NavBar from "./components/navbar";
import { Providers } from "./providers";
import Head from 'next/head'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Access Control",
  description: "Generated by create next app",
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)
  const type = ''

  return (
    <html lang="en">
      {/* <Head>
        <meta name="viewport" content="width=device-width" />
      </Head> */}
      <body className={inter.className}>
        <Providers>
          {session?.user &&
            <NavBar type={type} />
          }
          {children}
        </Providers>
      </body>
    </html>
  );
}
