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

  render() {
    return html`<span>${this.signatures.filter((s) => s.visible).length}</span>`
  }
}
