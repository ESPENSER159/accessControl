"use client"
import { useEffect, useState } from 'react'
import Table from './table'
import { Spinner, Button } from "@nextui-org/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'

const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "USER", uid: "user", sortable: true },
    { name: "CONDOMINIUM", uid: "condominium", sortable: true },
    { name: "TYPE", uid: "type", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

export default function Users() {
    const [isLoading, setIsLoading] = useState(true)
    const [users, setUsers] = useState([])
    const [reload, setReload] = useState(false)

    const router = useRouter()

    const getUsers = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        await fetch("/api/users", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                setUsers(JSON.parse(result).users)
            })
            .catch((error) => {
                console.error(error)
            });


        setIsLoading(false)
        setReload(false)
    }

    useEffect(() => {
        setIsLoading(true)
        getUsers()
    }, [reload])

    return (
        <main className="d-flex justify-center">

            <p className='text-center my-6 text-2xl font-bold'>Users</p>

            <div className="gap-3 w-full flex justify-center mb-6">
                <Button color='primary' endContent={<FontAwesomeIcon icon={faPlus} size="lg"
                />}
                    onClick={() => router.push('/users/createUser')}
                >
                    Add New
                </Button>
            </div>

            {
                isLoading ?
                    <div className='flex justify-center items-center flex-col'>
                        <Spinner color="primary" size="lg" />
                    </div>
                    :
                    <div className='lg:mx-40 md:mx-20'>
                        <Table
                            columns={columns}
                            users={users}
                            reload={setReload}
                        />
                    </div>
            }
        </main>
    )
}