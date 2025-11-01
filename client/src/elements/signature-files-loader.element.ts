import { css, html, LitElement, nothing } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { SignaturesFileParser } from '../parsers/signatures-file-parser.ts'
import { Svc2004Parser } from '../parsers/svc-2004-parser.ts'
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

interface LoaderOption {
  name: string
  parser: SignatureParser
}

@customElement('signature-files-loader-element')
export class SignatureFilesLoaderElement extends LitElement {
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

  private readonly loaders: ReadonlyArray<LoaderOption> = [
    {
      name: 'SVC 2004 file',
      parser: new Svc2004Parser(),
    },
    {
      name: 'Signatures file',
      parser: new SignaturesFileParser(),
    },
  ]

  @consume({ context: signersContext, subscribe: true })
  private signersContextData!: SignersContextData

  @state()
  private selectedLoader: LoaderOption = this.loaders[0]

  @state()
  private files: FileList | null = null

  @state()
  private error: any = undefined

  @query('#dialog')
  private dialog!: MdDialog

  @query('#loader-file-input')
  private fileInput!: HTMLInputElement | null

  @query('#loader-selector')
  private loaderSelector!: MdOutlinedSelect | null

  render() {
    return html` <md-filled-button
        @click="${() => {
          this.dialog.show().then()
        }}"
      >
        Load
        <upload-file-icon slot="icon"></upload-file-icon>
      </md-filled-button>

      <md-dialog id="dialog" @closed="${this.onDialogClosed}">
        <div slot="headline">Load from Files</div>

        <form slot="content" id="signature-loader-dialog-form" method="dialog">
          <label for="loader-selector"> Signature file format: </label>
          <md-outlined-select
            id="loader-selector"
            @change="${(e: Event) => {
              const target = e.target as unknown as MdOutlinedSelect
              this.selectedLoader = this.loaders[target.selectedIndex]
            }}"
          >
            ${this.loaders.map(
              (p, index) =>
                html` <md-select-option
                  .selected="${index === 0}"
                  value="${index}"
                >
                  ${p.name}
                </md-select-option>`
            )}
          </md-outlined-select>

          <label for="loader-file-input"> Signature file(s): </label>
          <input
            type="file"
            id="loader-file-input"
            name="loader-file-input"
            multiple
            @change="${(e: Event) => {
              const target = e.target as unknown as HTMLInputElement
              this.files = target.files
            }}"
          />

          ${this.error === undefined
            ? nothing
            : html` <div class="error-container">
                <div class="error-details">${this.error}</div>
              </div>`}
        </form>

        <div slot="actions">
          <md-filled-button
            .disabled="${this.selectedLoader === null || this.files === null}"
            @click="${this.handleLoadButtonClick}"
            form="signature-loader-dialog-form"
          >
            Load from file(s)
          </md-filled-button>
          <md-text-button form="signature-loader-dialog-form">
            Close
          </md-text-button>
        </div>
      </md-dialog>`
  }

  private async handleLoadButtonClick() {
    if (
      this.fileInput === null ||
      this.loaderSelector === null ||
      this.files === null
    )
      return

    this.error = undefined

    try {
      const signers: Signer[] = []
      const files = this.files
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i)
        if (file === null) continue
        const { newSigners } = (await this.selectedLoader?.parser.parse(file, [
          ...this.signersContextData.signers,
          ...signers,
        ]))!
        signers.push(...newSigners)
      }

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

  private onDialogClosed() {
    this.fileInput!.value = ''
    this.files = null
    this.error = undefined
  }
}
