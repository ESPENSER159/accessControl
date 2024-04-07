"use client"
import './login.css'
import { Select } from "flowbite-react"
import { FormEvent, useEffect, useState } from 'react'
import { Alert } from "flowbite-react"
import { Spinner } from "flowbite-react"
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [condominium, setCondominium] = useState('')
    const [error, setError] = useState<any>(null)
    const [IsLoading, setIsLoading] = useState(false)

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
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="user" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">condominium</label>
                                <Select id="countries" onChange={(e) => {
                                    setCondominium(e.target.value)
                                    setError(null)
                                }} required>
                                    <option value=''>Select...</option>
                                    <option value='condominium_1'>Condominium 1</option>
                                    <option value='condominium_2'>Condominium 2</option>
                                </Select>
                            </div>
                            <div>
                                <label htmlFor="user" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User</label>
                                <input type="text" name="user" id="user" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={username} onChange={(e) => {
                                    setUsername(e.target.value)
                                    setError(null)
                                }} required />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={password} onChange={(e) => {
                                    setPassword(e.target.value)
                                    setError(null)
                                }
                                } required />
                            </div>

                            {IsLoading ?
                                <div className='text-center'>
                                    <Spinner color="success" aria-label="Success spinner example" size="lg" />
                                </div>
                                :
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                            }

                            {error &&
                                <Alert color="failure">
                                    {error}
                                </Alert>}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}