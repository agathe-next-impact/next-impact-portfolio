"use client"

import { useState, useEffect } from "react"

interface TypewriterLoadingProps {
  messages?: string[]
  speed?: number
  className?: string
}

export function TypewriterLoading({
  messages = ["Initializing system...", "Loading resources...", "Almost ready...", "Preparing your experience..."],
  speed = 50,
  className = "",
}: TypewriterLoadingProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentMessage = messages[currentMessageIndex]

    if (!isDeleting && displayedText === currentMessage) {
      // Message complete, wait then start deleting
      const timeout = setTimeout(() => setIsDeleting(true), 1500)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && displayedText === "") {
      // Deletion complete, move to next message
      setIsDeleting(false)
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
      return
    }

    // Type or delete one character
    const timeout = setTimeout(
      () => {
        setDisplayedText((prev) => (isDeleting ? prev.slice(0, -1) : currentMessage.slice(0, prev.length + 1)))
      },
      isDeleting ? speed / 2 : speed,
    )

    return () => clearTimeout(timeout)
  }, [displayedText, isDeleting, currentMessageIndex, messages, speed])

  return (
    <div className={`flex flex-col items-center justify-center gap-6 ${className}`}>

      {/* Typewriter text */}
      <div className="flex items-center gap-2 text-center">
        <p className="font-googletitre text-lg text-white">
          {displayedText}
          <span className="animate-pulse text-white">|</span>
        </p>
      </div>
    </div>
  )
}
