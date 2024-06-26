"use client"
import './login.css'
import { Select, SelectItem, Input, Chip } from "@nextui-org/react"
import { useEffect, useState } from 'react'
import { Spinner, Image, Button } from "@nextui-org/react";
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    // const [condominium, setCondominium] = useState('')
    const [error, setError] = useState(null)
    const [IsLoading, setIsLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    // const [getCondominiums, setCondominiums] = useState([])

    const toggleVisibility = () => setIsVisible(!isVisible);

    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        // let dataCondominium = condominium.replaceAll(' ', '').split('-')

        const res = await signIn('credentials', {
            email: username,
            password: password,
            // condominium: dataCondominium[0],
            redirect: false
        })

        if (res?.error) {
            setError(res?.error)
        } else {
            router.push('/accessControl')
        }

        setIsLoading(false)
    }

    useEffect(() => {
        router.refresh()
    }, [IsLoading, router])

    // const getCondoms = async () => {
    //     await axios.get('/api/condominiums')
    //         .then(function (response) {
    //             setCondominiums(response.data.info)
    //         })
    //         .catch(function (error) {
    //             console.log(error)
    //         })

    //     setIsLoading(false)
    // }

    // useEffect(() => {
    //     setIsLoading(true)
    //     getCondoms()
    // }, [])

    return (
        <section>
            <div className="backgroundLogin"></div>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
                <div className="w-full bg-white rounded-xl shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

                        <div className='flex justify-center mt-0 mb-10'>
                            <Image
                                className="w-60 h-auto mr-2"
                                src="/bluelogo.png"
                                alt="Login icon"
                                width={240}
                                height={240}
                            />
                        </div>

                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit} autoComplete="off" >

                            {IsLoading ?
                                <div className='text-center'>
                                    <Spinner color="primary" size="lg" />
                                </div>
                                :
                                <>
                                    {/* <div>
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
                                            {getCondominiums &&
                                                getCondominiums.map((value) => {
                                                    return (
                                                        <SelectItem key={`${value.id} - ${value.name}`} textValue={value.name}>
                                                            {value.name}
                                                        </SelectItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </div> */}
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

                                    <Button type="submit" color='primary' className="w-full text-white hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</Button>
                                </>
                            }

                            {error &&
                                <Chip color="danger" className='min-w-full py-4 rounded-md mb-2' variant="bordered">{error}</Chip>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}