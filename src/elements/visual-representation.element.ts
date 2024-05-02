import { consume } from '@lit/context'
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import {
  signaturesContext,
  SignatureData,
} from '../contexts/signatures.context'

@customElement('visual-representation-element')
export class VisualRepresentationElement extends LitElement {
  @consume({ context: signaturesContext, subscribe: true })
  private signatures!: SignatureData[]

  private get visibleSignatures(): SignatureData[] {
    return this.signatures.filter((s) => s.visible)
  }

  render() {
    return html`<div>${this.visibleSignatures.length}</div>
      ${this.visibleSignatures.map(
        (s) =>
          html`<div .style="background-color: #${s.colorHex}">
            ${s.colorHex}
          </div>`
      )}`
  }
}
