import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <div>
      F1 Page
      <div>
        <Link href="/f1/f2">F2</Link>
      </div>
    </div>
  )
}

export default page
