"use client"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { Avatar, Dropdown, Navbar } from "flowbite-react"
import { HiLogout } from "react-icons/hi"

export default function NavBar() {
  return (
    <Navbar fluid className="bg-primary-100 py-5">
      <Navbar.Brand>
        <img src="./icons/accessIcon.svg" className="mr-3 h-10 sm:h-12" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Access control</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={true}
          inline
          label={
            <Avatar status="online" alt="User" img="./icons/iconAccount.png" rounded />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">Bonnie Green</span>
            <span className="block truncate text-sm font-medium">name@flowbite.com</span>
          </Dropdown.Header>
          {/* <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Earnings</Dropdown.Item> */}
          {/* <Dropdown.Divider /> */}
          <Dropdown.Item icon={HiLogout} onClick={() => signOut()}>Sign out</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link as={Link} href="/createAccess">
          Create Access
        </Navbar.Link>
        <Navbar.Link as={Link} href="/registerAccess">
          Register Access
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}