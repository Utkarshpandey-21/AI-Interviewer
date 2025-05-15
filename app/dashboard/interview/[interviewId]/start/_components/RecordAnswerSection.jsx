"use client"

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text'
import { Mic } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModel'
import { db } from '@/utils/db'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { UserAnswer } from '@/utils/schema'

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData, onEndInterview }) {
  const [userAnswer, setUserAnswer] = useState('')
  const { user } = useUser()
  const [loading, setLoading] = useState(false)

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  })

  useEffect(() => {
    if (results.length > 0) {
      const combinedTranscript = results.map(r => r.transcript).join(' ')
      setUserAnswer(prev => prev + ' ' + combinedTranscript)
      setResults([])
    }
  }, [results])

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer()
    }
  }, [userAnswer])

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText()
    } else {
      setUserAnswer('')
      startSpeechToText()
    }
  }

  const UpdateUserAnswer = async () => {
    setLoading(true)
    try {
      const currentQuestionObj = mockInterviewQuestion[activeQuestionIndex]
      const questionText = currentQuestionObj?.Question || currentQuestionObj?.question || ''
      const correctAnswerText = currentQuestionObj?.Answer || currentQuestionObj?.answer || ''

      console.log("Saving to DB:", {
        questionText,
        correctAnswerText,
        userAnswer
      })

      const feedbackPrompt = `Question: ${questionText}, UserAnswer: ${userAnswer}, CorrectAnswer: ${correctAnswerText}. Please give a rating and feedback (3 to 5 lines) in JSON format with 'rating' and 'feedback' fields by comparing the UserAnser and CorrectAnswer.`

      const result = await chatSession.sendMessage(feedbackPrompt)
      const responseText = await result.response.text()
      const cleanedJson = responseText.replace(/```json|```/g, '').trim()
      const feedbackJson = JSON.parse(cleanedJson)

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: questionText,
        correctAns: correctAnswerText,
        userAns: userAnswer,
        feedback: feedbackJson?.feedback,
        rating: feedbackJson?.rating,
        userEmail: user.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-YYYY'),
      })

      if (resp) {
        toast.success('User answer recorded successfully')
        setUserAnswer('')
        setResults([])
      }
    } catch (err) {
      toast.error('Error saving answer or feedback')
      console.error('Save error:', err)
    } finally {
      setLoading(false)
    }
  }

  // const isLastQuestion = activeQuestionIndex === 9

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col justify-center items-center rounded-lg my-7">
        <Image src="/webcam.png" width={300} height={300} className="absolute bg-black" alt="Webcam placeholder" />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: '100%',
            zIndex: 10,
          }}
        />
      </div>

      <Button
        disabled={loading}
        variant="outline"
        className="my-1"
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className="text-red-600 flex gap-2">
            <Mic /> Stop Recording...
          </h2>
        ) : (
          'Record Answer'
        )}
      </Button>

      {/* {isLastQuestion && !isRecording && (
        <Button className="mt-4" onClick={onEndInterview}>
          End Interview
        </Button>
      )} */}
    </div>
  )
}

export default RecordAnswerSection
