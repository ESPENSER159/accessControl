import {
    Button,
    Chip,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Select, SelectItem, Input
} from "@nextui-org/react";

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { Switch } from "@nextui-org/react"

export default function ModalEditUser({ edit, dataUser, onClose, setReload }) {
    const [username, setUsername] = useState(dataUser && dataUser.user)
    const [password, setPassword] = useState('')
    const [condominium, setCondominium] = useState('condominium_1')
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [isAdmin, setIsAdmin] = useState(dataUser && dataUser.type === 'admin' ? true : false)

    const toggleVisibility = () => setIsVisible(!isVisible)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError()

        if (edit) {
            console.log(`Edit user`)
        } else {
            console.log(`Create user`)
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "id": dataUser && dataUser.id,
            "edit": edit,
            "userToEdit": dataUser && dataUser.user,
            "condominiumToEdit": dataUser && dataUser.condominium,
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

        await fetch("/api/users", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                const res = JSON.parse(result)

                if (res.status === 200) {
                    setReload(true)
                    onClose()
                } else {
                    setError(res.message)
                }
            })
            .catch((error) => console.error(error))

        setIsLoading(false)
    }

    return (
        <>
            <ModalHeader className="flex justify-center text-2xl font-bold my-4"> {edit ? 'Edit' : 'Create'} User</ModalHeader>
            <ModalBody>
                <form className="w-full space-y-4 md:space-y-6" onSubmit={handleSubmit} autoComplete="off" >
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

                    <div className='text-center'>
                        <Switch color='primary' isSelected={isAdmin} onValueChange={setIsAdmin}>
                            Admin
                        </Switch>
                    </div>

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