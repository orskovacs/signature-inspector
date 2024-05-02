import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import {
  HideAllSignaturesEvent,
  SetSignatureVisibilityEvent,
  ShowAllSignaturesEvent,
  SignatureData,
  signaturesContext,
} from '../contexts/signatures.context'
import { consume } from '@lit/context'

@customElement('signature-list-element')
export class SignatureListElement extends LitElement {
  @consume({ context: signaturesContext, subscribe: true })
  private signatures!: SignatureData[]

  render() {
    return html`<md-list>
      <md-list-item>
        <div slot="start">
          <md-checkbox
            touch-target="wrapper"
            ?checked=${this.signatures.every((s) => s.visible)}
            ?indeterminate=${!this.signatures.every((s) => s.visible) &&
            this.signatures.some((s) => s.visible)}
            @click=${() => {
              if (this.signatures.every((s) => s.visible))
                this.dispatchEvent(new HideAllSignaturesEvent())
              else this.dispatchEvent(new ShowAllSignaturesEvent())
            }}
          ></md-checkbox>
        </div>
      </md-list-item>
      ${this.signatures.map((s, i) => {
        return this.getItemTemplate(s, i)
      })}
    </md-list>`
  }

  private getItemTemplate = (s: SignatureData, index: number) =>
    html`<md-list-item>
        <span>${new Date(s.signature.creationTimeStamp).toLocaleString()}</span>
        <div slot="start">
          <md-checkbox
            touch-target="wrapper"
            ?checked=${s.visible}
            @click=${() => {
              this.dispatchEvent(
                new SetSignatureVisibilityEvent(index, !s.visible)
              )
            }}
          ></md-checkbox>
        </div>
        <div slot="end">
          <input type="color" value="#f6b73c" />
          <md-filled-tonal-button>
            Delete
            <svg slot="icon" height="24" viewBox="0 -960 960 960" width="24">
              <path
                d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
              />
            </svg>
          </md-filled-tonal-button>
        </div>
      </md-list-item>
      <md-divider></md-divider>`
}
