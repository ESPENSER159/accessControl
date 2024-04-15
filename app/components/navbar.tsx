"use client"
import { signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Image, Button } from "@nextui-org/react";

export default function NavBar() {
  const [user, setUser] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    let getUser: any = localStorage.getItem('user')
    let getLocation: any = localStorage.getItem('location')

    setUser(getUser)
    setLocation(getLocation)

  }, [])

  const [isMenuOpen, setIsMenuOpen] = useState(false);


  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <Image
            src="/icons/accessIcon.svg"
            className="mr-3 h-10 sm:h-12"
            alt="Access Icon"
            style={{ width: "auto", height: "auto" }}
            width={100}
            height={24}
          />
          <p className="font-bold text-inherit">ACCESS CONTROL</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <Image
            src="/icons/accessIcon.svg"
            className="mr-3 h-10 sm:h-12"
            alt="Access Icon"
            width={100}
            height={24}
          />
          <p className="font-bold text-inherit">ACCESS CONTROL</p>
        </NavbarBrand>
        <NavbarItem>
          <Link color="foreground" href="/users">
            Users
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/condominiums">
            Condominiums
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/residents">
            Residents
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/accessControl">
            Access Control
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              size="sm"
              src="./icons/iconAccount.png"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem textValue="user" key="user" className="h-14 gap-2">
              <p className="font-semibold">Signed in as:</p>
              <p>{user}</p>
            </DropdownItem>
            <DropdownItem textValue="location" key="location" className="h-14 gap-2">
              <p className="font-semibold">Condominium:</p>
              <p>{location}</p>
            </DropdownItem>
            <DropdownItem key="logout" startContent={<FontAwesomeIcon icon={faRightFromBracket} />} color="danger" onClick={() => {
              localStorage.clear()
              signOut()
            }}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem>
          <Link
            className="w-full"
            href="/users"
            size="lg"
          >
            Users
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full"
            href="/condomoniums"
            size="lg"
          >
            Condominiums
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full"
            href="/residents"
            size="lg"
          >
            Residents
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full"
            href="/accessControl"
            size="lg"
          >
            Access Control
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  )
}