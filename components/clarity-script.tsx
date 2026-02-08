'use client'

import { useEffect } from 'react'

export function ClarityScript() {
  useEffect(() => {
    import('@microsoft/clarity').then((clarity) => {
      clarity.default.init('vdyvivixlr')
    })
  }, [])

  return null
}