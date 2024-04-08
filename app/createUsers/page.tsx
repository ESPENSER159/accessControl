"use client"
import { useState } from 'react'
import Table from '../components/createTable'
import { Spinner } from "@nextui-org/react"

export default function CreateUsers() {
    const [isLoading, setIsLoading] = useState(false)

    return (
        <main className="d-flex justify-center">

            <p className='text-center my-6 text-2xl font-bold'>Create users</p>

            {
                isLoading ?
                    <div className='flex justify-center items-center flex-col'>
                        <Spinner color="success" size="lg" />
                    </div> 
                    :
                    <div className='lg:mx-40 md:mx-20'>
                        <Table />
                    </div>
            }
        </main>
    )
}