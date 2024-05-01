import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('visual-representation-element')
export class VisualRepresentationElement extends LitElement {
  render() {
    return html`<span>Visual representation</span>`
  }
}
