import './style.css'
import { applyCustomTheme } from './utils/theme.util'

window.addEventListener('DOMContentLoaded', () => {
  applyCustomTheme()
})

await google.charts.load('current', { packages: ['corechart', 'line', 'table'] })
