import { useState } from "react"
import {
    Input,
    Divider,
    Button,
    Popover, PopoverTrigger, PopoverContent,
    Accordion,
    AccordionItem
} from "@nextui-org/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhoneFlip } from '@fortawesome/free-solid-svg-icons'

export default function NewAuthorized({ type, info, toggleEdit, toggleDelete }) {
    const [getInfo, setInfo] = useState(info)
    const [isOpen, setIsOpen] = useState(false)

    const handleEdit = (e) => {

        setInfo({ ...getInfo, [e.target.name]: e.target.value })

        info[e.target.name] = e.target.value

        toggleEdit(type, info)
    }

    const handlerDelete = () => {
        toggleDelete(type, info)
        setIsOpen(false)
    }

    return (
        <>
            <div>
                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 md:gap-4">
                    <div className="mx-2 mb-4">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 dark:text-white">Name</label>

                        <Input
                            id='firstName'
                            name='firstName'
                            type="text"
                            autoComplete="off"
                            placeholder='Name'
                            value={getInfo.firstName ?? ''}
                            onChange={handleEdit}
                            isRequired
                        />
                    </div>
                    {/* <div className="mx-2 mb-4">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 dark:text-white">Last Name</label>

                        <Input
                            id='lastName'
                            name='lastName'
                            type="text"
                            autoComplete="off"
                            placeholder='Last Name'
                            value={getInfo.lastName ?? ''}
                            onChange={handleEdit}
                            isRequired
                        />
                    </div> */}
                    <div className="mx-2 mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-900 dark:text-white">Phone 1</label>
                        <Input
                            id='phone'
                            name='phone'
                            type="number"
                            autoComplete="off"
                            placeholder='Phone'
                            value={getInfo.phone ?? ''}
                            onChange={handleEdit}
                        />
                    </div>
                    <div className="mx-2 col-span-1">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-900 dark:text-white">Alternative phones</label>
                        <Accordion className="border-none p-0" isCompact>
                            <AccordionItem key="alternative_numbers" indicator={<FontAwesomeIcon icon={faPhoneFlip} />} aria-label="Phones" title="Phones">
                                <div className="mb-2 mx-2">
                                    <label htmlFor="phone2" className="block text-sm font-medium text-gray-900 dark:text-white">Phone 2</label>
                                    <Input
                                        id='phone2'
                                        name="phone2"
                                        type="number"
                                        autoComplete="off"
                                        value={getInfo.phone2 ?? ''}
                                        onChange={handleEdit}
                                    />
                                </div>

                                <div className="mb-2 mx-2">
                                    <label htmlFor="phone3" className="block text-sm font-medium text-gray-900 dark:text-white">Phone 3</label>
                                    <Input
                                        id='phone3'
                                        name="phone3"
                                        type="number"
                                        autoComplete="off"
                                        value={getInfo.phone3 ?? ''}
                                        onChange={handleEdit}
                                    />
                                </div>

                                <div className="mb-2 mx-2">
                                    <label htmlFor="phone4" className="block text-sm font-medium text-gray-900 dark:text-white">Phone 4</label>
                                    <Input
                                        id='phone4'
                                        name='phone4'
                                        type="number"
                                        autoComplete="off"
                                        value={getInfo.phone4 ?? ''}
                                        onChange={handleEdit}
                                    />
                                </div>

                                <div className="mb-2 mx-2">
                                    <label htmlFor="phone5" className="block text-sm font-medium text-gray-900 dark:text-white">Phone 5</label>
                                    <Input
                                        id='phone5'
                                        name='phone5'
                                        type="number"
                                        autoComplete="off"
                                        value={getInfo.phone5 ?? ''}
                                        onChange={handleEdit}
                                    />
                                </div>

                            </AccordionItem>
                        </Accordion>
                    </div>

                </div>
                <div className="flex justify-end mt-4">
                    <Popover placement="bottom" isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
                        <PopoverTrigger>
                            <Button color="danger" variant="ghost">Delete</Button>
                        </PopoverTrigger>
                        <PopoverContent className="pb-2">
                            <div className="px-1 py-2">
                                <div className="text-small font-bold">Are you sure to delete?</div>
                            </div>
                            <Button color="danger" variant="ghost" onClick={handlerDelete}>
                                Delete
                            </Button>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <Divider className="my-4" />
        </>
    )
}