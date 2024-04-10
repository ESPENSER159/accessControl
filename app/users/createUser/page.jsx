"use client"
import { useState } from 'react'
import { Spinner, Select, SelectItem, Input, Chip, Button } from "@nextui-org/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { Switch } from "@nextui-org/react"
import { useRouter } from 'next/navigation'

export default function CreateUser() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [condominium, setCondominium] = useState('')
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    const router = useRouter()

    const toggleVisibility = () => setIsVisible(!isVisible)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "user": username,
            "pass": password,
            "condominium": condominium,
            "type": isAdmin
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        await fetch("/api/users/createUser", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                const res = JSON.parse(result)

                if (res.status === 200) {
                    router.push('/users')
                } else {
                    setError(res.message)
                }
            })
            .catch((error) => console.error(error))

        setIsLoading(false)
    }

    return (
        <main className="d-flex justify-center">
            <div className='w-full flex justify-center text-center mb-8'>
                <form className="w-80 space-y-4 md:space-y-6" onSubmit={handleSubmit} autoComplete="off" >

                    <p className='text-center my-6 text-2xl font-bold'>Create User</p>

                    <div>
                        <label htmlFor="condominium" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Condominium</label>

                        <Select
                            isRequired
                            id='condominium'
                            aria-label='condominium'
                            placeholder="Select an condominium"
                            variant='faded'
                            className='focus:ring-primary-600 focus:border-primary-600'
                            onChange={(e) => {
                                setCondominium(e.target.value)
                                setError(null)
                            }}
                        >
                            <SelectItem key='condominium_1' value='condominium_1'>
                                Condominium 1
                            </SelectItem>
                            <SelectItem key='condominium_2' value='condominium_2'>
                                Condominium 2
                            </SelectItem>
                        </Select>
                    </div>
                    <div>
                        <label htmlFor="user" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User</label>

                        <Input
                            type="text"
                            autoComplete="off"
                            id='user'
                            placeholder='User'
                            value={username}
                            onValueChange={setUsername}
                            onClear={() => console.log("input cleared")}
                            isRequired
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>

                        <Input
                            id='password'
                            autoComplete="off"
                            placeholder='Password'
                            value={password}
                            onValueChange={setPassword}
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <FontAwesomeIcon icon={faEyeSlash} />
                                    ) : (
                                        <FontAwesomeIcon icon={faEye} />
                                    )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            isRequired
                        />
                    </div>

                    <Switch color='primary' isSelected={isAdmin} onValueChange={setIsAdmin}>
                        Admin
                    </Switch>

                    <div>
                        <Button type="submit" className="w-full text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-500 dark:hover:bg-primary-600 dark:focus:ring-primary-800" isLoading={isLoading}>
                            Create User
                        </Button>
                    </div>

                    {/* {isLoading ?
                        <div className='text-center'>
                            <Spinner color="success" size="lg" />
                        </div>
                        :
                        <button type="submit" className="w-full text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-500 dark:hover:bg-primary-600 dark:focus:ring-primary-800">Create User</button>
                    } */}

                    {error &&
                        <Chip color="danger" className='min-w-full py-4 rounded-md' variant="bordered">{error}</Chip>
                    }
                </form>
            </div>
        </main>
    )
}