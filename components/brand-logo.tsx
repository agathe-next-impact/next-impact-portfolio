'use client'

import * as React from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'

interface BrandLogoProps {
  src?: string
  /** Asset alternatif explicite pour le light mode. Si fourni, désactive le filtre CSS. */
  srcLight?: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  fetchPriority?: 'high' | 'low' | 'auto'
}

/**
 * theme-system: wrapper qui swappe l'asset selon le thème.
 * En attendant les variantes "logo-couleur-*", on applique un filtre CSS
 * en light mode pour transformer le logo blanc en darkblue (#020F59).
 */
export function BrandLogo({
  src = '/img/logo-blanc-carre.png',
  srcLight,
  alt,
  width,
  height,
  className = '',
  priority,
  fetchPriority,
}: BrandLogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isLight = mounted && resolvedTheme === 'light'
  const useLightAsset = isLight && Boolean(srcLight)
  const finalSrc = useLightAsset ? (srcLight as string) : src

  return (
    <Image
      src={finalSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      fetchPriority={fetchPriority}
      style={{
        width: 'auto',
        height: 'auto',
        // Filtre uniquement si pas d'asset light explicite : transforme le blanc en darkblue
        filter: isLight && !srcLight
          ? 'brightness(0) saturate(100%) invert(8%) sepia(92%) saturate(5000%) hue-rotate(232deg) brightness(45%) contrast(110%)'
          : undefined,
      }}
    />
  )
}
