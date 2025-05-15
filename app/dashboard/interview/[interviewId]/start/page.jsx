"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { use, useEffect, useState } from 'react'
import QuestionSection from './_components/QuestionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartInterview({params}) {
    const [interviewData,setInterviewData]=useState();
    const [mockInterviewQuestion,setMockInterviewQuestion]=useState();
    const [activeQuestionIndex,setActiveQuestionIndex]=useState(0);
    const { interviewId } = use(params)
    useEffect(()=>{
      GetInterviewDetails()
    },[])
     const GetInterviewDetails=async()=>{
          const result=await db.select().from(MockInterview)
          .where(eq(MockInterview.mockId,interviewId))

          const jsonMockResp=JSON.parse(result[0].jsonMockResp)
          console.log(jsonMockResp);
          setMockInterviewQuestion(jsonMockResp);
          setInterviewData(result[0]);

        }

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
           {/* Questions */}
            <QuestionSection 
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            />
            
           {/* Video/audio recording */}
           <RecordAnswerSection
           mockInterviewQuestion={mockInterviewQuestion}
           activeQuestionIndex={activeQuestionIndex}
           interviewData={interviewData}
           />
      </div>
      <div className='flex justify-end gap-4 mt-0'>
       {activeQuestionIndex>0&&<Button
        onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}
       >Previous Question</Button>}
       {activeQuestionIndex!=9&& <Button
       onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}
       >Next Question</Button>}

        {activeQuestionIndex==9&&
        <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}>
        <Button>End Interview</Button></Link>}
      </div>
    </div>
  )
}

export default StartInterview
