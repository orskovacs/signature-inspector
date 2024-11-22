import './style.css'
import { applyCustomTheme } from './utils/theme.util'
import { dotnet } from './dotnet-assembly-exports.ts'
import { DotnetAssemblyExports } from './dotnet-assembly-exports.js'

window.addEventListener('DOMContentLoaded', () => {
  applyCustomTheme()
})

await google.charts.load('current', { packages: ['corechart', 'line', 'table'] })

const is_browser = typeof window != 'undefined'
if (!is_browser) throw new Error(`Expected to be running in a browser`)

const { getAssemblyExports, getConfig } = await dotnet.create()

const config = getConfig()
const exports: DotnetAssemblyExports = await getAssemblyExports(
  config.mainAssemblyName!
)
const text = exports.SignatureVerifier.JSExportContainer.Greet('Teszt Elek')
console.log(text)

// await dotnet.run()
