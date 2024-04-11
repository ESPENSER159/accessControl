import {
    Button,
    Chip,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Select, SelectItem, Input,
    Spinner
} from "@nextui-org/react";

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { Switch } from "@nextui-org/react"
import axios from 'axios'

export default function ModalEditUser({ edit, dataUser, onClose, setReload }) {
    const [username, setUsername] = useState(dataUser && dataUser.user)
    const [password, setPassword] = useState('')
    const [condominium, setCondominium] = useState('condominium_1')
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [isAdmin, setIsAdmin] = useState(dataUser && dataUser.type === 'admin' ? true : false)

    const [getCondominiums, setCondominiums] = useState([])

    const toggleVisibility = () => setIsVisible(!isVisible)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError()

        let dataCondominium = condominium.replaceAll(' ', '').split('-')

        await axios.post('/api/users', {
            id: dataUser && dataUser.id,
            edit: edit,
            userToEdit: dataUser && dataUser.user,
            condominiumToEdit: dataUser && dataUser.condominium,
            user: username,
            pass: password,
            condominium: dataCondominium[0],
            type: isAdmin
        }).then(function (response) {
            const res = response.data

            if (res.status === 200) {
                setReload(true)
                onClose()
            } else {
                setError(res.message)
            }
        }).catch(function (error) {
            console.log(error)
        })

        setIsLoading(false)
    }


    const getCondoms = async () => {
        await axios.get('/api/condominiums')
            .then(function (response) {
                setCondominiums(response.data.info)
            })
            .catch(function (error) {
                console.log(error)
            })

        setIsLoading(false)
    }

    useEffect(() => {
        setIsLoading(true)
        getCondoms()
    }, [])


    return (
        <>
            <ModalHeader className="flex justify-center text-2xl font-bold my-4"> {edit ? 'Edit' : 'Create'} User</ModalHeader>
            <ModalBody>
                <form className="w-full space-y-4 md:space-y-6" onSubmit={handleSubmit} autoComplete="off" >

                    {isLoading ?
                        <div className='text-center'>
                            <Spinner color="success" size="lg" />
                        </div>
                        :
                        <>
                            <div>
                                <label htmlFor="condominium" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Condominium</label>

                                <Select
                                    isRequired
                                    id='condominium'
                                    aria-label='condominium'
                                    placeholder="Select an condominium"
                                    variant='faded'
                                    value={condominium}
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

                            <div className='text-center'>
                                <Switch color='primary' isSelected={isAdmin} onValueChange={setIsAdmin}>
                                    Admin
                                </Switch>
                            </div>
                        </>
                    }

                    <ModalFooter className="text-center flex justify-between">
                        <Button isDisabled={isLoading} color="default" onPress={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" color="primary" variant="ghost" isLoading={isLoading}>
                            {edit ? 'Edit' : 'Create'} User
                        </Button>
                    </ModalFooter>
                </form>

                {error &&
                    <Chip color="danger" className='min-w-full py-4 rounded-md mb-2' variant="bordered">{error}</Chip>
                }

            </ModalBody>
        </>
    )
}