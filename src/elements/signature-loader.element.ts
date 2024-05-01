import { LitElement, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { MdDialog } from '@material/web/dialog/dialog.ts'
import { SignatureField } from 'signature-field'

@customElement('signature-loader-element')
export class SignatureLoaderElement extends LitElement {
  @query('#signature-input-dialog')
  private inputDialog!: MdDialog

  @query('#signature-import-dialog')
  private importDialog!: MdDialog

  @query('signature-field')
  private signatureField!: SignatureField

  render() {
    return html`<md-filled-button
        @click="${() => {
          this.inputDialog.show()
        }}"
      >
        Draw
      </md-filled-button>

      <md-filled-button
        @click="${() => {
          this.importDialog.show()
        }}"
      >
        Import
      </md-filled-button>

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
          <input
            type="file"
            id="signatures-file"
            name="signatures"
            accept="text/json"
          />
        </form>
        <div slot="actions">
          <md-text-button form="signature-import-dialog-form">
            Close
          </md-text-button>
        </div>
      </md-dialog>`
  }
}
