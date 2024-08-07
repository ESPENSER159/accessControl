"use client"
import React from "react"
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Pagination,
    Spinner,
    Chip,
    Avatar,
    Select,
    SelectItem,
    Card,
    CardHeader,
    CardBody
} from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPeopleRoof, faPeopleGroup, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { arrayToCSV, downloadCSV } from '../libs/downloadCSV'
import './incomeRecord.css'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { formatDate } from "../libs/getCurrentDate";

const columns = [
    // { name: "ID", uid: "id", sortable: true },
    { name: "AUTHORIZED NAME", uid: "firstName", sortable: true },
    { name: "TYPE", uid: "type", sortable: true },
    { name: "RESIDENT NAME", uid: "resident_name", sortable: true },
    { name: "RESIDENT PHONE", uid: "phone", sortable: true },
    { name: "CONDOMINIUM", uid: "condominium_name", sortable: true },
    { name: "ADDRESS", uid: "address", sortable: true },
    { name: "LICENSE", uid: "license_num", sortable: true },
    { name: "CARDTAG", uid: "card_num", sortable: true },
    { name: "ACCESS BY", uid: "access_by", sortable: true },
    { name: "DATE", uid: "date", sortable: true }
]

const TableAuthorized = ({ setError }) => {
    const [users, setUsers] = React.useState([])
    const [usersFilter, setUsersFilter] = React.useState([])
    const [filterValue, setFilterValue] = React.useState("")
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const [isLoading, setIsLoading] = React.useState(false)
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "age",
        direction: "ascending",
    })

    // Datepicker
    const [startDateCalendar, setStartDateCalendar] = React.useState()
    const [endDateCalendar, setEndDateCalendar] = React.useState()

    const [resident, setResident] = React.useState('')
    const [getResidents, setGetResidents] = React.useState([])
    const [condominium, setCondominium] = React.useState('')
    const [getCondominiums, setCondominiums] = React.useState([])

    const [isSelectCondom, setIsSelectCondom] = React.useState(false)
    const [isLoadResidents, setIsLoadResidents] = React.useState(false)

    const [isAdmin, setIsAdmin] = React.useState(false)
    const [isLoadingBtn, setIsLoadingBtn] = React.useState(false)
    const [reading, setReading] = React.useState('')
    const [idGuest, setIdGuest] = React.useState('')
    const [isLoadLicense, setIsLoadLicense] = React.useState(false)
    const [showUpdateLicense, setShowUpdateLicense] = React.useState(false)

    const getInfoGuest = React.useCallback(async (idKey) => {
        // console.log(idKey)
        setShowUpdateLicense(true)
        setIsLoadLicense(true)

        if (idKey) {
            await axios.post('/api/infoGuest', {
                idGuest: idKey
            }).then(function (response) {
                setReading(response.data.info.card_num)
            }).catch(function (error) {
                console.log(error)
                setError(error)
            })
        } else {
            setReading('')
        }

        setIsLoadLicense(false)

    }, [setError])

    const getAllResidents = React.useCallback(async (condom) => {
        // console.log(condom)
        setIsLoadResidents(true)
        setResident('')

        await axios.post('/api/residents/all', {
            idCondominium: condom.split(' - ')[0]
        }).then(function (response) {
            setGetResidents(response.data.info)
        }).catch(function (error) {
            console.log(error)
            setError(error)
        })

        setIsLoadResidents(false)
    }, [setError])

    const getSession = React.useCallback(async () => {
        setIsSelectCondom(false)

        await axios.get('/api/session')
            .then(function (response) {
                // console.log(response)
                let typeUser = response.data.session.user.email === 'super admin' ? true : false

                setIsAdmin(typeUser)

                if (!typeUser) {
                    getAllResidents(response.data.session.user.image[0])
                    setIsSelectCondom(true)
                }
            })
            .catch(function (error) {
                console.log(error)
                setError(error)
            })
    }, [setError, getAllResidents])

    const getCondoms = React.useCallback(async () => {
        await axios.get('/api/condominiums')
            .then(function (response) {
                setCondominiums(response.data.info)
            })
            .catch(function (error) {
                console.log(error)
                setError(error)
            })
    }, [setError])

    const getInfoForTableGuest = React.useCallback(async (data) => {
        await axios.post('/api/incomeRecord/guest', {
            idCondominium: !isAdmin && localStorage.getItem('idLocation')
        }).then(function (response) {
            const res = response.data

            if (res.status === 200) {
                // console.log(res.info)
                setUsers([...data, ...res.info])
            } else {
                console.log(res.message)
                setError(res.message)
            }
        }).catch(function (error) {
            console.log(error)
            setError(error)
        })

        setIsLoading(false)
    }, [setError, isAdmin])

    const getInfoForTable = React.useCallback(async () => {
        setShowUpdateLicense(false)
        setIsLoading(true)

        await axios.post('/api/incomeRecord/authorized', {
            idCondominium: !isAdmin && localStorage.getItem('idLocation')
        }).then(function (response) {
            const res = response.data

            if (res.status === 200) {
                // console.log(res.info)
                setUsers(res.info)
                getInfoForTableGuest(res.info)
            } else {
                console.log(res.message)
                setError(res.message)
            }
        }).catch(function (error) {
            console.log(error)
            setError(error)
        })
    }, [setError, getInfoForTableGuest, isAdmin])

    React.useEffect(() => {
        getSession()

        setIsLoading(true)
        getCondoms()
        getInfoForTable()
    }, [getInfoForTable, getCondoms, getSession])


    const updateGuest = async (e) => {
        e.preventDefault()
        setIsLoadingBtn(true)

        await axios.post('/api/infoGuest/update', {
            idGuest: idGuest,
            cardtag: reading
        }).then(function (response) {
            // console.log(response)
        }).catch(function (error) {
            console.log(error)
            setError(error)
        })

        setReading('')
        setIsLoadingBtn(false)
        getInfoForTable()
    }


    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.firstName && user.firstName.toLowerCase().includes(filterValue.toLowerCase().replaceAll(' ', ''))
                || user.lastName && user.lastName.toLowerCase().includes(filterValue.toLowerCase().replaceAll(' ', ''))
                || user.resident_name && user.resident_name.toLowerCase().includes(filterValue.toLowerCase())
                || user.resident_last_name && user.resident_last_name.toLowerCase().includes(filterValue.toLowerCase())

                || user.address && user.address.toLowerCase().includes(filterValue.toLowerCase())
                || user.access_by && user.access_by.toLowerCase().includes(filterValue.toLowerCase())

                // || user.condominium_name && user.condominium_name.toLowerCase().includes(filterValue.toLowerCase())
                // || `${user.condominium_name}`.replaceAll(' ', '').toLowerCase().includes(filterValue.toLowerCase().replaceAll(' ', ''))
                // || `${user.condominium_name}/${user.resident_name}${user.resident_last_name}`.replaceAll(' ', '').toLowerCase().includes(filterValue.toLowerCase().replaceAll(' ', ''))
                // || `${user.resident_name}${user.resident_last_name}`.replaceAll(' ', '').toLowerCase().includes(filterValue.toLowerCase().replaceAll(' ', ''))

                // || user.date.toLowerCase().includes(filterValue.toLowerCase())
            )
        }

        if (startDateCalendar) {
            filteredUsers = filteredUsers.filter((user) =>
                new Date(user.date) >= new Date(startDateCalendar) && new Date(user.date) <= new Date(endDateCalendar)
            )
        }

        if (condominium) {
            filteredUsers = filteredUsers.filter((user) =>
                user.condominium_name && user.condominium_name.toLowerCase().includes(condominium.split(' - ')[1].toLowerCase())
            )
        }

        if (resident) {
            filteredUsers = filteredUsers.filter((user) =>
                user.resident_name && `${user.resident_name.toLowerCase().replaceAll(' ', '')}${user.resident_last_name.toLowerCase().replaceAll(' ', '')}` === resident.split(' - ')[1].toLowerCase().replaceAll(' ', '')
            )
        }

        return filteredUsers;
    }, [users, filterValue, hasSearchFilter, startDateCalendar, endDateCalendar, condominium, resident]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        setUsersFilter(filteredItems)

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "id":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{cellValue}</p>
                    </div>
                )
            case "firstName":
                return (
                    <div className="flex justify-start items-center flex-row">
                        {/* <Avatar
                            icon={<FontAwesomeIcon icon={user.type === 'family' ? faPeopleRoof : faPeopleGroup} className="text-primary" size="lg" />}
                            className="min-w-10"
                        /> */}
                        <p className="ml-2 text-bold text-small capitalize">{cellValue} {user.lastName}</p>
                    </div >
                )
            case "type":
                return (
                    <div className="flex justify-start items-center flex-row">
                        <Avatar
                            icon={<FontAwesomeIcon icon={user.type === 'family' ? faPeopleRoof : faPeopleGroup} className="text-primary" size="lg" />}
                            className="min-w-10 mr-2"
                        />
                        <Chip className="capitalize" color={cellValue === 'family' ? "primary" : "warning"} size="sm" variant="flat">
                            {cellValue}
                        </Chip>
                    </div>
                )
            case "resident_name":
                return (
                    <div className="flex justify-start items-center flex-row">
                        {/* <Avatar
                            icon={<FontAwesomeIcon icon={faPersonShelter} className="text-primary" size="lg" />}
                            className="min-w-10"
                        /> */}
                        <p className="ml-2 text-bold text-small capitalize">{cellValue} {user.resident_last_name}</p>
                    </div >
                )
            case "date":
                return (
                    <p className="ml-2 text-bold text-small capitalize">{cellValue.split('T')[0]} {cellValue.split('T')[1].split('.')[0]}</p>
                )
            default:
                return cellValue;
        }
    }, []);

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])

    const createCSV = React.useCallback(() => {
        let csv = arrayToCSV(usersFilter)
        let nombreArchivo = "Authorized.csv"

        downloadCSV(csv, nombreArchivo)
    }, [usersFilter])

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4 mt-2 mx-2 sm:mx-none">
                <Input
                    isClearable
                    className="w-full sm:max-w-[70%] md:max-w-[44%]"
                    placeholder="Search..."
                    startContent={<FontAwesomeIcon icon={faMagnifyingGlass} size="lg" width={20} />}
                    value={filterValue}
                    onClear={() => onClear()}
                    onValueChange={onSearchChange}
                />
                <div className="flex flex-col sm:flex-row justify-between gap-4 items-end">

                    <div className="w-full sm:max-w-[44%]">

                        {isAdmin ?
                            <div className="my-2">
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
                                        getAllResidents(e.target.value)
                                        setIsSelectCondom(e.target.value && true)
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
                            :
                            <></>
                        }

                        {isSelectCondom ?
                            <div>
                                <label htmlFor="resident" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Resident</label>

                                {isLoadResidents ?
                                    <div className='flex justify-center items-center flex-col'>
                                        <Spinner color="primary" size="lg" />
                                    </div>
                                    :
                                    <Select
                                        isRequired
                                        id='resident'
                                        aria-label='resident'
                                        placeholder="Select an Resident"
                                        variant='faded'
                                        value={resident}
                                        className='focus:ring-primary-600 focus:border-primary-600'
                                        onChange={(e) => {
                                            setResident(e.target.value)
                                            setError(null)
                                        }}
                                    >
                                        {getResidents &&
                                            getResidents.map((value) => {
                                                return (
                                                    <SelectItem key={`${value.id} - ${value.first_name} ${value.last_name}`} textValue={`${value.first_name} ${value.last_name}`}>
                                                        {`${value.first_name} ${value.last_name}`}
                                                    </SelectItem>
                                                )
                                            })
                                        }
                                    </Select>
                                }
                            </div>
                            :
                            <></>
                        }
                    </div>


                    <div className='w-full sm:w-auto flex flex-col md:flex-row justify-center '>
                        <div className='flex flex-col'>
                            <label className='font-bold text-xs px-2'>Start date</label>
                            <DatePicker
                                selected={startDateCalendar}
                                onChange={(date) => {
                                    setStartDateCalendar(date && `${formatDate(date)}T00:00:00`)
                                    setEndDateCalendar()
                                }}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="DD/MM/YYYY"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>
                        <div className='mx-1 pb-2 flex justify-center items-end'>
                            <span className='text-sm font-bold md:block hidden'>~</span>
                        </div>
                        <div className='flex flex-col'>
                            <label className='font-bold text-xs px-2'>End date</label>
                            <DatePicker
                                selected={endDateCalendar}
                                onChange={(date) => {
                                    if (startDateCalendar) {
                                        setEndDateCalendar(date && `${formatDate(date)}T23:59:59`)
                                    }
                                }}
                                minDate={startDateCalendar}
                                maxDate={addDays(new Date(startDateCalendar), 60)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="DD/MM/YYYY"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>
                    </div>

                    <Button onClick={() => createCSV()}>Download Report</Button>
                </div>
                {/* <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {users.length} users</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div> */}
            </div>
        );
    }, [
        onClear,
        filterValue,
        onSearchChange,
        createCSV,
        startDateCalendar,
        endDateCalendar,
        condominium,
        getCondominiums,
        getResidents,
        resident,
        setError,
        getAllResidents,
        isSelectCondom,
        isLoadResidents,
        isAdmin
    ])

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-0 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {/* {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`} */}
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    className="m-0"
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        Previous
                    </Button>
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                        Next
                    </Button>
                </div>
            </div>
        );
    }, [page, pages, onNextPage, onPreviousPage])

    function addDays(date, days) {
        if (date) {
            date.setDate(date.getDate() + days);
            return date;
        }
    }

    return (
        <main className="mt-6">
            {
                isLoading ?
                    <div className='flex justify-center items-center flex-col'>
                        <Spinner color="primary" size="lg" />
                    </div>
                    :
                    <div>
                        {/* <div className="text-center text-xl">
                            <p className="font-bold">AUTHORIZED</p>
                        </div> */}

                        <Table
                            aria-label="Table Access Control"
                            isHeaderSticky
                            bottomContent={bottomContent}
                            bottomContentPlacement="outside"
                            classNames={{
                                wrapper: "max-h-[382px]",
                            }}
                            color="primary"
                            sortDescriptor={sortDescriptor}
                            onSortChange={setSortDescriptor}
                            topContentPlacement="outside"
                            topContent={topContent}
                            selectionMode="single"
                            onSelectionChange={(key) => {
                                const setIter = key.keys()
                                const getKey = setIter.next().value

                                let getType = getKey && getKey.split(' - ')[1]

                                if (getType === 'guest' || getType === 'delivery') {
                                    setIdGuest(getKey.split(' - ')[0])
                                    getInfoGuest(getKey)
                                } else {
                                    setShowUpdateLicense(false)
                                }
                            }}
                        >
                            <TableHeader columns={columns}>
                                {(column) => (
                                    <TableColumn
                                        key={column.uid}
                                        align={column.uid === "actions" ? "center" : "start"}
                                        allowsSorting={column.sortable}
                                    >
                                        {column.name}
                                    </TableColumn>
                                )}
                            </TableHeader>
                            <TableBody emptyContent={"No info found"} items={sortedItems}>
                                {(item) => (
                                    <TableRow key={`${item.id} - ${item.type}`}>
                                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
            }

            {showUpdateLicense ?
                <form className="w-full space-y-4 md:space-y-6"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') e.preventDefault()
                    }}
                    onSubmit={updateGuest} autoComplete="off" >
                    <Card className='border-solid p-4 my-8'>
                        <CardHeader className="flex gap-3">
                            <div className="flex flex-col">
                                <p className="text-md font-bold">Update Information</p>
                            </div>
                        </CardHeader>
                        <CardBody>
                            {isLoadLicense ?
                                <div className='flex justify-center items-center flex-col'>
                                    <Spinner color="primary" size="lg" />
                                </div>
                                :
                                <>
                                    <div className="mx-2 mb-4">
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-900 dark:text-white">CARDTAG</label>

                                        <Input
                                            type="text"
                                            placeholder='CARDTAG'
                                            value={reading}
                                            onValueChange={(e) => {
                                                setReading(e)
                                            }}
                                            onClear={() => console.log("input cleared")}
                                        />
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="gap-3 w-full flex justify-center ">
                                            <Button type="submit" color='primary' isLoading={isLoadingBtn}>
                                                Update License
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            }
                        </CardBody>
                    </Card>

                </form>
                :
                <></>
            }
        </main>
    )
}

export default TableAuthorized