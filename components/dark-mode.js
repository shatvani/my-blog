'use client'

import useDarkMode from "@/hooks/use-dark-mode"

const nextModeIcons = {
  dark: '🌞',
  light: '🌜',
  system: '🌓',
}

function DarkMode({defaultTheme}) {
  const { theme, toggleTheme } = useDarkMode(defaultTheme);

  return (
    <button onClick={toggleTheme}>{nextModeIcons[theme]}</button>
  )
}

export default DarkMode
