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
    Avatar
} from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPeopleRoof, faPeopleGroup, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

const columns = [
    // { name: "ID", uid: "id", sortable: true },
    { name: "AUTHORIZED NAME", uid: "firstName", sortable: true },
    { name: "TYPE", uid: "type", sortable: true },
    { name: "RESIDENT NAME", uid: "resident_name", sortable: true },
    { name: "RESIDENT PHONE", uid: "phone", sortable: true },
    { name: "CONDOMINIUM", uid: "condominium_name", sortable: true },
    { name: "ADDRESS", uid: "address", sortable: true },
    { name: "ACCESS BY", uid: "access_by", sortable: true },
    { name: "DATE", uid: "date", sortable: true }
]

const TableAuthorized = ({ setError }) => {
    const [users, setUsers] = React.useState([])
    const [filterValue, setFilterValue] = React.useState("")
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const [isLoading, setIsLoading] = React.useState(false)
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "age",
        direction: "ascending",
    })


    const getInfoForTable = React.useCallback(async () => {
        await axios.post('/api/incomeRecord/authorized').then(function (response) {
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
    }, [setError])

    React.useEffect(() => {
        setIsLoading(true)
        getInfoForTable()
    }, [getInfoForTable])


    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.firstName.toLowerCase().includes(filterValue.toLowerCase())
                || user.resident_name.toLowerCase().includes(filterValue.toLowerCase())
                || user.condominium_name.toLowerCase().includes(filterValue.toLowerCase())
                || user.address.toLowerCase().includes(filterValue.toLowerCase())
                || user.access_by && user.access_by.toLowerCase().includes(filterValue.toLowerCase())
                || user.date.toLowerCase().includes(filterValue.toLowerCase())
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

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by..."
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
                            selectionMode="none"
                            sortDescriptor={sortDescriptor}
                            onSortChange={setSortDescriptor}
                            topContentPlacement="outside"
                            topContent={topContent}
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
        </main>
    )
}

export default TableAuthorized