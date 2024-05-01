import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('pressure-graph-element')
export class PressureGraphElement extends LitElement {
  render() {
    return html`<span>Pressure</span>`
  }
}
