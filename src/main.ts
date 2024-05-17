import './style.css'
import { applyCustomTheme } from './utils/theme.util'

window.addEventListener('load', () => {
  applyCustomTheme()
})

google.charts.load('current', { packages: ['corechart', 'line', 'table'] })
