import { LitElement, css, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { MdDialog } from '@material/web/dialog/dialog.ts'
import { SignatureField } from 'signature-field'
import { PushSignatureEvent } from '../contexts/signatures.context'
import { Signature } from '../model/signature.ts'
import { Signer } from '../model/signer.ts'
import { consume } from '@lit/context'
import {
  signersContext,
  SignersContextData,
} from '../contexts/signers.context.ts'

@customElement('signature-input-element')
export class SignatureInputElement extends LitElement {
  static styles = css`
    :host {
      --md-dialog-container-color: var(--md-sys-color-surface);
      --md-sys-color-surface-container: var(--md-sys-color-surface-variant);
    }

    signature-field {
      background-color: white;
    }
  `

  @consume({ context: signersContext, subscribe: true })
  private signersContextData!: SignersContextData

  private get selectedSigner(): Signer | null {
    if (this.signersContextData.selectedSignerIndex === null) return null
    return this.signersContextData.signers[
      this.signersContextData.selectedSignerIndex
    ]
  }

  @query('#dialog')
  private dialog!: MdDialog

  @query('signature-field')
  private signatureField!: SignatureField

  render() {
    return html`
      <md-filled-button
        .disabled="${this.selectedSigner === null}"
        @click="${() => {
          this.dialog.show().then()
        }}"
      >
        Draw
        <draw-icon slot="icon"></draw-icon>
      </md-filled-button>

      <md-dialog id="dialog">
        <div slot="headline">Signature Input</div>

        <form slot="content" id="signature-input-dialog-form" method="dialog">
          Draw a signature into the input field below.
          <div>
            <signature-field
              noControls
              width="500px"
              height="200px"
            ></signature-field>
          </div>
        </form>

        <div slot="actions">
          <md-filled-button
            form="signature-input-dialog-form"
            @click="${async () => {
              const dataPoints = this.signatureField.dataPoints
              this.signatureField.clear()
              const signature = new Signature(dataPoints)
              this.selectedSigner?.addSignatures(signature)
              this.dispatchEvent(new PushSignatureEvent(signature))
            }}"
          >
            Add signature
          </md-filled-button>
          <md-outlined-button
            @click="${() => {
              this.signatureField.clear()
            }}"
          >
            Clear input
          </md-outlined-button>
          <md-text-button form="signature-input-dialog-form">
            Close
          </md-text-button>
        </div>
      </md-dialog>
    `
  }
}
