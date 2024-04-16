"use client"
import {
    Button,
    Chip,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Spinner
} from "@nextui-org/react";
import { useState } from 'react'
import axios from 'axios'

export default function ModalEdit({ edit, data, onClose, setReload }) {
    const [name, setName] = useState(data && data.name)
    const [address, setAddress] = useState(data && data.address)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError()

        await axios.post('/api/condominiums', {
            id: data && data.id,
            edit: edit,
            toEdit: data && data.name,
            name: name,
            address: address,
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


    return (
        <>
            <ModalHeader className="flex justify-center text-2xl font-bold my-4"> {edit ? 'Edit' : 'Create'} Condominium</ModalHeader>
            <ModalBody>
                <form className="w-full space-y-4 md:space-y-6" onSubmit={handleSubmit} autoComplete="off" >

                    {isLoading ?
                        <div className='text-center'>
                            <Spinner color="success" size="lg" />
                        </div>
                        :
                        <>
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Condominium name</label>

                                <Input
                                    type="text"
                                    autoComplete="off"
                                    id='name'
                                    placeholder='Name'
                                    value={name}
                                    onValueChange={setName}
                                    onClear={() => console.log("input cleared")}
                                    isRequired
                                />
                            </div>
                            <div>
                                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Condominium address</label>

                                <Input
                                    id='address'
                                    type="text"
                                    autoComplete="off"
                                    placeholder='Address'
                                    value={address}
                                    onValueChange={setAddress}
                                    onClear={() => console.log("input cleared")}
                                    isRequired
                                />
                            </div>
                        </>
                    }

                    <ModalFooter className="text-center flex justify-between">
                        <Button isDisabled={isLoading} color="default" onPress={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" color="primary" variant="ghost" isLoading={isLoading}>
                            {edit ? 'Edit' : 'Create'}
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