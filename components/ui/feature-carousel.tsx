"use client"

import {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react"
import Image, { type StaticImageData } from "next/image"
import clsx from "clsx"
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  type MotionStyle,
  type MotionValue,
  type Variants,
} from "framer-motion"
import Balancer from "react-wrap-balancer"

import { cn } from "@/lib/utils"
import { Card } from "./card"
import LottieAnimation from "./lottie-animation"

// Types
type WrapperStyle = MotionStyle & {
  "--x": MotionValue<string>
  "--y": MotionValue<string>
}

interface CardProps {
  title: string
  description: React.ReactNode
  bgClass?: string
}

interface ImageSet {
  step1dark1?: StaticImageData | string
  step1dark2?: StaticImageData | string
  step1light1: StaticImageData | string
  step1light2: StaticImageData | string
  step2dark1?: StaticImageData | string
  step2dark2?: StaticImageData | string
  step2light1: StaticImageData | string
  step2light2: StaticImageData | string
  step3dark?: StaticImageData | string
  step3light: StaticImageData | string
  step4light: StaticImageData | string
  alt: string
}

interface FeatureCarouselProps extends CardProps {
  step1img1Class?: string
  step1img2Class?: string
  step2img1Class?: string
  step2img2Class?: string
  step3imgClass?: string
  step4imgClass?: string
  image: ImageSet
}

interface StepImageProps {
  src: StaticImageData | string
  alt: string
  className?: string
  style?: React.CSSProperties
  width?: number
  height?: number
}

interface Step {
  id: string
  name: string
  title: string
  description: ReactNode
}

// Constants
const TOTAL_STEPS = 4

const steps = [
  {
    id: "1",
    name: "PRENDRE DES INFOS",
    title: "1 - S'informer pour pouvoir s'orienter",
    description: <>
            <p>Connaître en amont les éléments essentiels de la création d'un site web, c'est se donner les moyens de faire les bons choix.</p>
            <div className="flex gap-4 py-4">
              <div className="flex flex-col basis-[25%] gap-2 align-bottom rounded-lg bg-lightblue/10 p-4 text-regularblue">                  
                  <p className="text-sm leading-tight">
                    Beautifully designed components that you can copy and
                    paste into your apps. Accessible. Customizable. Open
                    Source.
                  </p>
                  <LottieAnimation animationPath="/lotties/thoughtful-astronaut.json" />
              </div>
              <div className="flex flex-col basis-[75%] gap-2">
                  <div className="flex flex-col gap-2">
                    <div className="w-full h-full p-2">
                      <div className="text-xl font-googletitre text-regularblue">Les étapes de création d'un site web</div>
                      <p className="text-xs">De l'expression des besoins à la mise en ligne</p>
                    </div>
                    <div className="w-full h-full p-2">
                      <div className="text-xl font-googletitre text-regularblue">Les types de sites web</div>
                      <p className="text-xs">Vitrine, e-commerce, blog, plateforme</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="w-full h-full p-2">
                      <div className="text-xl font-googletitre text-regularblue">Les technologies de création de site web</div>
                      <p className="text-xs">CMS, no-code, développement sur mesure, headless CMS…</p>
                    </div>
                    <div className="w-full h-full p-2">
                      <div className="text-xl font-googletitre text-regularblue">Les bonnes pratiques</div>
                      <p className="text-xs">Design, SEO et performances</p>
                    </div>
                  </div>
              </div>
            </div>
            </>
  },
  {
    id: "2",
    name: "TESTER ET DECIDER",
    title: "2 - Tester son site et son projet pour décider",
    description: <p>Comparer les outils (WordPress, Webflow, Shopify, Headless) et choisir la solution adaptée</p>,
  },
  {
    id: "3",
    name: "FORMALISER", 
    title: "3 - Avoir des livrables pour structurer",
    description: <p>Diagnostiquer son site actuel et rédiger un cahier des charges technique précis</p>,
  },
  {
    id: "4",
    name: "LANCER LE PROJET",
    title: "4 - Faire appel aux bons professionnels",
    description: <p>Services de création et de refonte de site web et accompagnements personnalisés</p>,
  },
] as const

/**
 * Animation presets for reusable motion configurations.
 * Each preset defines the initial, animate, and exit states,
 * along with spring physics parameters for smooth transitions.
 */
const ANIMATION_PRESETS = {
  fadeInScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: {
      type: "spring",
      stiffness: 300, // Higher value = more rigid spring
      damping: 25, // Higher value = less oscillation
      mass: 0.5, // Lower value = faster movement
    },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.5,
    },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.5,
    },
  },
} as const

type AnimationPreset = keyof typeof ANIMATION_PRESETS

interface AnimatedStepImageProps extends StepImageProps {
  preset?: AnimationPreset
  delay?: number
  onAnimationComplete?: () => void
}

/**
 * Custom hook for managing cyclic transitions with auto-play functionality.
 * Handles both automatic cycling and manual transitions between steps.
 */
function useNumberCycler(
  totalSteps: number = TOTAL_STEPS,
  interval: number = 7000
) {
  const [currentNumber, setCurrentNumber] = useState(0)
  const [isManualInteraction, setIsManualInteraction] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Setup timer function
  const setupTimer = useCallback(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      setCurrentNumber((prev) => (prev + 1) % totalSteps)
      setIsManualInteraction(false)
      // Recursively setup next timer
      setupTimer()
    }, interval)
  }, [interval, totalSteps])

  // Handle manual increment
  const increment = useCallback(() => {
    setIsManualInteraction(true)
    setCurrentNumber((prev) => (prev + 1) % totalSteps)

    // Reset timer on manual interaction
    setupTimer()
  }, [totalSteps, setupTimer])

  // Initial timer setup and cleanup
  useEffect(() => {
    setupTimer()

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [setupTimer])

  // Debug logging
  useEffect(() => {
    // State changed
  }, [currentNumber, isManualInteraction])

  return {
    currentNumber,
    increment,
    isManualInteraction,
  }
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent
    const isSmall = window.matchMedia("(max-width: 768px)").matches
    const isMobile = Boolean(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.exec(
        userAgent
      )
    )

    const isDev = process.env.NODE_ENV !== "production"
    if (isDev) setIsMobile(isSmall || isMobile)

    setIsMobile(isSmall && isMobile)
  }, [])

  return isMobile
}

// Components
function IconCheck({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="white"
      className={cn("h-4 w-4", className)}
      {...props}
    >
      <path d="m229.66 77.66-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z" />
    </svg>
  )
}

const stepVariants: Variants = {
  inactive: {
    scale: 0.8,
    opacity: 0.5,
  },
  active: {
    scale: 1,
    opacity: 1,
  },
}

const StepImage = forwardRef<
  HTMLImageElement,
  StepImageProps & { [key: string]: any }
>(
  (
    { src, alt, className, style, width = 1200, height = 630, ...props },
    ref
  ) => {
    return (
      <Image
        ref={ref}
        alt={alt}
        className={className}
        src={src}
        width={width}
        height={height}
        style={{
          position: "absolute",
          userSelect: "none",
          maxWidth: "unset",
          ...style,
        }}
        {...props}
      />
    )
  }
)
StepImage.displayName = "StepImage"

const MotionStepImage = motion(StepImage)

/**
 * Wrapper component for StepImage that applies animation presets.
 * Simplifies the application of complex animations through preset configurations.
 */
const AnimatedStepImage = ({
  preset = "fadeInScale",
  delay = 0,
  onAnimationComplete,
  ...props
}: AnimatedStepImageProps) => {
  const presetConfig = ANIMATION_PRESETS[preset]
  return (
    <MotionStepImage
      {...props}
      {...presetConfig}
      transition={{
        ...presetConfig.transition,
        delay,
      }}
      onAnimationComplete={onAnimationComplete}
    />
  )
}

/**
 * Main card component that handles mouse tracking for gradient effect.
 * Uses motion values to create an interactive gradient that follows the cursor.
 */
function FeatureCard({
  bgClass,
  children,
  step,
}: CardProps & {
  children: React.ReactNode
  step: number
}) {
  const [mounted, setMounted] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const isMobile = useIsMobile()

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    if (isMobile) return
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.div
      className="animated-cards relative w-full rounded-[16px]"
      onMouseMove={handleMouseMove}
      style={
        {
          "--x": useMotionTemplate`${mouseX}px`,
          "--y": useMotionTemplate`${mouseY}px`,
        } as WrapperStyle
      }
    >
      <div
        className={clsx(
          "group relative w-full overflow-hidden rounded-3xl bg-lightblue-500 transition duration-300",
          "md:hover:border-transparent",
          bgClass
        )}
      >
        <div className="m-10 min-h-[450px] w-full py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="flex flex-col gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <motion.h2
                className="text-xl font-regular tracking-tight text-regularblue md:text-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.1,
                  duration: 0.3,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                {steps[step].title}
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.2,
                  duration: 0.3,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                <div className="text-sm leading-5 text-neutral-300 sm:text-base sm:leading-5 dark:text-zinc-400">
                  {steps[step].description}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
          {mounted ? children : null}
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Progress indicator component that shows current step and completion status.
 * Handles complex state transitions and animations for step indicators.
 */
function Steps({
  steps,
  current,
  onChange,
}: {
  steps: readonly Step[]
  current: number
  onChange: (index: number) => void
}) {
  return (
    <nav aria-label="Progress" className="flex justify-center px-4">
      <ol
        className="flex w-full flex-wrap items-start justify-start gap-2 sm:justify-center md:w-10/12 md:divide-y-0"
        role="list"
      >
        {steps.map((step, stepIdx) => {
          // Calculate step states for styling and animations
          const isCompleted = current > stepIdx
          const isCurrent = current === stepIdx
          const isFuture = !isCompleted && !isCurrent

          return (
            <motion.li
              key={`${step.name}-${stepIdx}`}
              initial="inactive"
              animate={isCurrent ? "active" : "inactive"}
              variants={stepVariants}
              transition={{ duration: 0.3 }}
              className={cn(
                "relative z-50 px-3 py-1 transition-all duration-300 ease-in-out md:flex",
                isCompleted ? "" : ""
              )}
            >
              <div
                className={cn(
                  "group flex w-full cursor-pointer items-center focus:outline-none focus-visible:ring-2",
                  (isFuture || isCurrent) && "pointer-events-none"
                )}
                onClick={() => onChange(stepIdx)}
              >
                <span className="flex items-center gap-2 font-medium">
                  <motion.span
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.2 : 1,
                    }}
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full duration-300",
                      isCompleted &&
                        "bg-brand-400",
                      isCurrent &&
                        "bg-brand-300/80",
                      isFuture && "bg-brand-300/10"
                    )}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <IconCheck className="h-3 w-3 stroke-white stroke-[3] text-white" />
                      </motion.div>
                    ) : (
                      <span
                        className={cn(
                          "text-xs font-googletitre text-white",
                          !isCurrent && "text-white"
                        )}
                      >
                        {stepIdx + 1}
                      </span>
                    )}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={clsx(
                      "px-4 py-2 text-lg font-googletitre duration-300",
                      isCompleted && "text-regularblue",
                      isCurrent && "text-regularblue border-b-2 border-regularblue",
                      isFuture && "text-regularblue",
                    )}
                  >
                    {step.name}
                  </motion.span>
                </span>
              </div>
            </motion.li>
          )
        })}
      </ol>
    </nav>
  )
}


const defaultClasses = {
  step1img1:
    "pointer-events-none w-[50%] border border-border-100/10 transition-all duration-500 dark:border-border-700/50 rounded-2xl",
  step1img2:
    "pointer-events-none w-[60%] border border-border-100/10 dark:border-border-700/50 transition-all duration-500 overflow-hidden rounded-2xl",
  step2img1:
    "pointer-events-none w-[50%] border border-border-100/10 transition-all duration-500 dark:border-border-700 rounded-2xl overflow-hidden",
  step2img2:
    "pointer-events-none w-[40%] border border-border-100/10 dark:border-border-700 transition-all duration-500 rounded-2xl overflow-hidden",
  step3img:
    "pointer-events-none w-[90%] border border-border-100/10 dark:border-border-700 rounded-2xl transition-all duration-500 overflow-hidden",
  step4img:
    "pointer-events-none w-[90%] border border-border-100/10 dark:border-border-700 rounded-2xl transition-all duration-500 overflow-hidden",
} as const

/**
 * Main component that orchestrates the multi-step animation sequence.
 * Manages state transitions, handles animation timing, and prevents
 * animation conflicts through the isAnimating flag.
 */
export function FeatureCarousel({
  image,
  step1img1Class = defaultClasses.step1img1,
  step1img2Class = defaultClasses.step1img2,
  step2img1Class = defaultClasses.step2img1,
  step2img2Class = defaultClasses.step2img2,
  step3imgClass = defaultClasses.step3img,
  step4imgClass = defaultClasses.step4img,
  ...props
}: FeatureCarouselProps) {
  const { currentNumber: step, increment } = useNumberCycler()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleIncrement = () => {
    if (isAnimating) return
    setIsAnimating(true)
    increment()
  }

  const handleAnimationComplete = () => {
    setIsAnimating(false)
  }

  

  const renderStepContent = () => {
    const content = () => {
      switch (step) {
        
        case 0:
          /**
           * Layout: Two images side by side
           * - Left image (step1img1): 50% width, positioned left
           * - Right image (step1img2): 60% width, positioned right
           * Animation:
           * - Left image slides in from left
           * - Right image slides in from right with 0.1s delay
           * - Both use spring animation for smooth motion
           */
          return (
            <motion.div
              className="relative w-full h-full"
              onAnimationComplete={handleAnimationComplete}
            >
              <AnimatedStepImage
                alt={image.alt}
                className={clsx(step1img1Class)}
                src={image.step1light1}
                preset="slideInLeft"
              />
              <AnimatedStepImage
                alt={image.alt}
                className={clsx(step1img2Class)}
                src={image.step1light2}
                preset="slideInRight"
                delay={0.1}
              />
            </motion.div>
          )
        case 1:
          /**
           * Layout: Two images with overlapping composition
           * - First image (step2img1): 50% width, positioned left
           * - Second image (step2img2): 40% width, overlaps first image
           * Animation:
           * - Both images fade in and scale up from 95%
           * - Second image has 0.1s delay for staggered effect
           * - Uses spring physics for natural motion
           */
          return (
            <motion.div
              className="relative w-full h-full"
              onAnimationComplete={handleAnimationComplete}
            >
              <AnimatedStepImage
                alt={image.alt}
                className={clsx(step2img1Class, "rounded-2xl")}
                src={image.step2light1}
                preset="fadeInScale"
              />
              <AnimatedStepImage
                alt={image.alt}
                className={clsx(step2img2Class, "rounded-2xl")}
                src={image.step2light2}
                preset="fadeInScale"
                delay={0.1}
              />
            </motion.div>
          )
        case 2:
          /**
           * Layout: Single centered image
           * - Full width image (step3img): 90% width, centered
           * Animation:
           * - Fades in and scales up from 95%
           * - Uses spring animation for smooth scaling
           * - Triggers animation complete callback
           */
          return (
            <AnimatedStepImage
              alt={image.alt}
              className={clsx(step3imgClass, "rounded-2xl")}
              src={image.step3light}
              preset="fadeInScale"
              onAnimationComplete={handleAnimationComplete}
            />
          )
        case 3:
          /**
           * Layout: Final showcase layout
           * - Container: Centered, 60% width on desktop
           * - Image (cult): 90% width, positioned slightly up
           * Animation:
           * - Container fades in and scales up
           * - Image follows with 0.1s delay
           * - Both use spring physics for natural motion
           */
          return (
            <motion.div
              className={clsx(
                "absolute left-2/4 top-1/3 flex w-[100%] -translate-x-1/2 -translate-y-[33%] flex-col gap-12 text-center text-2xl font-bold md:w-[60%]"
              )}
              {...ANIMATION_PRESETS.fadeInScale}
              onAnimationComplete={handleAnimationComplete}
            >
              <AnimatedStepImage
                alt={image.alt}
                className="pointer-events-none top-[50%] w-[400px] overflow-hidden rounded-2xl border border-neutral-100/10 md:left-[35px] md:top-[30%] md:w-full dark:border-zinc-700"
                src={image.step4light}
                preset="fadeInScale"
                delay={0.1}
              />
            </motion.div>
          )
        default:
          return null
      }
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          {...ANIMATION_PRESETS.fadeInScale}
          className="w-full h-full absolute"
        >
          {content()}
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <FeatureCard {...props} step={step}>
      {renderStepContent()}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute left-[12rem] top-5 z-50 h-full w-full cursor-pointer md:left-0"
      >
        <Steps current={step} onChange={() => {}} steps={steps} />
      </motion.div>
      <motion.div
        className="absolute right-0 top-0 z-50 h-full w-full cursor-pointer md:left-0"
        onClick={handleIncrement}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      />
    </FeatureCard>
  )
}
export default FeatureCarousel