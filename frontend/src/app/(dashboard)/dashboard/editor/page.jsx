import { Suspense } from 'react'
import React from 'react'
import BlogEditor from '../../../(dashboard)/dashboard/components/dashboard/BlogEditor'

const page = () => {
  return (
    <Suspense>
      
    <BlogEditor/>
    </Suspense>
  )
}

export default page