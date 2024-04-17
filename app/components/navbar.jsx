"use client"
import { signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Image } from "@nextui-org/react"
import { useRouter } from 'next/navigation'

export default function NavBar({ type }) {
  const [user, setUser] = useState('')
  const [location, setLocation] = useState('')
  const [getType, setType] = useState(type)

  const router = useRouter()

  useEffect(() => {
    if (getType === 'user') {
      router.push('/accessControl')
    }
  }, [router, getType])

  useEffect(() => {
    let getUser = localStorage.getItem('user')
    let getLocation = localStorage.getItem('location')

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
        <NavbarBrand className="max-w-none">
          <Image
            src="/bluelogo.png"
            // className="mr-3 max-w-40 min-w-40 w-40"
            alt="Access Icon"
            width={200}
            height={200}
          />
          {/* <p className="font-bold text-inherit">ACCESS CONTROL</p> */}
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <Image
            src="/bluelogo.png"
            // className="mr-3 max-w-40 min-w-40 w-40"
            alt="Access Icon"
            width={200}
            height={200}
          />
          {/* <p className="font-bold text-inherit">ACCESS CONTROL</p> */}
        </NavbarBrand>

        {getType === 'admin' ?
          <>
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
          </>
          :
          <></>
        }

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

        {getType === 'admin' ?
          <>
            <NavbarMenuItem className="border-solid border-2 border-default-200 rounded-lg pl-4 py-2">
              <Link
                className="w-full text-default-500"
                href="/users"
                size="lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Users
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem className="border-solid border-2 border-default-200 rounded-lg pl-4 py-2">
              <Link
                className="w-full text-default-500"
                href="/condominiums"
                size="lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Condominiums
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem className="border-solid border-2 border-default-200 rounded-lg pl-4 py-2">
              <Link
                className="w-full text-default-500"
                href="/residents"
                size="lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Residents
              </Link>
            </NavbarMenuItem>
          </>
          :
          <></>
        }

        <NavbarMenuItem className="border-solid border-2 border-default-200 rounded-lg pl-4 py-2">
          <Link
            className="w-full text-default-500"
            href="/accessControl"
            size="lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Access Control
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  )
}