import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function InterviewItemCart({interview}) {
  return (
    <div className='border rounded-lg  shadow-sm p-3'>
      <h2 className='font-bold text-blue-900'>{interview?.jobPosition}</h2>
      <h2 className='text-sm text-gray-600'>{interview?.jobExperience} years of experience</h2>
      <h2 className='text-xs text-gray-400'>Created At:{interview?.createdAt}</h2>
      <div className='flex justify-between mt-2 gap-5'>
        <Link href={"/dashboard/interview/"+interview?.mockId+"/feedback"}>
        <Button size='sm' variant='outline' className='cursor-pointer'       
        >Feedback</Button></Link>
         <Link href={"/dashboard/interview/"+interview?.mockId+"/start"}>
        <Button size='sm' className='cursor-pointer'>Start</Button>
         </Link>
      </div>
    </div>
  )
}

export default InterviewItemCart
