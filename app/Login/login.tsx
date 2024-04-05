"use client"
import './Login.css'
import { Select } from "flowbite-react"
import { FormEvent, useEffect, useState } from 'react'
import { Alert } from "flowbite-react"
import Router from 'next/router'
import { Spinner } from "flowbite-react"

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<any>(null)
    const [IsLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Verificar si ya existe un token en el almacenamiento local al cargar la página
        const token = localStorage.getItem('token');
        if (token) {

            validateToken(token)

            // Router.push('/dashboard'); // Redirige si ya hay un token almacenado
        }
    }, []);

    const validateToken = async (token: any) => {
        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await response.json()
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "user": username,
                    "pass": password
                }),
            })

            console.log(response)
            const data = await response.json()
            console.log(data)

            if (response.ok) {
                if (data.status === 200) {
                    localStorage.setItem('token', data.token)
                    // Router.push('/dashboard') // Redirigir a página
                } else {
                    setError(data.message)
                }
            } else {
                setError(data.text())
            }

            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.error('Failed to login:', error)
            setError('Failed to login. Verify your credentials.')
        }
    }

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
                                <Select id="countries" required>
                                    <option value=''>Select...</option>
                                    <option>United States</option>
                                    <option>Canada</option>
                                    <option>France</option>
                                    <option>Germany</option>
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