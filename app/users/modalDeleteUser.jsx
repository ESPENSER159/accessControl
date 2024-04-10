import {
    Button,
    Chip,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@nextui-org/react";

export default function ModalDeleteUser({ id, user, condominium, isLoading, error, onClose, handlerDeleteUser }) {
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
                        {id}
                    </div>
                    <br />
                    <div>
                        <p className="font-bold">
                            USER:
                        </p>
                        {user}
                    </div>
                    <br />
                    <div>
                        <p className="font-bold">
                            CONDOMINIUM:
                        </p>
                        {condominium}
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