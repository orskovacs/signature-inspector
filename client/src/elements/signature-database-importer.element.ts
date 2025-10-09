import { customElement, query, state } from 'lit/decorators.js'
import { css, html, LitElement, nothing } from 'lit'
import { DeepSignParser } from '../parsers/deep-sign-parser.ts'
import { SignatureParser } from '../parsers/signature-parser.ts'
import { MdOutlinedSelect } from '@material/web/all'
import { Signer } from '../model/signer.ts'
import {
  PushSignersEvent,
  SelectSignerEvent,
  signersContext,
  SignersContextData,
} from '../contexts/signers.context.ts'
import { consume } from '@lit/context'
import { MdDialog } from '@material/web/dialog/dialog'

interface ImporterOption {
  name: string
  parser: SignatureParser
}

@customElement('signature-database-importer-element')
export class SignatureDatabaseImporter extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .error-container {
      grid-column: 1 / 3;
      background-color: var(--md-sys-color-error);
      color: var(--md-sys-color-on-error);
      border-radius: 28px;
      padding-inline: 24px;
      padding-block: 18px;
    }

    label {
      text-align: end;
    }

    form {
      display: grid;
      grid-template-columns: auto auto;
      grid-gap: 12px;
      align-items: center;
    }
  `

  private readonly importers: ReadonlyArray<ImporterOption> = [
    {
      name: 'DeepSignDB',
      parser: new DeepSignParser(),
    },
  ]

  @consume({ context: signersContext, subscribe: true })
  private signersContextData!: SignersContextData

  @state()
  private selectedImporter: ImporterOption = this.importers[0]

  @state()
  private error: any = undefined

  @state()
  private file: File | null = null

  @query('#dialog')
  private dialog!: MdDialog

  @query('#importer-file-input')
  private fileInput!: HTMLInputElement | null

  @query('#signer-input')
  private signerInput!: HTMLInputElement | null

  @query('#importer-selector')
  private importerSelector!: MdOutlinedSelect | null

  protected render() {
    return html` <md-filled-button
        @click="${() => {
          this.dialog.show().then()
        }}"
      >
        Import
        <folder-zip-icon slot="icon"></folder-zip-icon>
      </md-filled-button>

      <md-dialog id="dialog">
        <div slot="headline">Import from Database</div>

        <form slot="content" id="signature-import-dialog-form" method="dialog">
          <label for="importer-selector"> Select database to import: </label>
          <md-outlined-select
            id="importer-selector"
            @change="${(e: Event) => {
              const target = e.target as unknown as MdOutlinedSelect
              this.selectedImporter = this.importers[target.selectedIndex]
            }}"
          >
            ${this.importers.map(
              (p, index) =>
                html` <md-select-option
                  .selected="${index === 0}"
                  value="${index}"
                  >${p.name}
                </md-select-option>`
            )}
          </md-outlined-select>

          <label for="importer-file-input">Database file:</label>
          <input
            type="file"
            id="importer-file-input"
            name="importer-file-input"
            @change="${(e: Event) => {
              const target = e.target as unknown as HTMLInputElement
              this.file = target.files?.item(0) ?? null
            }}"
          />

          <label for="signer-input"> Select the signers to import: </label>
          <input
            type="email"
            list="signers"
            id="signer-input"
            name="signer-input"
            multiple
          />
          <datalist id="signers">
            <option value="1001"></option>
            <option value="1002"></option>
            <option value="1009"></option>
          </datalist>

          ${this.error === undefined
            ? nothing
            : html` <div class="error-container">
                <div class="error-details">${this.error}</div>
              </div>`}
        </form>

        <div slot="actions">
          <md-filled-button
            .disabled="${this.selectedImporter === null || this.file === null}"
            @click="${this.handleImportButtonClick}"
          >
            Import
          </md-filled-button>
          <md-text-button
            form="signature-import-dialog-form"
            @click="${this.handleCancelButtonClick}"
          >
            Close
          </md-text-button>
        </div>
      </md-dialog>`
  }

  private async handleImportButtonClick() {
    if (
      this.fileInput === null ||
      this.importerSelector === null ||
      this.file === null
    )
      return

    this.error = undefined

    try {
      const signers: Signer[] = []

      const { signers: newSigners } =
        (await this.selectedImporter?.parser.parse(
          this.file,
          [...this.signersContextData.signers, ...signers],
          this.signerInput?.value?.split(',') ?? []
        ))!
      signers.push(...newSigners)

      this.fileInput.value = ''
      this.file = null

      this.dispatchEvent(new PushSignersEvent(signers))
      if (this.signersContextData.selectedSignerIndex !== null) {
        this.dispatchEvent(
          new SelectSignerEvent(this.signersContextData.selectedSignerIndex)
        )
      }
    } catch (error) {
      this.error = error
    }
  }

  private handleCancelButtonClick() {
    this.fileInput!.value = ''
    this.file = null
    this.error = undefined
    this.dialog.close().then()
  }
}
