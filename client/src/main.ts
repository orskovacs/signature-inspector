import './style.css'
import { applyCustomTheme } from './utils/theme.util'

applyCustomTheme()

await google.charts.load('current', {
  packages: ['corechart', 'line', 'table'],
})
