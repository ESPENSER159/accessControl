"use client"
import { useEffect, useState } from 'react'
import Table from '../components/createTable'
import { Spinner, Select, SelectItem, Input, Button, Link } from "@nextui-org/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'

const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "USER", uid: "user", sortable: true },
    { name: "CONDOMINIUM", uid: "condominium", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

export default function Users() {
    const [isLoading, setIsLoading] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const [users, setUsers] = useState([])

    const router = useRouter()

    const getUsers = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch("/api/users", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(JSON.parse(result).users)
                setUsers(JSON.parse(result).users)
            })
            .catch((error) => console.error(error));


        setIsLoading(false)
    }

    useEffect(() => {
        setIsLoading(true)
        getUsers()
    }, [])

    return (
        <main className="d-flex justify-center">

            <p className='text-center my-6 text-2xl font-bold'>Users</p>

            <div className="gap-3 w-full flex justify-center mb-6">
                <Button className='bg-primary-400' endContent={<FontAwesomeIcon icon={faPlus} size="lg"
                />}
                    onClick={() => router.push('/createUser')}
                >
                    Add New
                </Button>
            </div>

            {
                isLoading ?
                    <div className='flex justify-center items-center flex-col'>
                        <Spinner color="success" size="lg" />
                    </div>
                    :
                    <div className='lg:mx-40 md:mx-20'>
                        <Table
                            columns={columns}
                            users={users}
                        />
                    </div>
            }
        </main>
    )
}