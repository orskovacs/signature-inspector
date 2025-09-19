import { LitElement, css, html, nothing } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { MdDialog } from '@material/web/dialog/dialog.ts'
import { SignatureField } from 'signature-field'
import {
  PushSignatureEvent,
  PushSignaturesEvent,
} from '../contexts/signatures.context'
import { SignatureParser } from '../parsers/signature-parser'
import { SignaturesFileParser } from '../parsers/signatures-file-parser'
import { Svc2004Parser } from '../parsers/svc-2004-parser'
import { Signature } from '../model/signature.ts'
import { Signer } from '../model/signer.ts'
import { DeepSignParser } from '../parsers/deep-sign-parser.ts'
import { consume } from '@lit/context'
import {
  signersContext,
  SignersContextData,
} from '../contexts/signers.context.ts'
import { MdOutlinedSelect } from '@material/web/all'

@customElement('signature-loader-element')
export class SignatureLoaderElement extends LitElement {
  static styles = css`
    :host {
      --md-dialog-container-color: var(--md-sys-color-surface);
      --md-sys-color-surface-container: var(--md-sys-color-surface-variant);
    }

    .buttons {
      display: flex;
      gap: 8px;
    }

    .error-conatiner {
      background-color: var(--md-sys-color-error);
      color: var(--md-sys-color-on-error);
      border-radius: 28px;
      padding-inline: 24px;
      padding-block: 18px;
    }

    label {
      display: inline-block;
      margin-bottom: 12px;
    }

    form#signature-import-dialog-form {
      display: grid;
      grid-template-columns: auto auto;
      grid-gap: 12px;
    }

    signature-field {
      background-color: white;
    }
  `

  private readonly parsers: ReadonlyArray<{
    name: string
    parser: SignatureParser
  }> = [
    {
      name: 'Signatures file',
      parser: new SignaturesFileParser(),
    },
    {
      name: 'SVC 2004 file',
      parser: new Svc2004Parser(),
    },
    {
      name: 'DeepSignDB',
      parser: new DeepSignParser(),
    },
  ]

  @consume({ context: signersContext, subscribe: true })
  private signersContextData!: SignersContextData

  private get selectedSigner(): Signer | null {
    if (this.signersContextData.selectedSignerIndex === null) return null
    return this.signersContextData.signers[
      this.signersContextData.selectedSignerIndex
    ]
  }

  @query('#signature-input-dialog')
  private inputDialog!: MdDialog

  @query('#signature-import-dialog')
  private importDialog!: MdDialog

  @query('signature-field')
  private signatureField!: SignatureField

  @query('#signatures-file')
  private signaturesFileInput!: HTMLInputElement | null

  @query('#parser-selector')
  private parserSelector!: HTMLSelectElement | null

  @state()
  private error: any = undefined

  @state()
  private selectedParser: (typeof this.parsers)[number] | null = null

  render() {
    return html` <div class="buttons">
        <md-filled-button
          .disabled="${this.selectedSigner === null}"
          @click="${() => {
            this.inputDialog.show()
          }}"
        >
          Draw
          <svg slot="icon" height="24px" viewBox="0 -960 960 960" width="24px">
            <path
              d="m499-287 335-335-52-52-335 335 52 52Zm-261 87q-100-5-149-42T40-349q0-65 53.5-105.5T242-503q39-3 58.5-12.5T320-542q0-26-29.5-39T193-600l7-80q103 8 151.5 41.5T400-542q0 53-38.5 83T248-423q-64 5-96 23.5T120-349q0 35 28 50.5t94 18.5l-4 80Zm280 7L353-358l382-382q20-20 47.5-20t47.5 20l70 70q20 20 20 47.5T900-575L518-193Zm-159 33q-17 4-30-9t-9-30l33-159 165 165-159 33Z"
            />
          </svg>
        </md-filled-button>

        <md-filled-button
          .disabled="${this.selectedSigner === null}"
          @click="${() => {
            this.importDialog.show()
          }}"
        >
          Import
          <svg slot="icon" height="24px" viewBox="0 -960 960 960" width="24px">
            <path
              d="M440-200h80v-167l64 64 56-57-160-160-160 160 57 56 63-63v167ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"
            />
          </svg>
        </md-filled-button>
      </div>

      <md-dialog id="signature-input-dialog">
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
          <md-outlined-button
            @click="${() => {
              this.signatureField.clear()
            }}"
          >
            Clear input
          </md-outlined-button>
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
          <md-text-button form="signature-input-dialog-form">
            Close
          </md-text-button>
        </div>
      </md-dialog>

      <md-dialog id="signature-import-dialog">
        <div slot="headline">Signature Import</div>
        <form slot="content" id="signature-import-dialog-form" method="dialog">
          <label for="parser-selector">
            Specify the format of the file(s) to import:
          </label>
          <md-outlined-select
            id="parser-selector"
            @change="${(e: Event) => {
              const target = e.target as unknown as MdOutlinedSelect
              this.selectedParser = this.parsers[target.selectedIndex]
            }}"
          >
            ${this.parsers.map(
              (p, index) =>
                html` <md-select-option value="${index}"
                  >${p.name}
                </md-select-option>`
            )}
          </md-outlined-select>

          <label for="signatures-file">
            Select one or more files to import:
          </label>
          <input type="file" id="signatures-file" name="signatures" multiple />

          ${this.selectedParser?.name === 'DeepSignDB'
            ? html`
              <label for="signer"> Select the signers to import: </label>
              <input type="email" list="signers" name="signer" multiple>
              <datalist id="signers">
                <option value="1001">
                <option value="1002">
                <option value="1009">
              </datalist>
            `
            : nothing}
          ${this.error === undefined
            ? nothing
            : html` <div class="error-conatiner">
                <div class="error-details">${this.error}</div>
              </div>`}
        </form>
        <div slot="actions">
          <md-filled-button @click="${this.handleImportButtonClick}">
            Import from file
          </md-filled-button>
          <md-text-button
            form="signature-import-dialog-form"
            @click="${() => {
              if (this.signaturesFileInput === null) return

              this.signaturesFileInput.value = ''
              this.error = undefined
            }}"
          >
            Close
          </md-text-button>
        </div>
      </md-dialog>`
  }

  private async handleImportButtonClick() {
    if (this.signaturesFileInput === null || this.parserSelector === null)
      return

    const files = this.signaturesFileInput.files
    if (files === null) return

    this.error = undefined

    try {
      const signatures: Signature[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files.item(i)
        if (file === null) continue
        const signature = (await this.selectedParser?.parser.parse(file)) ?? []
        signatures.push(...signature)
      }
      this.signaturesFileInput.value = ''
      this.dispatchEvent(new PushSignaturesEvent(signatures))
    } catch (error) {
      this.error = error
    }
  }
}
