"use client"
import React, { useState } from "react"
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
    useDisclosure,
    Spinner,
    Chip,
    Avatar
} from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUnlock, faPeopleRoof, faPeopleGroup, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

const columns = [
    // { name: "ID", uid: "id", sortable: true },
    { name: "AUTHORIZED NAME", uid: "firstName", sortable: true },
    { name: "TYPE", uid: "type", sortable: true },
    // { name: "ADDRESS", uid: "address", sortable: true },
    // { name: "PHONE", uid: "phone", sortable: true },
    // { name: "PHONE 2", uid: "phone2", sortable: true },
    // { name: "PHONE 3", uid: "phone3", sortable: true },
    // { name: "PHONE 4", uid: "phone4", sortable: true },
    // { name: "PHONE 5", uid: "phone5", sortable: true }
]

const TableAuthorized = ({ id, setReload, setError, ticket, infoToPrint }) => {
    const [filterValue, setFilterValue] = React.useState("")
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]))
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const [isLoading, setIsLoading] = React.useState(false)
    const [isLoadingBtn, setIsLoadingBtn] = useState(false)
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "age",
        direction: "ascending",
    })
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [users, setUsers] = React.useState([])

    const [showAuthorizedBtn, setShowAuthorizedBtn] = React.useState(false)
    const [idAuthorized, setIdAuthorized] = React.useState()

    const handleOpenModal = React.useCallback((type, info) => {
        setData(info && { id: info[0], firstName: info[1], lastName: info[2], condominium: info[3], address: info[4], phone1: info[5], phone2: info[6], phone3: info[7], phone4: info[8], phone5: info[9], family: info[10], authorized: info[11] })
        setTypeModal(type)

        type === 'delete' ? setSizeModal('md') : setSizeModal('5xl')
        type === 'delete' ? setStyleModal('') : setStyleModal('h-5/6 overflow-y-auto')

        onOpen()
    }, [onOpen])


    const getInfoForTable = React.useCallback(async () => {
        await axios.post('/api/accessControl', {
            id: id,
        }).then(function (response) {
            const res = response.data

            if (res.status === 200) {
                setUsers(res.info)

            } else {
                console.log(res.message)
                setError(res.message)
            }
        }).catch(function (error) {
            console.log(error)
            setError(error)
        })

        setIsLoading(false)
    }, [id, setError])

    React.useEffect(() => {
        setShowAuthorizedBtn(false)
        setIsLoading(true)
        getInfoForTable()
    }, [id, getInfoForTable])


    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.firstName.toLowerCase().includes(filterValue.toLowerCase())
                || user.type.toLowerCase().includes(filterValue.toLowerCase())
            )
        }

        return filteredUsers;
    }, [users, filterValue, hasSearchFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

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
                        <Avatar
                            icon={<FontAwesomeIcon icon={user.type === 'family' ? faPeopleRoof : faPeopleGroup} className="text-primary" size="lg" />}
                            className="min-w-10"
                        />
                        <p className="ml-2 text-bold text-small capitalize">{cellValue} {user.lastName}</p>
                    </div >
                )
            case "type":
                return (
                    <Chip className="capitalize" color={cellValue === 'family' ? "primary" : "warning"} size="sm" variant="flat">
                        {cellValue}
                    </Chip>
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

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by authorized..."
                        startContent={<FontAwesomeIcon icon={faMagnifyingGlass} size="lg" width={20} />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
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
        onSearchChange
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


    const authorizedAccess = async () => {
        setIsLoadingBtn(true)

        let access = users.filter(au => au.id === parseInt(idAuthorized))

        await axios.post('/api/accessControl/authorizedAccess', {
            info: access[0],
            accessBy: localStorage.getItem('user')
        }).then(function (response) {
            const res = response.data

            if (res.status === 200) {
                console.log(`log created`)
                setReload(true)
                ticket && infoToPrint(access[0].firstName, access[0].address, '')
            } else {
                console.log(res.message)
                setError(res.message)
            }
        }).catch(function (error) {
            console.log(error)
            setError(error)
        })

        setShowAuthorizedBtn(false)
        setIsLoadingBtn(false)
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
                        <div className="text-center text-xl">
                            <p className="font-bold">AUTHORIZED</p>
                        </div>

                        <Table
                            aria-label="Table Access Control"
                            isHeaderSticky
                            bottomContent={bottomContent}
                            bottomContentPlacement="outside"
                            classNames={{
                                wrapper: "max-h-[382px]",
                            }}
                            color="primary"
                            selectionMode="single"
                            onSelectionChange={(key) => {
                                const setIter = key.keys()
                                const getKey = setIter.next().value

                                if (getKey) {
                                    setShowAuthorizedBtn(true)
                                    setIdAuthorized(getKey)

                                } else {
                                    setShowAuthorizedBtn(false)
                                }
                            }}
                            sortDescriptor={sortDescriptor}
                            onSortChange={setSortDescriptor}
                            topContentPlacement="outside"
                            topContent={topContent}
                        // onSelectionChange={setSelectedKeys}
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
                                    <TableRow key={item.id}>
                                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
            }

            {showAuthorizedBtn &&
                <div className="gap-3 w-full flex justify-center my-6">
                    <Button color='primary' isLoading={isLoadingBtn} endContent={<FontAwesomeIcon icon={faUnlock} size="lg"
                    />}
                        onPress={authorizedAccess}
                    >
                        Authorized Access
                    </Button>
                </div>
            }
        </main>
    )
}

export default TableAuthorized