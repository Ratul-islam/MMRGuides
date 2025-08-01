import React, { Suspense } from 'react'
import GuidesPage from "./components/guidesPage"

const page = () => {
  return (
    <Suspense>
      <GuidesPage/>
    </Suspense>
  )
}

export default page