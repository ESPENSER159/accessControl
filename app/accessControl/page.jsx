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
  useDisclosure,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  Textarea,
  Switch,
  Chip
} from "@nextui-org/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrashCan, faUnlock, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import TableAuthorized from './tableAuthorized'
import AccessTicket from './accessTicket'
import { getCurrentDate } from '../libs/getCurrentDate'

const columns = [
  // { name: "ID", uid: "id", sortable: true },
  { name: "RESIDENT NAME", uid: "first_name", sortable: true },
  { name: "CONDOMINIUM", uid: "condominium_name", sortable: true },
  { name: "ADDRESS", uid: "address", sortable: true },
  { name: "PHONE", uid: "phone1", sortable: true },
  { name: "PHONE 2", uid: "phone2", sortable: true },
  { name: "PHONE 3", uid: "phone3", sortable: true },
  { name: "PHONE 4", uid: "phone4", sortable: true },
  { name: "PHONE 5", uid: "phone5", sortable: true }
]

const AccessControl = () => {
  const [filterValue, setFilterValue] = useState("")
  const [selectedKeys, setSelectedKeys] = useState(new Set([]))
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingBtn, setIsLoadingBtn] = useState(false)
  const [error, setError] = useState(null)
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "age",
    direction: "ascending",
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [sizeModal, setSizeModal] = useState('5xl')
  const [styleModal, setStyleModal] = useState('h-5/6 overflow-y-auto')
  const [data, setData] = useState([])
  const [typeModal, setTypeModal] = useState()
  const [users, setUsers] = useState([])
  const [reload, setReload] = useState(false)
  const [authorized, setAuthorized] = useState([])
  const [idAuthorized, setIdAuthorized] = useState()
  const [showAuthorized, setShowAuthorized] = useState(false)
  const [ticket, setTicket] = useState(true)
  const [printTicket, setPrintTicket] = useState(false)
  const [accessToPrintTicket, setAccessToPrintTicket] = useState(false)
  const [guestInfo, setGuestInfo] = useState(
    {
      delivery: false
    }
  )

  const [getDate, setDate] = useState('')
  const [guest, setGuest] = useState('')
  const [address, setAddress] = useState('')
  const [numTag, setNumTag] = useState('')
  const [condominium, setCondominium] = useState('')
  const [condominiumText, setCondominiumText] = useState('')
  const [accessBy, setAccessBy] = useState('')
  const [reading, setReading] = useState('')

  const handleOpenModal = React.useCallback((type, info) => {
    setData(info && { id: info[0], firstName: info[1], lastName: info[2], condominium: info[3], address: info[4], phone1: info[5], phone2: info[6], phone3: info[7], phone4: info[8], phone5: info[9], family: info[10], authorized: info[11] })
    setTypeModal(type)

    type === 'delete' ? setSizeModal('md') : setSizeModal('5xl')
    type === 'delete' ? setStyleModal('') : setStyleModal('h-5/6 overflow-y-auto')

    onOpen()
  }, [onOpen])


  const getInfoForTable = async () => {
    await axios.post('/api/accessControl/residents', {
      idCondominium: localStorage.getItem('idLocation')
    }).then(function (response) {
      // console.log(response.data.info)
      setUsers(response.data.info)

      if (response.data.info.length) {
        setCondominiumText(response.data.info[0].text_ticket)
        setCondominium(response.data.info[0].condominium_name)

        let permitPrint = response.data.info[0].print_ticket === 'YES' ? true : false
        setAccessToPrintTicket(permitPrint)
        setTicket(permitPrint)
      }

    }).catch(function (error) {
      console.log(error)
      setError(error)
    })

    setIsLoading(false)
  }

  React.useEffect(() => {
    setIsLoading(true)
    setShowAuthorized(false)
    getInfoForTable()
    // onClose()
    typeModal === 'delete' && setPage(1)
    setReload(false)

    setAccessBy(localStorage.getItem('user'))
  }, [reload, typeModal])


  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.first_name.toLowerCase().includes(filterValue.toLowerCase())
        || user.last_name.toLowerCase().includes(filterValue.toLowerCase())
        || user.address.toLowerCase().includes(filterValue.toLowerCase())
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
            <Tooltip content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleOpenModal('edit', [user.id, user.first_name, user.last_name, user.condominium, user.address, user.phone1, user.phone2, user.phone3, user.phone4, user.phone5, user.family, user.authorized])}
              >
                <FontAwesomeIcon icon={faPen} size="sm" />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
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
            placeholder="Search by resident or address..."
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


  const authorizedAccess = async (e) => {
    e.preventDefault()

    setIsLoadingBtn(true)

    let access = users.filter(au => au.id === parseInt(idAuthorized))

    await axios.post('/api/accessControl/guestAccess', {
      infoResident: access[0],
      infoGuest: guestInfo,
      accessBy: localStorage.getItem('user')
    }).then(function (response) {
      const res = response.data

      if (res.status === 200) {
        console.log(`log created`)
        setReload(true)
        ticket && infoToPrint(guestInfo.guestName, access[0].address, guestInfo.cardNum)
      } else {
        console.log(res.message)
        setError(res.message)
      }
    }).catch(function (error) {
      console.log(error)
      setError(error)
    })

    setTicket(false)
    setReading('')
    setGuestInfo({ delivery: false, guestName: '', licenseNum: '' })
    setIsLoadingBtn(false)
  }

  const infoToPrint = (name, address, cardNum) => {

    setDate(getCurrentDate())
    setGuest(name)
    setAddress(address)
    setNumTag(cardNum)

    setPrintTicket(true)
  }

  return (
    <main className="my-6 lg:mx-20 md:mx-20">

      <div className="text-center my-6">
        <h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">Access Control</h1>
      </div>

      {
        isLoading ?
          <div className='flex justify-center items-center flex-col'>
            <Spinner color="primary" size="lg" />
          </div>
          :
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
            // selectionBehavior="replace"
            // selectedKeys={selectedKeys}
            // onRowAction={(key) => {
            //   console.log(key)
            // }}
            onSelectionChange={(key) => {

              const setIter = key.keys()
              const getKey = setIter.next().value

              if (getKey) {
                setShowAuthorized(true)
                setIdAuthorized(getKey)

              } else {
                setShowAuthorized(false)
              }

            }}
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
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
      }

      {showAuthorized &&
        <>

          {accessToPrintTicket &&
            <div className="my-16 flex justify-center">
              <Switch color='primary'
                isSelected={ticket}
                onValueChange={setTicket}
              >
                Print parking permit
              </Switch>
            </div>
          }

          <TableAuthorized id={idAuthorized} setReload={setReload} setError={setError} ticket={ticket} infoToPrint={infoToPrint} />

          {error &&
            <Chip className='min-w-full h-auto mt-4 py-2 rounded-md text-wrap' color="danger" variant="bordered">
              {error}
            </Chip>
          }

          <form className="w-full space-y-4 md:space-y-6"
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault()
            }}
            onSubmit={authorizedAccess} autoComplete="off" >
            <Card className='border-solid p-4 my-8'>
              <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                  <p className="text-md font-bold">Guest Information</p>
                </div>
              </CardHeader>
              <CardBody>
                <div className="mx-2 mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-900 dark:text-white">SCAN DRIVER LICENSE</label>

                  <Input
                    type="text" 
                    placeholder='SCAN DRIVER LICENSE'
                    value={reading}
                    onValueChange={(e) => {

                      setReading(e)

                      if (e.includes('DLDAQ')) {
                        let numLicen = e.split('DLDAQ')[1].split('DCS')[0]
                        let firstName = e.split('DDE')[1].split('DDF')[0].slice(4)
                        let lastName = e.split('DCS')[1].split('DDE')[0]

                        setGuestInfo({ ...guestInfo, licenseNum: numLicen, guestName: `${firstName} ${lastName}` })
                      }
                    }}
                    onClear={() => console.log("input cleared")}
                  />
                </div>
                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 md:gap-4">
                  <div className="mx-2 mb-4">
                    <label htmlFor="guestName" className="block text-sm font-medium text-gray-900 dark:text-white">Guest Name</label>

                    <Input
                      type="text"
                      autoComplete="off"
                      id='guestName'
                      placeholder='Guest Name'
                      value={guestInfo.guestName}
                      onValueChange={(e) => setGuestInfo({ ...guestInfo, guestName: e })}
                      onClear={() => console.log("input cleared")}
                      isRequired
                    />
                  </div>
                  <div className="mx-2 mb-4">
                    <label htmlFor="licenseNum" className="block text-sm font-medium text-gray-900 dark:text-white">Guest Drv.Lic.Nro</label>

                    <Input
                      id='licenseNum'
                      type="text"
                      autoComplete="off"
                      placeholder='Guest Drv.Lic.Nro'
                      value={guestInfo.licenseNum}
                      onValueChange={(e) => {
                        setGuestInfo({ ...guestInfo, licenseNum: e })

                        // if (e.includes('DLDAQ')) {
                        //   let numLicen = e.split('DLDAQ')[1].split('DCS')[0]
                        //   let firstName = e.split('DDE')[1].split('DDF')[0].slice(4)
                        //   let lastName = e.split('DCS')[1].split('DDE')[0]

                        //   setGuestInfo({ ...guestInfo, licenseNum: numLicen, guestName: `${firstName} ${lastName}` })

                        // }
                      }}
                      onClear={() => console.log("input cleared")}
                      isRequired
                    />
                  </div>
                  <div className="mx-2 mb-4">
                    <label htmlFor="cardNum" className="block text-sm font-medium text-gray-900 dark:text-white">Card Tag</label>

                    <Input
                      id='cardNum'
                      type="text"
                      autoComplete="off"
                      placeholder='Card Tag'
                      value={guestInfo.cardNum}
                      onValueChange={(e) => setGuestInfo({ ...guestInfo, cardNum: e })}
                      onClear={() => console.log("input cleared")}
                    />
                  </div>
                  {/* <div className="my-6 flex justify-center">
                    <Switch color='primary'
                      isSelected={guestInfo.delivery}
                      onValueChange={(e) => {
                        setGuestInfo({ ...guestInfo, delivery: e })

                        e && setTicket(false)
                      }}
                    >
                      Delivery
                    </Switch>
                  </div> */}
                  <div className="mx-2 mb-4 col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-900 dark:text-white">Memo</label>
                    <Textarea
                      labelPlacement="outside"
                      placeholder="Enter memo"
                      className="max-w-md"
                      value={guestInfo.memo}
                      onValueChange={(e) => setGuestInfo({ ...guestInfo, memo: e })}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="flex justify-center">
              <div className="gap-3 w-full flex justify-center my-6">
                <Button type="submit" color='primary' isLoading={isLoadingBtn} endContent={<FontAwesomeIcon icon={faUnlock} size="lg"
                />}
                >
                  Guest Register Access
                </Button>
              </div>
            </div>
          </form>
        </>
      }

      <AccessTicket printTicket={printTicket} setPrintTicket={setPrintTicket} visitor={guest} address={address} numTag={numTag} condominium={condominium} condominiumText={condominiumText} by={accessBy} getDate={getDate} />

    </main>
  )
}

export default AccessControl