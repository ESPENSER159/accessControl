import {
    Button,
    Chip,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@nextui-org/react";
import { useState } from 'react'
import axios from 'axios'

export default function ModalDeleteUser({ dataUser, onClose, setReload }) {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handlerDeleteUser = async () => {
        setIsLoading(true)

        await axios.post('/api/users/deleteUser', {
            id: dataUser.id,
            user: dataUser.user,
            condominium: dataUser.condominium
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
            <ModalHeader className="flex flex-col gap-1">Delete User</ModalHeader>
            <ModalBody>
                <p>
                    Are you sure to delete the user?
                </p>
                <div className="text-center">
                    <div>
                        <p className="font-bold">
                            ID:
                        </p>
                        {dataUser.id}
                    </div>
                    <br />
                    <div>
                        <p className="font-bold">
                            USER:
                        </p>
                        {dataUser.user}
                    </div>
                    <br />
                    <div>
                        <p className="font-bold">
                            CONDOMINIUM:
                        </p>
                        {dataUser.condominium}
                    </div>
                </div>

                {error &&
                    <Chip color="danger" className='min-w-full py-4 rounded-md' variant="bordered">{error}</Chip>
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