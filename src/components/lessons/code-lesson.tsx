'use client'

import React, { useState, useEffect } from 'react'
import { BaseLesson } from './base-lesson'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Icons } from '@/components/ui/icons'
import type { LessonComponentProps, CodeLessonContent } from '@/lib/lessons/types'

interface CodeLessonProps extends LessonComponentProps {
  onProgress?: (progress: number, data?: any) => void
  onComplete?: (data?: any) => void
}

interface TestResult {
  passed: boolean
  input: any
  expected: any
  actual: any
  description: string
}

export function CodeLesson({ lesson, progress, onProgress, onComplete, readonly, preview }: CodeLessonProps) {
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [currentHint, setCurrentHint] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const content = lesson.content as CodeLessonContent

  useEffect(() => {
    setCode(content.initialCode || '')
  }, [content.initialCode])

  // Simulate code execution (in a real app, this would use a code runner service)
  const runCode = async () => {
    setIsRunning(true)
    setOutput('')
    setTestResults([])
    setAttempts(prev => prev + 1)

    try {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Simple code execution simulation for JavaScript
      if (content.language === 'javascript') {
        try {
          // Create a safe evaluation environment
          const func = new Function(code + '\n//# sourceURL=user-code.js')
          const result = func()
          setOutput(String(result || 'Code executed successfully'))
        } catch (error: any) {
          setOutput(`Error: ${error.message}`)
        }
      } else {
        setOutput('Code execution completed')
      }

      // Run tests if available
      if (content.tests && content.tests.length > 0) {
        const results = content.tests.map(test => {
          try {
            // Simulate test execution
            const testFunc = new Function('input', code + `\nreturn ${test.input};`)
            const actual = testFunc(test.input)
            const passed = JSON.stringify(actual) === JSON.stringify(test.expected)
            
            return {
              passed,
              input: test.input,
              expected: test.expected,
              actual,
              description: test.description,
            }
          } catch (error: any) {
            return {
              passed: false,
              input: test.input,
              expected: test.expected,
              actual: `Error: ${error.message}`,
              description: test.description,
            }
          }
        })

        setTestResults(results)

        // Calculate progress based on test results
        const passedTests = results.filter(r => r.passed).length
        const progressPercent = (passedTests / results.length) * 100
        
        if (onProgress) {
          onProgress(progressPercent, {
            testResults: results,
            attempts,
            codeLength: code.length,
          })
        }

        // Auto-complete if all tests pass
        if (passedTests === results.length && onComplete && !readonly && !preview) {
          onComplete({
            testResults: results,
            attempts,
            code,
            allTestsPassed: true,
          })
        }
      } else {
        // No tests available, mark as complete after running
        if (onProgress) {
          onProgress(100, { attempts, codeLength: code.length })
        }
        if (onComplete && !readonly && !preview) {
          onComplete({ attempts, code, executed: true })
        }
      }

    } catch (error: any) {
      setOutput(`Error: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  const resetCode = () => {
    setCode(content.initialCode || '')
    setOutput('')
    setTestResults([])
    setShowSolution(false)
    setShowHints(false)
    setCurrentHint(0)
  }

  const showSolutionCode = () => {
    if (content.solution) {
      setCode(content.solution)
      setShowSolution(true)
    }
  }

  const getNextHint = () => {
    if (content.hints && currentHint < content.hints.length - 1) {
      setCurrentHint(prev => prev + 1)
    }
    setShowHints(true)
  }

  const getLanguageIcon = (language: string) => {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
        return '🟨'
      case 'python':
        return '🐍'
      case 'java':
        return '☕'
      case 'cpp':
      case 'c++':
        return '⚡'
      default:
        return '💻'
    }
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
        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>{getLanguageIcon(content.language)}</span>
              Coding Exercise - {content.language}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p>{content.instructions}</p>
            </div>
            {content.libraries && content.libraries.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Available Libraries:</p>
                <div className="flex flex-wrap gap-1">
                  {content.libraries.map((lib, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {lib}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Code Editor and Output */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Code Editor */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Code Editor</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetCode}
                    disabled={readonly}
                  >
                    <Icons.restart className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                  <Button
                    onClick={runCode}
                    disabled={isRunning || readonly}
                    size="sm"
                  >
                    {isRunning ? (
                      <>
                        <Icons.spinner className="h-4 w-4 mr-1 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Icons.play className="h-4 w-4 mr-1" />
                        Run Code
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your code here..."
                className="min-h-[300px] font-mono text-sm"
                disabled={readonly}
              />
              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span>Lines: {code.split('\n').length}</span>
                <span>Characters: {code.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Output and Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Output & Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="output" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="output">Console Output</TabsTrigger>
                  <TabsTrigger value="tests">
                    Tests {testResults.length > 0 && `(${testResults.filter(t => t.passed).length}/${testResults.length})`}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="output" className="space-y-4">
                  <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm min-h-[200px]">
                    <pre className="whitespace-pre-wrap">{output || 'Run your code to see output...'}</pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="tests" className="space-y-4">
                  {testResults.length > 0 ? (
                    <div className="space-y-2">
                      {testResults.map((result, index) => (
                        <Alert
                          key={index}
                          variant={result.passed ? "default" : "destructive"}
                          className="p-3"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <AlertDescription>
                                <div className="font-medium mb-1">
                                  {result.passed ? '✅' : '❌'} {result.description}
                                </div>
                                <div className="text-xs space-y-1">
                                  <div>Input: <code>{JSON.stringify(result.input)}</code></div>
                                  <div>Expected: <code>{JSON.stringify(result.expected)}</code></div>
                                  <div>Actual: <code>{JSON.stringify(result.actual)}</code></div>
                                </div>
                              </AlertDescription>
                            </div>
                          </div>
                        </Alert>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      Run your code to see test results...
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {content.hints && content.hints.length > 0 && (
                <Button
                  variant="outline"
                  onClick={getNextHint}
                  disabled={readonly}
                >
                  <Icons.help className="h-4 w-4 mr-1" />
                  Get Hint ({currentHint + 1}/{content.hints.length})
                </Button>
              )}
              
              {content.solution && (
                <Button
                  variant="outline"
                  onClick={showSolutionCode}
                  disabled={readonly}
                >
                  <Icons.eye className="h-4 w-4 mr-1" />
                  Show Solution
                </Button>
              )}
            </div>

            {showHints && content.hints && (
              <Alert>
                <Icons.help className="h-4 w-4" />
                <AlertDescription>
                  <strong>Hint {currentHint + 1}:</strong> {content.hints[currentHint]}
                </AlertDescription>
              </Alert>
            )}

            {showSolution && (
              <Alert>
                <Icons.warning className="h-4 w-4" />
                <AlertDescription>
                  <strong>Solution loaded:</strong> The solution code has been loaded into the editor. Study it to understand the approach.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Progress Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="space-y-1">
                <div>Attempts: {attempts}</div>
                {testResults.length > 0 && (
                  <div>
                    Tests Passed: {testResults.filter(t => t.passed).length} / {testResults.length}
                  </div>
                )}
              </div>
              <div className="text-right">
                {testResults.length > 0 && testResults.every(t => t.passed) && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    All Tests Passed! ✅
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BaseLesson>
  )
}