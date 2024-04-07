"use client"
import './login.css'
import { Select, SelectItem, Input } from "@nextui-org/react"
import { FormEvent, useEffect, useState } from 'react'
import { Spinner } from "@nextui-org/react";
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [condominium, setCondominium] = useState('')
    const [error, setError] = useState<any>(null)
    const [IsLoading, setIsLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const router = useRouter()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const res = await signIn('credentials', {
            email: username,
            password: password,
            condominium: condominium,
            redirect: false
        })

        if (res?.error) {
            setError(res?.error)
        } else {
            localStorage.setItem('user', username)
            localStorage.setItem('location', condominium)
            router.push('/registerAccess')
        }

        setIsLoading(false)
    }

    useEffect(() => {
        router.refresh()
    }, [IsLoading])

    return (
        <section>
            <div className="backgroundLogin"></div>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <img className="w-44 h-44 mr-2" src="./loginIcon.svg" alt="logo" />
                <div className="w-full bg-white rounded-xl shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                            Login
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit} autoComplete="off" >
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

                            {IsLoading ?
                                <div className='text-center'>
                                    <Spinner color="success" size="lg" />
                                </div>
                                :
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                            }

                            {error &&
                                <div className='bg-red-200 w-full rounded p-3 text-red-500'>
                                    {error}
                                </div>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}