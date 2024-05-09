import { LitElement, css, html, nothing } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { MdDialog } from '@material/web/dialog/dialog.ts'
import { Signature, SignatureField } from 'signature-field'
import {
  PushSignatureEvent,
  PushSignaturesEvent,
} from '../contexts/signatures.context'
import { SignatureParser } from '../parsers/signature-parser'
import { SignaturesFileParser } from '../parsers/signatures-file-parser'
import { Svc2004Parser } from '../parsers/svc-2004-parser'

@customElement('signature-loader-element')
export class SignatureLoaderElement extends LitElement {
  static styles = css`
    :host {
      --md-dialog-container-color: var(--md-sys-color-surface);
    }
    .buttons {
      display: flex;
      gap: 8px;
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
  ]

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

  render() {
    return html`<div class="buttons">
        <md-filled-button
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
              this.dispatchEvent(
                new PushSignatureEvent(new Signature(dataPoints))
              )
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
          <label for="signatures-file">
            Select a file that contains signatures:
          </label>
          <input type="file" id="signatures-file" name="signatures" multiple />
          <select id="parser-selector">
            ${this.parsers.map(
              (p, index) => html`<option value="${index}">${p.name}</option>`
            )}
          </select>
          ${this.error === undefined
            ? nothing
            : html`<div class="error-conatiner">
                <div class="error-details">${this.error}</div>
              </div>`}
        </form>
        <div slot="actions">
          <md-filled-button
            @click="${async () => {
              if (
                this.signaturesFileInput === null ||
                this.parserSelector === null
              )
                return

              const files = this.signaturesFileInput.files
              if (files === null) return

              this.error = undefined

              try {
                const signatures: Signature[] = []
                for (let i = 0; i < files.length; i++) {
                  const parser =
                    this.parsers[Number.parseInt(this.parserSelector.value)]
                      .parser
                  const signature = await parser.parse(files.item(i)!)
                  signatures.push(...signature)
                }
                this.signaturesFileInput.value = ''
                this.dispatchEvent(new PushSignaturesEvent(signatures))
              } catch (error) {
                this.error = error
              }
            }}"
          >
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
}
