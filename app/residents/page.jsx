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
  Tooltip,
  Modal, ModalContent,
  useDisclosure,
  Spinner
} from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrashCan, faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import ModalDelete from "./modalDelete"
import ModalEdit from "./modalEdit"
import axios from 'axios'

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "RESIDENT NAME", uid: "first_name", sortable: true },
  { name: "CONDOMINIUM", uid: "condominium_name", sortable: true },
  { name: "ADDRESS", uid: "address", sortable: true },
  { name: "PHONE", uid: "phone1", sortable: true },
  { name: "PHONE 2", uid: "phone2", sortable: true },
  { name: "PHONE 3", uid: "phone3", sortable: true },
  { name: "PHONE 4", uid: "phone4", sortable: true },
  { name: "PHONE 5", uid: "phone5", sortable: true },
  { name: "ACTIONS", uid: "actions" },
]

const Residents = () => {
  const [filterValue, setFilterValue] = React.useState("")
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]))
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [isLoading, setIsLoading] = React.useState(false)
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "age",
    direction: "ascending",
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [sizeModal, setSizeModal] = React.useState('5xl')
  const [styleModal, setStyleModal] = React.useState('h-5/6 overflow-y-auto')
  const [data, setData] = React.useState([])
  const [typeModal, setTypeModal] = React.useState()

  const [users, setUsers] = React.useState([])
  const [reload, setReload] = React.useState(false)

  const handleOpenModal = React.useCallback((type, info) => {
    setData(info && { id: info[0], firstName: info[1], lastName: info[2], condominium: info[3], address: info[4], phone1: info[5], phone2: info[6], phone3: info[7], phone4: info[8], phone5: info[9], family: info[10], authorized: info[11] })
    setTypeModal(type)

    type === 'delete' ? setSizeModal('md') : setSizeModal('5xl')
    type === 'delete' ? setStyleModal('') : setStyleModal('h-5/6 overflow-y-auto')

    onOpen()
  }, [onOpen])


  const getInfoForTable = async () => {
    await axios.get('/api/residents')
      .then(function (response) {
        // console.log(response)
        setUsers(response.data.info)
      })
      .catch(function (error) {
        console.log(error)
      })

    setIsLoading(false)
    setReload(false)
  }



  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.first_name && user.first_name.toLowerCase().includes(filterValue.toLowerCase())
        || user.last_name && user.last_name.toLowerCase().includes(filterValue.toLowerCase())
        || user.condominium_name && user.condominium_name.toLowerCase().includes(filterValue.toLowerCase())
        || user.address && user.address.toLowerCase().includes(filterValue.toLowerCase())
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
        );
      case "first_name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue} {user.last_name}</p>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-5">
            <Tooltip content="Edit">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleOpenModal('edit', [user.id, user.first_name, user.last_name, user.condominium, user.address, user.phone1, user.phone2, user.phone3, user.phone4, user.phone5, user.family, user.authorized])}
              >
                <FontAwesomeIcon icon={faPen} size="sm" />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete">
              <span className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => handleOpenModal('delete', [user.id, user.first_name, user.last_name, user.condominium, user.address])}
              >
                <FontAwesomeIcon icon={faTrashCan} size="sm" />
              </span>
            </Tooltip>
          </div >
        );
      default:
        return cellValue;
    }
  }, [handleOpenModal]);

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
            placeholder="Search..."
            startContent={<FontAwesomeIcon icon={faMagnifyingGlass} size="lg" width={20} />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {users.length}</span>
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
        </div>
      </div>
    );
  }, [
    onClear,
    filterValue,
    onSearchChange,
    onRowsPerPageChange,
    users.length
  ]);

  React.useEffect(() => {
    setIsLoading(true)
    getInfoForTable()
    // onClose()
    typeModal === 'delete' && setPage(1)

    // Filter condominium
    const queryParameters = new URLSearchParams(window.location.search)
    const condom = queryParameters.get("condominium")
    onSearchChange(condom ? condom : '')

  }, [reload, typeModal, onSearchChange])

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
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
  }, [page, pages, onNextPage, onPreviousPage]);

  return (
    <main className="mt-6">

      <div className="text-center my-6">
        <h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">Residents</h1>
      </div>

      <div className="gap-3 w-full flex justify-center mb-6">
        <Button color='primary' endContent={<FontAwesomeIcon icon={faPlus} size="lg"
        />}
          onClick={() => handleOpenModal('create')}
        >
          Add New
        </Button>
      </div>

      {
        isLoading ?
          <div className='flex justify-center items-center flex-col'>
            <Spinner color="primary" size="lg" />
          </div>
          :
          <div className='lg:mx-20 md:mx-20'>
            <Table
              aria-label="Example table with custom cells, pagination and sorting"
              isHeaderSticky
              bottomContent={bottomContent}
              bottomContentPlacement="outside"
              classNames={{
                wrapper: "max-h-[382px]",
              }}
              selectedKeys={selectedKeys}
              selectionMode="none"
              sortDescriptor={sortDescriptor}
              topContent={topContent}
              topContentPlacement="outside"
              onSelectionChange={setSelectedKeys}
              onSortChange={setSortDescriptor}
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
              <TableBody emptyContent={"No users found"} items={sortedItems}>
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
      }

      <Modal backdrop='blur' size={sizeModal} className={styleModal} isOpen={isOpen} onClose={onClose} hideCloseButton={typeModal === 'delete' ? true : false} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            typeModal === 'delete' && <ModalDelete data={data} onClose={onClose} setReload={setReload} />
            ||
            typeModal === 'edit' && <ModalEdit edit={true} data={data} onClose={onClose} setReload={setReload} />
            ||
            typeModal === 'create' && <ModalEdit edit={false} data={data} onClose={onClose} setReload={setReload} />
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}

export default Residents