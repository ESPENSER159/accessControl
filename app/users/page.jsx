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
  Chip,
  Pagination,
  Tooltip,
  Modal, ModalContent,
  useDisclosure,
  Spinner
} from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrashCan, faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import ModalDeleteUser from "./modalDeleteUser"
import ModalEditUser from "./modalEditUser"
import axios from 'axios'

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "USER", uid: "user", sortable: true },
  { name: "CONDOMINIUM", uid: "condominium", sortable: true },
  { name: "TYPE", uid: "type", sortable: true },
  { name: "ACTIONS", uid: "actions" },
]

const CreateTable = () => {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isLoading, setIsLoading] = React.useState(false)
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "age",
    direction: "ascending",
  });
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [dataUser, setDataUser] = React.useState([])
  const [typeModal, setTypeModal] = React.useState()

  const [users, setUsers] = React.useState([])
  const [reload, setReload] = React.useState(false)

  const handleOpenModal = (type, info) => {
    setDataUser(info && { id: info[0], user: info[1], condominium: info[2], type: info[3] })
    setTypeModal(type)
    onOpen()
  }


  const getUsers = async () => {
    await axios.get('/api/users')
      .then(function (response) {
        console.log(response.data)
        setUsers(response.data.users)
      })
      .catch(function (error) {
        console.log(error)
      })

    setIsLoading(false)
    setReload(false)
  }

  React.useEffect(() => {
    setIsLoading(true)
    getUsers()
    typeModal === 'delete' && setPage(1)
  }, [reload])


  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.user.toLowerCase().includes(filterValue.toLowerCase())
        || user.condominium.toLowerCase().includes(filterValue.toLowerCase())
        || user.address.toLowerCase().includes(filterValue.toLowerCase())
      )
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter]);

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
      case "user":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
          </div>
        );
      case "condominium":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
          </div>
        );
      case "address":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
          </div>
        );
      case "type":
        return (
          <Chip className="capitalize" color={cellValue === 'admin' ? "warning" : "primary"} size="sm" variant="flat">
            {cellValue}
          </Chip>
        )
      case "actions":
        return (
          <div className="relative flex items-center gap-5">
            <Tooltip content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleOpenModal('edit', [user.id, user.user, user.condominium, user.type])}
              >
                <FontAwesomeIcon icon={faPen} size="sm" />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => handleOpenModal('delete', [user.id, user.user, user.condominium, user.type])}
              >
                <FontAwesomeIcon icon={faTrashCan} size="sm" />
              </span>
            </Tooltip>
          </div >
        );
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
            placeholder="Search by name..."
            startContent={<FontAwesomeIcon icon={faMagnifyingGlass} size="lg" width={20} />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="flex justify-between items-center">
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
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    onSearchChange,
    onRowsPerPageChange,
    users.length,
    hasSearchFilter,
  ]);

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
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <main className="mt-6">
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
          <div className='lg:mx-40 md:mx-20'>
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

      <Modal backdrop='blur' isOpen={isOpen} onClose={onClose} hideCloseButton={true} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            typeModal === 'delete' && <ModalDeleteUser dataUser={dataUser} onClose={onClose} setReload={setReload} />
            ||
            typeModal === 'edit' && <ModalEditUser edit={true} dataUser={dataUser} onClose={onClose} setReload={setReload} />
            ||
            typeModal === 'create' && <ModalEditUser edit={false} dataUser={dataUser} onClose={onClose} setReload={setReload} />
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}

export default CreateTable