"use client"
import {
    Button,
    Chip,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Spinner,
    Accordion,
    AccordionItem,
    Select,
    SelectItem
} from "@nextui-org/react"
import { useState, useEffect } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPhoneFlip, faUser, faPeopleRoof, faPeopleGroup } from '@fortawesome/free-solid-svg-icons'
import NewAuthorized from "./newAuthorized"

export default function ModalEdit({ edit, data, onClose, setReload }) {
    const [firstName, setFirstName] = useState(data && data.firstName)
    const [lastName, setLastName] = useState(data && data.lastName)
    const [getCondominiums, setCondominiums] = useState([])
    const [condominium, setCondominium] = useState(data && data.condominium)
    const [address, setAddress] = useState(data && data.address)
    const [phone, setPhone] = useState(data && data.phone1)
    const [alternativePhones, setAlternativePhones] = useState({
        phone2: data ? data.phone2 : undefined,
        phone3: data ? data.phone3 : undefined,
        phone4: data ? data.phone4 : undefined,
        phone5: data ? data.phone5 : undefined
    })
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const [family, setFamily] = useState(data ? data.family : [])
    const [authorized, setAuthorized] = useState(data ? data.authorized : [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError()

        await axios.post('/api/residents', {
            id: data && data.id,
            edit: edit,
            toEdit: data && data.address,
            firstName: firstName,
            lastName: lastName,
            condominium: condominium,
            address: address,
            phone: phone,
            alternativePhones: alternativePhones,
            family: family,
            authorized: authorized
        }).then(function (response) {
            const res = response.data

            if (res.status === 200) {
                setReload(true)

                setTimeout(function () {
                    onClose()
                }, 100)
            } else {
                setError(res.message)
            }
        }).catch(function (error) {
            console.log(error)
        })

        setIsLoading(false)
    }


    const addNewAuthorized = (type) => {
        type === 'family' ?
            setFamily([...family, { id: new Date(), isNew: true }])
            :
            setAuthorized([...authorized, { id: new Date(), isNew: true }])

    }

    const toggleEdit = (type, data) => {
        type === 'family' ?
            setFamily(
                family.map(family => family.id === data.id ? { ...family, first_name: data.first_name } : family)
            )
            :
            setAuthorized(
                authorized.map(authorized => authorized.id === data.id ? { ...authorized, first_name: data.first_name } : authorized)
            )

    }

    const toggleDelete = (type, data) => {
        type === 'family' ?
            setFamily(family.filter(family => family.id !== data.id))
            :
            setAuthorized(authorized.filter(authorized => authorized.id !== data.id))

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
            <ModalHeader className="flex justify-center text-2xl font-bold mt-4 mb-0"> {edit ? 'Edit' : 'Create'} Resident</ModalHeader>
            <ModalBody className="p-0 sm:px-6">
                <div className="px-4">
                    {error &&
                        <Chip className='min-w-full h-auto mt-4 py-2 rounded-md text-wrap' color="danger" variant="bordered">
                            {error}
                        </Chip>
                    }
                </div>

                {/* <Button color='primary' endContent={<FontAwesomeIcon icon={faPlus} size="lg"
                />} onClick={() => {
                    console.log(condominium)

                    console.log(getCondominiums.filter(condominiums => condominiums.id === data.condominium)[0].name)
                }} >
                    Show info
                </Button> */}

                <form className="w-full space-y-4 md:space-y-6" onSubmit={handleSubmit} autoComplete="off" >

                    {isLoading ?
                        <div className='text-center'>
                            <Spinner color="success" size="lg" />
                        </div>
                        :
                        <>
                            <Accordion variant="splitted" defaultExpandedKeys={["1"]}>
                                <AccordionItem key="1" keepContentMounted={true} aria-label="Resident" title="Resident" startContent={<FontAwesomeIcon icon={faUser} className="text-primary" />}>
                                    <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 md:gap-4">
                                        <div className="mx-2 mb-4">
                                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 dark:text-white">First Name</label>

                                            <Input
                                                type="text"
                                                autoComplete="off"
                                                id='firstName'
                                                placeholder='First Name'
                                                value={firstName ?? ''}
                                                onValueChange={setFirstName}
                                                onClear={() => console.log("input cleared")}
                                                isRequired
                                            />
                                        </div>
                                        <div className="mx-2 mb-4">
                                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 dark:text-white">Last Name</label>

                                            <Input
                                                id='lastName'
                                                type="text"
                                                autoComplete="off"
                                                placeholder='Last Name'
                                                value={lastName ?? ''}
                                                onValueChange={setLastName}
                                                onClear={() => console.log("input cleared")}
                                                isRequired
                                            />
                                        </div>
                                        <div className="mx-2 mb-4">
                                            <label htmlFor="condominium" className="block text-sm font-medium text-gray-900 dark:text-white">Condominium</label>

                                            <Select
                                                isRequired
                                                id='condominium'
                                                aria-label='condominium'
                                                placeholder="Select an condominium"
                                                variant='faded'
                                                // value={condominium}
                                                selectedKeys={condominium ? [`${condominium}`] : []}
                                                // defaultSelectedKeys={[`${condominium}`]}
                                                className='focus:ring-primary-600 focus:border-primary-600'
                                                onChange={(e) => {
                                                    // let dataCondominium = e.target.value.replaceAll(' ', '').split('-')
                                                    // setCondominium(dataCondominium[0])
                                                    setCondominium(e.target.value)
                                                    setError(null)
                                                }}
                                            >
                                                {getCondominiums &&
                                                    getCondominiums.map((value) => {
                                                        return (
                                                            <SelectItem key={value.id} textValue={value.name}>
                                                                {value.name}
                                                            </SelectItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </div>
                                        <div className="mx-2 mb-4">
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-900 dark:text-white">Address</label>

                                            <Input
                                                id='address'
                                                type="text"
                                                autoComplete="off"
                                                placeholder='Address'
                                                value={address ?? ''}
                                                onValueChange={setAddress}
                                                onClear={() => console.log("input cleared")}
                                                isRequired
                                            />
                                        </div>
                                        <div className="mx-2 mb-4">
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-900 dark:text-white">Main phone</label>
                                            <Input
                                                id='phone'
                                                type="number"
                                                autoComplete="off"
                                                placeholder='Phone'
                                                value={phone ?? ''}
                                                onValueChange={setPhone}
                                                onClear={() => console.log("input cleared")}
                                                isRequired
                                            />
                                        </div>
                                        <div className="mx-2 col-span-1">
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-900 dark:text-white">Alternative phones</label>
                                            <Accordion className="border-none p-0" isCompact>
                                                <AccordionItem key="alternative_numbers" indicator={<FontAwesomeIcon icon={faPhoneFlip} />} aria-label="Phones" title="Phones">
                                                    <div className="mb-2 mx-2">
                                                        <label htmlFor="phone2" className="block text-sm font-medium text-gray-900 dark:text-white">Phone Two</label>
                                                        <Input
                                                            id='phone2'
                                                            type="number"
                                                            autoComplete="off"
                                                            value={alternativePhones.phone2 ?? ''}
                                                            onValueChange={(e) => setAlternativePhones({ ...alternativePhones, phone2: e })}
                                                            onClear={() => console.log("input cleared")}
                                                        />
                                                    </div>

                                                    <div className="mb-2 mx-2">
                                                        <label htmlFor="phone3" className="block text-sm font-medium text-gray-900 dark:text-white">Phone Three</label>
                                                        <Input
                                                            id='phone3'
                                                            type="number"
                                                            autoComplete="off"
                                                            value={alternativePhones.phone3 ?? ''}
                                                            onValueChange={(e) => setAlternativePhones({ ...alternativePhones, phone3: e })}
                                                            onClear={() => console.log("input cleared")}
                                                        />
                                                    </div>

                                                    <div className="mb-2 mx-2">
                                                        <label htmlFor="phone4" className="block text-sm font-medium text-gray-900 dark:text-white">Phone Four</label>
                                                        <Input
                                                            id='phone4'
                                                            type="number"
                                                            autoComplete="off"
                                                            value={alternativePhones.phone4 ?? ''}
                                                            onValueChange={(e) => setAlternativePhones({ ...alternativePhones, phone4: e })}
                                                            onClear={() => console.log("input cleared")}
                                                        />
                                                    </div>

                                                    <div className="mb-2 mx-2">
                                                        <label htmlFor="phone5" className="block text-sm font-medium text-gray-900 dark:text-white">Phone Five</label>
                                                        <Input
                                                            id='phone5'
                                                            type="number"
                                                            autoComplete="off"
                                                            value={alternativePhones.phone5 ?? ''}
                                                            onValueChange={(e) => setAlternativePhones({ ...alternativePhones, phone5: e })}
                                                            onClear={() => console.log("input cleared")}
                                                        />
                                                    </div>
                                                </AccordionItem>
                                            </Accordion>
                                        </div>
                                    </div>
                                </AccordionItem>
                                <AccordionItem key="2" aria-label="Family" title="Family" startContent={<FontAwesomeIcon icon={faPeopleRoof} className="text-primary" />}>
                                    {family && family.map((value, index) => (
                                        <NewAuthorized type='family' info={value} key={index} toggleEdit={toggleEdit} toggleDelete={toggleDelete} />
                                    ))}

                                    <div className="gap-3 w-full flex justify-center mb-6">
                                        <Button color='primary' endContent={<FontAwesomeIcon icon={faPlus} size="lg"
                                        />} onClick={() => addNewAuthorized('family')} >
                                            Add
                                        </Button>
                                    </div>
                                </AccordionItem>
                                <AccordionItem key="3" aria-label="Authorized" title="Authorized" startContent={<FontAwesomeIcon icon={faPeopleGroup} className="text-primary" />}>
                                    {authorized && authorized.map((value, index) => (
                                        <NewAuthorized info={value} key={index} toggleEdit={toggleEdit} toggleDelete={toggleDelete} />
                                    ))}

                                    <div className="gap-3 w-full flex justify-center mb-6">
                                        <Button color='primary' endContent={<FontAwesomeIcon icon={faPlus} size="lg"
                                        />} onClick={() => addNewAuthorized()} >
                                            Add
                                        </Button>
                                    </div>
                                </AccordionItem>
                            </Accordion>
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

            </ModalBody>
        </>
    )
}