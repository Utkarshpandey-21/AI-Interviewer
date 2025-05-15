"use client"
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'


function Feedback({params}) {

   const[feedbackList,setFeedbackList]=useState([]);
   const router=useRouter();
  useEffect(()=>{
    GetFeedback();
  },[])

const GetFeedback=async()=>{
  const result=await db.select().from(UserAnswer).where(eq(UserAnswer.mockIdRef,params.interviewId)).orderBy(UserAnswer.id)
  
  console.log(result)
  setFeedbackList(result);
}

  return (
    <div className='p-10'>
      <h2 className='text-3xl font-bold text-green-500'>Congratulations!</h2>
      <h2 className='font-bold text-2xl'>Here is your Interview feedback</h2>
       
      {feedbackList?.length==0?
       <h2 className='text-gray-500 text-sm'>No Interview record is found!</h2>
    :
    <>

     
      <h2 className='text-sm text-gray-500'>Find below the feedback for improvment</h2>
   
     {feedbackList&&feedbackList.map((item,index)=>(
        <Collapsible key={index} className='mt-7'>
        <CollapsibleTrigger className='p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-7 w-full'>FeedBack<ChevronsUpDown/>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className='flex flex-col gap-2'>
            <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong>{item.rating}</h2>
            <h2 className='p-2 border rounded-lg text-sm  bg-red-50 text-red-900'><strong>Your answer: </strong>{item.userAns}</h2>
            {/* <h2 className='p-2 border rounded-lg text-sm  bg-green-50 text-green-900'><strong>Correct answer: </strong>{item.correctAns}</h2> */}
            <h2 className='p-2 border rounded-lg text-sm  bg-blue-50 text-blue-900'><strong>Feedback: </strong>{item.feedback}</h2>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
    ))}
    </>}
     <Button className='mt-7' onClick={()=>router.replace('/dashboard')}>Go Home</Button>
    </div>
  )
}

export default Feedback
