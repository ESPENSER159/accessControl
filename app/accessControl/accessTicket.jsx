"use client"
import React, { useEffect, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Divider, Card, CardHeader, CardBody, CardFooter, Image } from "@nextui-org/react"


const ComponentToPrint = React.forwardRef(({ visitor, address, numTag, condominium, condominiumText, getDate, by }, ref) => {
    return (
        <div ref={ref} className="text-center w-full">
            <Card>
                <CardHeader className="flex text-center justify-between">
                    <Image
                        className="w-40 h-auto mr-2"
                        src="/bluelogo.png"
                        alt="Login icon"
                        width={240}
                        height={240}
                    />
                    <p className='text-4xl font-bold max-w-2xl'>{condominium}</p>
                    <p className='text-2xl font-bold'>Visitor <br /> Pass</p>
                </CardHeader>
                <Divider />
                <CardBody className='mx-10 pr-20'>
                    <p className='text-xl font-bold my-3'>Visitor Name: <span className='font-normal'> {visitor} </span> </p>

                    <p className='text-xl font-bold my-3'>Address: <span className='font-normal'> {address} </span> </p>

                    <p className='text-xl font-bold my-3'>Tag Number: <span className='font-normal'> {numTag} </span> </p>

                    <p className='text-xl font-bold my-3'>Time: <span className='font-normal'> {getDate} </span> </p>
                </CardBody>
                <Divider />
                <CardFooter className='flex flex-col items-start text-left'>
                    <p className='mb-2'>Access allowed by: {by} </p>
                    <p>{condominiumText}</p>
                </CardFooter>
            </Card>
        </div >
    )
})

ComponentToPrint.displayName = "ComponentToPrint"

const AccessTicket = ({ printTicket, setPrintTicket, visitor, address, numTag, condominium, condominiumText, getDate, by }) => {
    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    useEffect(() => {
        if (printTicket) {
            handlePrint()
            setPrintTicket(false)
        }
    }, [printTicket, handlePrint, setPrintTicket])

    return (
        <div className='hidden'>
            <ComponentToPrint ref={componentRef} visitor={visitor} address={address} numTag={numTag} condominium={condominium} condominiumText={condominiumText} getDate={getDate} by={by} />
        </div>
    )
}

export default AccessTicket