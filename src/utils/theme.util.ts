import {
  Theme,
  applyTheme,
  argbFromHex,
  themeFromSourceColor,
} from '@material/material-color-utilities'
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js'

function generateTheme(): Theme {
  const theme = themeFromSourceColor(argbFromHex('#f82506'), [
    {
      name: 'custom-1',
      value: argbFromHex('#ff0000'),
      blend: true,
    },
  ])

  return theme
}

export function applyCustomTheme() {
  if (typescaleStyles.styleSheet)
    document.adoptedStyleSheets.push(typescaleStyles.styleSheet)

  const systemDarkMedia = window.matchMedia('(prefers-color-scheme: dark)')
  const theme = generateTheme()

  applyTheme(theme, { target: document.body, dark: systemDarkMedia.matches })

  systemDarkMedia.addEventListener('change', () => {
    applyTheme(theme, { target: document.body, dark: systemDarkMedia.matches })
  })
}
