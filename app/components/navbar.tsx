"use client"
import Link from "next/link"
import { Navbar } from "flowbite-react"

export default function NavBar() {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand as={Link} href="https://flowbite-react.com">
        <img src="/next.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite React</span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link as={Link} href="/home">
          Home
        </Navbar.Link>
        <Navbar.Link as={Link} href="/register">
          Register
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}