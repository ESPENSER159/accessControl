"use client"
import { useState } from 'react'
import Table from '../components/createTable'

export default function CreateUsers() {
    const [isLoading, setIsLoading] = useState(false)

    return (
        <main className="d-flex justify-center">
            Create users

            {
                isLoading ?
                    <div className='flex justify-center items-center flex-col'>
                        {/* <Spinner animation="grow" variant="primary" /> */}
                        {/* <span className='text-dividerColor'>Loading...</span> */}
                    </div>
                    :
                    <div>
                        <Table
                            // title={'Users'}
                            // columns={columns}
                            // getInfo={info}
                            // filteredItems={filteredItems}
                            // expanded={ExpandedComponent}
                        />
                    </div>
            }
        </main>
    )
}