"use client"
import { useState } from "react"
import { Chip } from "@nextui-org/react"
import TableAuthorized from './tableAuthorized'

const AccessControl = () => {

  const [error, setError] = useState(null)

  return (
    <main className="my-6 lg:mx-20 md:mx-20">

      <div className="text-center my-6">
        <h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">Income Record</h1>
      </div>

      <TableAuthorized setError={setError} />

      {error &&
        <Chip className='min-w-full h-auto mt-4 py-2 rounded-md text-wrap' color="danger" variant="bordered">
          {error}
        </Chip>
      }

    </main>
  )
}

export default AccessControl