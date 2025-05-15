"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import {  Lightbulb, WebcamIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { use } from 'react'
function Interview({params}) {
    const [interviewData,setInterviewData]=useState();
    const [webCamEnabled,setWebCamEnabled]=useState(false);
    const { interviewId } = use(params)
    useEffect(()=>{
        console.log(interviewId)
        GetInterviewDetails();
    },[])

    const GetInterviewDetails=async()=>{
      const result=await db.select().from(MockInterview)
      .where(eq(MockInterview.mockId,interviewId))
       setInterviewData(result[0]);
    }
  return (
    <div className='my-10 flex justify-center flex-col '>
     <h2 className='font-bold text-2xl'>Let's Get Started</h2>
     <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
     <div>
     {webCamEnabled?<Webcam
      onUserMedia={()=>setWebCamEnabled(true)}
      onUserMediaError={()=>setWebCamEnabled(false)}
      mirrored={true}
      style={{ 
        height:300,
        width:300
      }
      }
      />:
      <>
      <WebcamIcon className='h-52 w-full my-5 bg-secondary p-10 rounded-lg border'/>
      <Button onClick={()=>setWebCamEnabled(true)}>Enable Web Cam and Microphone</Button>
      </>
     }
     </div>
       <div className='flex flex-col my-5 gap-2 '>
        <div className='flex flex-col my-5 gap-2 p-5 rounded-lg border'>
      {/* <h2 className='text-lg'><strong>Job Role/Job Position:</strong>{interviewData.jobPosition}</h2>
      <h2 className='text-lg'><strong>Job Description:</strong>{interviewData.jobDesc}</h2>
      <h2 className='text-lg'><strong>Years of Experience:</strong>{interviewData.jobExperience}</h2> */}
      </div>
      <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
       <h2 className='flex items-center gap-2 text-yellow-500'><Lightbulb/><strong>Information</strong></h2> 
       <h2 className='mt-5 text-yellow-500'>Enable video Web cam and Microphone to start your AI Generated Mock Interview,it has 10 question which you can answer and at last you will get the report on the basis of your answer NOTE:We never record your video you can disable web cam whenever you want  </h2>
      </div>
       </div>
    </div>
    <div className='flex justify-end items-end'>
      <Link href={'/dashboard/interview/'+interviewId+'/start'}>
       <Button>Start Interview</Button>
      </Link>
    </div>
    </div>
  )
}

export default Interview
