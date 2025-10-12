import { LitElement, css, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { MdDialog } from '@material/web/dialog/dialog.ts'
import { SignatureField } from 'signature-field'
import { PushSignatureEvent } from '../contexts/signatures.context'
import {
  Authenticity,
  authenticityValues,
  Signature,
} from '../model/signature.ts'
import { Signer } from '../model/signer.ts'
import { consume } from '@lit/context'
import {
  signersContext,
  SignersContextData,
} from '../contexts/signers.context.ts'
import { capitalizeFirst } from '../utils/string.util.ts'
import {
  MdOutlinedButton,
  MdOutlinedSelect,
  MdOutlinedTextField,
} from '@material/web/all'

@customElement('signature-capture-element')
export class SignatureCaptureElement extends LitElement {
  static styles = css`
    :host {
      --md-dialog-container-color: var(--md-sys-color-surface);
      --md-sys-color-surface-container: var(--md-sys-color-surface-variant);
    }

    md-dialog {
      max-width: 100vw;
      max-height: 100vh;
    }

    form > div {
      width: 100%;
      height: 100%;
      display: grid;
      grid-gap: 16px;
      grid-template-columns: 1fr 0.5fr;
      grid-template-areas:
        'text  text'
        'field field'
        'name  authenticity';
    }

    form > div > p {
      grid-area: text;
    }

    #signature-field-wrapper {
      grid-area: field;
      width: 100%;
      max-width: 500px;
      height: 200px;
    }

    #signature-field-wrapper.max-size {
      width: 100%;
      max-width: unset;
      height: calc(100vh - 282px);
    }

    form > div md-outlined-text-field {
      grid-area: name;
    }

    form > div md-outlined-select {
      grid-area: authenticity;
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

  @query('#authenticity-selector')
  private authenticitySelector!: MdOutlinedSelect

  @query('#name-input')
  private nameInput!: MdOutlinedTextField

  @query('#add-signature-button')
  private addSignatureButton!: MdOutlinedButton

  @query('#signature-field-wrapper')
  private signatureFieldWrapper!: Element

  private signatureFieldWrapperResizeObserver = new ResizeObserver(
    (entries) => {
      this.setSignatureFieldSize({
        width: entries[0].contentBoxSize[0].inlineSize,
        height: entries[0].contentBoxSize[0].blockSize,
      })
    }
  )

  render() {
    return html`
      <md-filled-button
        .disabled="${this.selectedSigner === null}"
        @click="${() => {
          this.dialog.show().then()
        }}"
      >
        Capture
        <draw-icon slot="icon"></draw-icon>
      </md-filled-button>

      <md-dialog
        id="dialog"
        @opened="${this.onDialogOpened}"
        @closed="${this.onDialogClose}"
      >
        <div slot="headline">Signature Capture</div>

        <form slot="content" id="signature-capture-dialog-form" method="dialog">
          <div>
            <p>Draw a signature into the input field below.</p>
            <div id="signature-field-wrapper">
              <signature-field
                noControls
                width="500px"
                height="200px"
              ></signature-field>
            </div>

            <md-outlined-text-field
              id="name-input"
              label="Signature Name"
              @input="${() =>
                (this.addSignatureButton!.disabled =
                  this.nameInput.value.trim() === '')}"
            ></md-outlined-text-field>

            <md-outlined-select id="authenticity-selector" label="Authenticity">
              ${authenticityValues.map(
                (authenticity) =>
                  html`<md-select-option
                    value="${authenticity}"
                    display-text="${capitalizeFirst(authenticity)}"
                    ?selected="${authenticity === 'genuine'}"
                  >
                    <div slot="headline">${capitalizeFirst(authenticity)}</div>
                  </md-select-option>`
              )}
            </md-outlined-select>
          </div>
        </form>

        <div slot="actions">
          <md-filled-button
            id="add-signature-button"
            form="signature-capture-dialog-form"
            @click="${this.onAddClick}"
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
          <md-outlined-button @click="${this.onEnlargeClick}">
            Maximize
          </md-outlined-button>
          <md-text-button form="signature-capture-dialog-form">
            Close
          </md-text-button>
        </div>
      </md-dialog>
    `
  }

  private async onAddClick() {
    const name = this.nameInput.value.trim()
    const dataPoints = this.signatureField.dataPoints
    const authenticity = this.authenticitySelector.value as Authenticity
    const origin = 'In-App Drawn'
    const signature = new Signature(name, dataPoints, authenticity, origin)

    if (this.selectedSigner !== null) {
      signature.signer = this.selectedSigner
      this.selectedSigner.addSignatures(signature)
    }

    this.dispatchEvent(new PushSignatureEvent(signature))
    this.signatureField.clear()
  }

  private onEnlargeClick() {
    this.signatureField.clear()
    this.signatureFieldWrapper.classList.add('max-size')
  }

  private onDialogOpened(_e: Event) {
    this.nameInput.value = `#${(this.selectedSigner?.signatures.length ?? 0) + 1}`
    this.signatureFieldWrapperResizeObserver.observe(this.signatureFieldWrapper)
  }

  private onDialogClose(_e: Event) {
    this.signatureFieldWrapper.classList.remove('max-size')
    this.signatureFieldWrapperResizeObserver.disconnect()
  }

  private setSignatureFieldSize(size: { width: number; height: number }) {
    this.signatureField.width = `${size.width}px`
    this.signatureField.height = `${size.height}px`
  }
}
