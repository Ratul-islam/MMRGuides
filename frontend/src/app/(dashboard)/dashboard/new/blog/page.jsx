import React, { Suspense } from 'react'
import BlogEditor from '../../../../(dashboard)/dashboard/components/dashboard/BlogEditor'

const page = () => {
  return (
    <Suspense>

    <BlogEditor/>
    </Suspense>
  )
}

export default page