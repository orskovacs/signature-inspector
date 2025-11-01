import { customElement, query, state } from 'lit/decorators.js'
import { css, html, LitElement, nothing } from 'lit'
import { DeepSignZipParser } from '../parsers/deep-sign-zip-parser.ts'
import { SignatureParser } from '../parsers/signature-parser.ts'
import { MdOutlinedSelect } from '@material/web/all'
import { Signer } from '../model/signer.ts'
import {
  PushSignersEvent,
  signersContext,
  SignersContextData,
} from '../contexts/signers.context.ts'
import { consume } from '@lit/context'
import { MdDialog } from '@material/web/dialog/dialog'
import { Svc2004ZipParser } from '../parsers/svc-2004-zip-parser.ts'

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

  private readonly importers = ['SVC 2004', 'DeepSignDB'] as const

  @consume({ context: signersContext, subscribe: true })
  private signersContextData!: SignersContextData

  @state()
  private selectedImporter: (typeof this.importers)[number] = this.importers[0]

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

      <md-dialog id="dialog" @closed="${this.onDialogClosed}">
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
                  >${p}
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
            type="text"
            list="signers"
            id="signer-input"
            name="signer-input"
            multiple
          />
          <datalist id="signers">${this.signerIdOptions}</datalist>

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
            form="signature-import-dialog-form"
          >
            Import
          </md-filled-button>
          <md-text-button form="signature-import-dialog-form">
            Close
          </md-text-button>
        </div>
      </md-dialog>`
  }

  private get signerIdOptions() {
    let ids: string[] = []
    switch (this.selectedImporter) {
      case 'SVC 2004':
        ids = Array.from({ length: 40 }, (_, i) =>
          String(i + 1).padStart(2, '0')
        )
        break
      case 'DeepSignDB':
        {
          const range1009to1084 = Array.from(
            { length: 1084 - 1009 + 1 },
            (_, i) => String(1009 + i)
          )
          const range0001to0121 = Array.from({ length: 121 }, (_, i) =>
            String(i + 1).padStart(4, '0')
          )
          ids = [...range1009to1084, ...range0001to0121]
        }
        break
    }

    return html`${ids.map((id) => html`<option value="${id}"></option>`)}`
  }

  private async handleImportButtonClick() {
    if (
      this.fileInput === null ||
      this.importerSelector === null ||
      this.file === null
    )
      return

    this.error = undefined

    const parser: SignatureParser = (() => {
      switch (this.selectedImporter) {
        case 'SVC 2004':
          return new Svc2004ZipParser()
        case 'DeepSignDB':
          return new DeepSignZipParser()
        default:
          throw new Error('Unknown parser')
      }
    })()

    try {
      const signers: Signer[] = []

      const { signers: newSigners } = (await parser.parse(
        this.file,
        [...this.signersContextData.signers, ...signers],
        this.signerInput?.value === ''
          ? []
          : (this.signerInput?.value?.split(',').map((id) => id.trim()) ?? [])
      ))!
      signers.push(...newSigners)

      this.dispatchEvent(new PushSignersEvent(signers))
    } catch (error) {
      this.error = error
    } finally {
      parser.dispose()
    }
  }

  private onDialogClosed() {
    this.fileInput!.value = ''
    this.file = null
    this.signerInput!.value = ''
    this.error = undefined
  }
}
