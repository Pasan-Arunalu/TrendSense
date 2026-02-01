"use client"
import type { IconButtonProps, SpanProps } from "@chakra-ui/react"
import { ClientOnly, IconButton, Skeleton, Span } from "@chakra-ui/react"
import { ThemeProvider, useTheme } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import * as React from "react"
import { LuSun } from "react-icons/lu"


export interface ColorModeProviderProps extends ThemeProviderProps {}

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    />
  )
}


export type ColorMode = "light"

export interface UseColorModeReturn {
  colorMode: ColorMode
  setColorMode: () => void
  toggleColorMode: () => void
}

export function useColorMode(): UseColorModeReturn {
  const { setTheme } = useTheme()

  return {
    colorMode: "light",
    setColorMode: () => setTheme("light"),
    toggleColorMode: () => setTheme("light"), 
  }
}

export function useColorModeValue<T>(light: T, _dark: T) {
  return light
}


export function ColorModeIcon() {
  return <LuSun />
}

interface ColorModeButtonProps extends Omit<IconButtonProps, "aria-label"> {}

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  return (
    <ClientOnly fallback={<Skeleton boxSize="9" />}>
      <IconButton
        aria-label="Light mode"
        variant="ghost"
        size="sm"
        ref={ref}
        {...props}
        css={{
          _icon: {
            width: "5",
            height: "5",
          },
        }}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  )
})

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function LightMode(props, ref) {
    return (
      <Span
        display="contents"
        className="chakra-theme light"
        ref={ref}
        {...props}
      />
    )
  },
)

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function DarkMode(props, ref) {
    return (
      <Span
        display="contents"
        className="chakra-theme light"
        ref={ref}
        {...props}
      />
    )
  },
)
