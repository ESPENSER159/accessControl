"use client"
import {
    Button,
    Chip,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@nextui-org/react";
import { useState } from 'react'
import axios from 'axios'

export default function ModalDelete({ data, onClose, setReload }) {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handlerDeleteUser = async () => {
        setIsLoading(true)
        setError()

        await axios.post('/api/condominiums/delete', {
            id: data.id,
            name: data.name,
            address: data.address
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
            <ModalHeader className="flex flex-col gap-1">Delete Condominium</ModalHeader>
            <ModalBody>
                <p>
                    Are you sure to delete?
                </p>
                <div className="text-center">
                    <div>
                        <p className="font-bold">
                            ID:
                        </p>
                        {data.id}
                    </div>
                    <br />
                    <div>
                        <p className="font-bold">
                            CONDOMINIUM NAME:
                        </p>
                        {data.name}
                    </div>
                    <br />
                    <div>
                        <p className="font-bold">
                            CONDOMINIUM ADDRESS:
                        </p>
                        {data.address}
                    </div>
                </div>

                {error &&
                    <Chip className='min-w-full h-auto mt-4 py-2 rounded-md text-wrap' color="danger" variant="bordered">
                        <p color="danger">{error}</p>
                    </Chip>
                }

            </ModalBody>
            <ModalFooter className="text-center flex justify-between">
                <Button isDisabled={isLoading} color="default" onPress={onClose}>
                    Cancel
                </Button>
                <Button color="danger" variant="ghost" isLoading={isLoading} onPress={handlerDeleteUser}>
                    Delete
                </Button>
            </ModalFooter>
        </>
    )
}