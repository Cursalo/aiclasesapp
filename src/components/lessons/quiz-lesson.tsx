'use client'

import React, { useState, useEffect } from 'react'
import { BaseLesson } from './base-lesson'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import type { LessonComponentProps, QuizLessonContent, QuizQuestion } from '@/lib/lessons/types'

interface QuizLessonProps extends LessonComponentProps {
  onProgress?: (progress: number, data?: any) => void
  onComplete?: (data?: any) => void
}

interface QuizAnswer {
  questionId: string
  answer: string | string[]
}

interface QuizResult {
  questionId: string
  correct: boolean
  userAnswer: string | string[]
  correctAnswer: string | string[]
  explanation?: string
  points: number
}

export function QuizLesson({ lesson, progress, onProgress, onComplete, readonly, preview }: QuizLessonProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<QuizResult[]>([])
  const [score, setScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [quizStarted, setQuizStarted] = useState(false)

  const content = lesson.content as QuizLessonContent
  const questions = content.shuffleQuestions 
    ? [...content.questions].sort(() => Math.random() - 0.5)
    : content.questions

  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0)
  const passingScore = content.passingScore || 70

  // Timer logic
  useEffect(() => {
    if (content.timeLimit && quizStarted && !submitted && timeRemaining !== null) {
      if (timeRemaining <= 0) {
        handleSubmit()
        return
      }

      const timer = setTimeout(() => {
        setTimeRemaining(prev => (prev || 0) - 1)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [timeRemaining, quizStarted, submitted, content.timeLimit])

  const startQuiz = () => {
    setQuizStarted(true)
    if (content.timeLimit) {
      setTimeRemaining(content.timeLimit * 60) // Convert minutes to seconds
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId)
      if (existing) {
        return prev.map(a => 
          a.questionId === questionId ? { ...a, answer } : a
        )
      }
      return [...prev, { questionId, answer }]
    })
  }

  const isAnswered = (questionId: string) => {
    return answers.some(a => a.questionId === questionId)
  }

  const getAnswer = (questionId: string) => {
    return answers.find(a => a.questionId === questionId)?.answer
  }

  const handleSubmit = () => {
    const quizResults: QuizResult[] = questions.map(question => {
      const userAnswer = getAnswer(question.id) || ''
      const correctAnswer = question.correctAnswer
      
      let correct = false
      if (Array.isArray(correctAnswer)) {
        // Multiple correct answers
        const userAnswerArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer]
        correct = correctAnswer.length === userAnswerArray.length &&
                 correctAnswer.every(ans => userAnswerArray.includes(ans))
      } else {
        // Single correct answer
        correct = userAnswer === correctAnswer
      }

      return {
        questionId: question.id,
        correct,
        userAnswer,
        correctAnswer,
        explanation: question.explanation,
        points: correct ? (question.points || 1) : 0,
      }
    })

    const totalScore = quizResults.reduce((sum, result) => sum + result.points, 0)
    const scorePercentage = (totalScore / totalPoints) * 100

    setResults(quizResults)
    setScore(scorePercentage)
    setSubmitted(true)

    // Update lesson progress
    if (onProgress) {
      onProgress(100, {
        score: scorePercentage,
        passed: scorePercentage >= passingScore,
        results: quizResults,
        attempts: 1, // Track attempts if allowing retakes
      })
    }

    // Complete lesson if passed
    if (scorePercentage >= passingScore && onComplete && !readonly && !preview) {
      onComplete({
        score: scorePercentage,
        passed: true,
        results: quizResults,
      })
    }
  }

  const retakeQuiz = () => {
    setAnswers([])
    setSubmitted(false)
    setResults([])
    setScore(0)
    setCurrentQuestion(0)
    setQuizStarted(false)
    if (content.timeLimit) {
      setTimeRemaining(content.timeLimit * 60)
    }
  }

  const renderQuestion = (question: QuizQuestion, index: number) => {
    const userAnswer = getAnswer(question.id)
    const result = results.find(r => r.questionId === question.id)

    return (
      <Card key={question.id} className={cn(
        "transition-all",
        submitted && result?.correct && "border-green-200 dark:border-green-800",
        submitted && !result?.correct && "border-red-200 dark:border-red-800"
      )}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">
              Question {index + 1}
              {question.points && question.points > 1 && (
                <Badge variant="outline" className="ml-2">
                  {question.points} points
                </Badge>
              )}
            </CardTitle>
            {submitted && (
              <Badge 
                variant={result?.correct ? "default" : "destructive"}
                className={result?.correct ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}
              >
                {result?.correct ? '✓ Correct' : '✗ Incorrect'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">{question.question}</p>

          {/* Multiple Choice */}
          {question.type === 'multiple-choice' && question.options && (
            <RadioGroup
              value={userAnswer as string || ''}
              onValueChange={(value) => handleAnswer(question.id, value)}
              disabled={submitted || readonly}
            >
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                  <Label 
                    htmlFor={`${question.id}-${optionIndex}`}
                    className={cn(
                      "cursor-pointer",
                      submitted && option === question.correctAnswer && "text-green-600 font-medium",
                      submitted && option === userAnswer && option !== question.correctAnswer && "text-red-600"
                    )}
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {/* True/False */}
          {question.type === 'true-false' && (
            <RadioGroup
              value={userAnswer as string || ''}
              onValueChange={(value) => handleAnswer(question.id, value)}
              disabled={submitted || readonly}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id={`${question.id}-true`} />
                <Label htmlFor={`${question.id}-true`}>True</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id={`${question.id}-false`} />
                <Label htmlFor={`${question.id}-false`}>False</Label>
              </div>
            </RadioGroup>
          )}

          {/* Fill in the Blank */}
          {question.type === 'fill-blank' && (
            <Input
              value={userAnswer as string || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              placeholder="Type your answer here..."
              disabled={submitted || readonly}
            />
          )}

          {/* Code Question */}
          {question.type === 'code' && (
            <Textarea
              value={userAnswer as string || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              placeholder="Write your code here..."
              className="font-mono text-sm min-h-[100px]"
              disabled={submitted || readonly}
            />
          )}

          {/* Show explanation after submission */}
          {submitted && question.explanation && (
            <Alert className={result?.correct ? "border-green-200 dark:border-green-800" : "border-red-200 dark:border-red-800"}>
              <Icons.help className="h-4 w-4" />
              <AlertDescription>
                <strong>Explanation:</strong> {question.explanation}
              </AlertDescription>
            </Alert>
          )}

          {/* Show correct answer if incorrect and option is enabled */}
          {submitted && !result?.correct && content.showCorrectAnswers && (
            <Alert>
              <Icons.check className="h-4 w-4" />
              <AlertDescription>
                <strong>Correct Answer:</strong> {Array.isArray(question.correctAnswer) 
                  ? question.correctAnswer.join(', ') 
                  : question.correctAnswer}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    )
  }

  if (!quizStarted) {
    return (
      <BaseLesson
        lesson={lesson}
        progress={progress}
        onProgress={onProgress}
        onComplete={onComplete}
        readonly={readonly}
        preview={preview}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quiz Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p><strong>Questions:</strong> {questions.length}</p>
              <p><strong>Passing Score:</strong> {passingScore}%</p>
              {content.timeLimit && (
                <p><strong>Time Limit:</strong> {content.timeLimit} minutes</p>
              )}
              <p><strong>Retakes:</strong> {content.allowRetake ? 'Allowed' : 'Not allowed'}</p>
            </div>
            
            <Alert>
              <Icons.help className="h-4 w-4" />
              <AlertDescription>
                Read each question carefully. You can review your answers before submitting.
                {content.timeLimit && ' Keep an eye on the timer!'}
              </AlertDescription>
            </Alert>

            <Button onClick={startQuiz} className="w-full" disabled={readonly}>
              <Icons.play className="h-4 w-4 mr-2" />
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </BaseLesson>
    )
  }

  return (
    <BaseLesson
      lesson={lesson}
      progress={progress}
      onProgress={onProgress}
      onComplete={onComplete}
      readonly={readonly}
      preview={preview}
    >
      <div className="space-y-6">
        {/* Quiz Header */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
                <Progress 
                  value={submitted ? 100 : ((currentQuestion + 1) / questions.length) * 100} 
                  className="w-48"
                />
              </div>
              
              {timeRemaining !== null && !submitted && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Time Remaining</p>
                  <p className={cn(
                    "text-lg font-mono",
                    timeRemaining < 300 && "text-red-600" // Last 5 minutes
                  )}>
                    {formatTime(timeRemaining)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        {submitted ? (
          <div className="space-y-4">
            {/* Results Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {score >= passingScore ? (
                    <>
                      <Icons.checkCircle className="h-5 w-5 text-green-600" />
                      Quiz Passed!
                    </>
                  ) : (
                    <>
                      <Icons.warning className="h-5 w-5 text-red-600" />
                      Quiz Not Passed
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Your Score:</span>
                    <span className="font-bold">{Math.round(score)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passing Score:</span>
                    <span>{passingScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Correct Answers:</span>
                    <span>{results.filter(r => r.correct).length} / {questions.length}</span>
                  </div>
                </div>
                
                {content.allowRetake && score < passingScore && (
                  <Button onClick={retakeQuiz} className="w-full mt-4">
                    <Icons.restart className="h-4 w-4 mr-2" />
                    Retake Quiz
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* All Questions with Results */}
            {questions.map((question, index) => renderQuestion(question, index))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current Question */}
            {renderQuestion(questions[currentQuestion], currentQuestion)}

            {/* Navigation */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                  >
                    <Icons.chevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    {currentQuestion < questions.length - 1 ? (
                      <Button
                        onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                      >
                        Next
                        <Icons.chevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={answers.length < questions.length}
                      >
                        <Icons.check className="h-4 w-4 mr-1" />
                        Submit Quiz
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Question Overview */}
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-2">Question Progress:</p>
                <div className="flex flex-wrap gap-2">
                  {questions.map((_, index) => (
                    <Button
                      key={index}
                      variant={index === currentQuestion ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentQuestion(index)}
                      className={cn(
                        "w-8 h-8 p-0",
                        isAnswered(questions[index].id) && index !== currentQuestion && "bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200"
                      )}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Answered: {answers.length} / {questions.length}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </BaseLesson>
  )
}