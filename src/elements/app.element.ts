import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('app-element')
export class AppElement extends LitElement {
  render() {
    return html`<h1>Signature Inspector</h1>
      <signature-loader-element></signature-loader-element>
      <signature-list-element></signature-list-element>
      <visualizer-element></visualizer-element>`
  }
}
