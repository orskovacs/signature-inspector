import { LitElement, css, html, nothing } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import {
  HideAllSignaturesEvent,
  RemoveAllSignaturesEvent,
  RemoveSignatureEvent,
  ResetTrainSignaturesEvent,
  SelectAllSignaturesEvent,
  SetSignatureColorEvent,
  SetSignatureVerificationStatusEvent,
  SetSignatureSelectionEvent,
  SetSignaturesForTrainingByIndexEvent,
  SetSignatureVisibilityEvent,
  ShowAllSignaturesEvent,
  signaturesContext,
  UnselectAllSignaturesEvent,
} from '../contexts/signatures.context'
import { consume } from '@lit/context'
import { EbDbaLsDtwVerifier } from '../verifier/eb-dba-ls-dtw-verifier.ts'
import { Signature } from '../model/signature.ts'
import { ColorChangeEvent } from './color-input.element.ts'
import {
  signersContext,
  SignersContextData,
} from '../contexts/signers.context.ts'
import { Signer } from '../model/signer.ts'
import { SignatureVerifier } from '../verifier/signature-verifier.ts'
import { MdOutlinedSelect } from '@material/web/all'
import { DtwVerifier } from '../verifier/dtw-verifier.ts'

@customElement('signature-list-element')
export class SignatureListElement extends LitElement {
  static styles = css`
    :host {
      --md-outlined-field-leading-space: 16px;

      overflow: clip;
    }

    .col-verification {
      --md-filled-tonal-icon-button-icon-size: 20px;
      --md-filled-tonal-icon-button-container-height: 30px;
      --md-filled-tonal-icon-button-container-width: 30px;
    }

    .suggestion {
      font-style: oblique;
      position: absolute;
      width: 100%;
      text-align: center;
      margin-block: 20px;
    }

    .suggestion .signer-name {
      font-weight: bold;
      text-decoration: underline;
    }

    .table-wrapper {
      height: calc(100% + 8px);
      overflow: scroll;
    }

    table {
      position: relative;
      width: 100%;
      border-spacing: 0;
      text-align: center;
    }

    td,
    th {
      border: 1px solid var(--md-sys-color-outline-variant);
    }

    th {
      position: sticky;
      top: 0;
      background: var(--md-sys-color-surface);
      z-index: 10;
      font-variant: all-petite-caps;
      font-size: 0.9rem;
      border-bottom: 4px solid var(--md-sys-color-outline-variant);
    }

    thead tr:first-of-type th {
      border-top: none;
    }

    tbody tr:last-of-type td {
      border-bottom: none;
    }

    th:first-of-type,
    td:first-of-type {
      border-left: none;
    }

    th:last-of-type,
    td:last-of-type {
      border-right: none;
    }

    td,
    th {
      padding-inline: 20px;
    }

    th.col-verification,
    th.col-actions {
      padding-inline: 8px;
    }

    .col-visibility,
    .col-training {
      padding-inline: 6px;
    }

    .col-visibility,
    .col-training,
    .col-color {
      width: 60px;
    }

    .col-name,
    .col-signer,
    .col-origin {
      width: auto;
    }

    .col-name {
      max-width: 150px;
      text-overflow: ellipsis;
      overflow-x: clip;
    }

    .col-length,
    .col-authenticity,
    .col-verification,
    .col-actions {
      width: 1px;
    }

    td.col-color {
      padding: 0;
    }

    th.col-verification,
    th.col-actions {
      font-variant: initial;
    }

    th > label {
      margin-bottom: 4px;
      display: block;
      font-size: 0.7rem;
      text-wrap-mode: nowrap;
    }

    th > label + md-checkbox {
      margin-bottom: 6px;
    }

    th.col-verification {
      text-align: left;
      padding-block: 8px;
    }

    th.col-verification > div {
      display: flex;
      gap: 4px;
      align-items: center;
    }
  `

  private readonly verifiers = ['EB-DBA LS-DTW', 'DTW'] as const

  @consume({ context: signersContext, subscribe: true })
  private signersContext!: SignersContextData

  @consume({ context: signaturesContext, subscribe: true })
  private signatures!: Signature[]

  @state()
  private selectedVerifier: (typeof this.verifiers)[number] = this.verifiers[0]

  private get selectedSigner(): Signer | null {
    const selectedSignerIndex = this.signersContext.selectedSignerIndex
    if (selectedSignerIndex === null) return null

    return this.signersContext.signers[selectedSignerIndex]
  }

  private get signaturesForTrainingCount(): number {
    return this.signaturesForTraining.length
  }

  private get signaturesForTraining(): Signature[] {
    return this.signatures.filter((s) => s.forTraining)
  }

  render() {
    return html`<div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th class="col-visibility">
              <label for="toggle-all-visibility-checkbox">Visible</label>
              <md-checkbox
                id="toggle-all-visibility-checkbox"
                ?disabled=${this.signatures.length === 0}
                ?checked=${this.signatures.length > 0 &&
                this.signatures.every((s) => s.visible)}
                ?indeterminate=${!this.signatures.every((s) => s.visible) &&
                this.signatures.some((s) => s.visible)}
                @click=${() => {
                  if (this.signatures.every((s) => s.visible))
                    this.dispatchEvent(new HideAllSignaturesEvent())
                  else this.dispatchEvent(new ShowAllSignaturesEvent())
                }}
              ></md-checkbox>
            </th>
            <th class="col-color">Colour</th>
            <th class="col-name">Name</th>
            <th class="col-signer">Signer</th>
            <th class="col-origin">Origin</th>
            <th class="col-length">Data points</th>
            <th class="col-authenticity">Authenticity</th>
            <th class="col-training">
              <label for="toggle-selection-checkbox">Train on</label>
              <md-checkbox
                id="toggle-all-selection-checkbox"
                ?disabled=${this.signatures.length === 0}
                ?checked=${this.signatures.length > 0 &&
                this.signatures.every((s) => s.forTraining)}
                ?indeterminate=${!this.signatures.every((s) => s.forTraining) &&
                this.signatures.some((s) => s.forTraining)}
                @click=${() => {
                  if (this.signatures.every((s) => s.forTraining))
                    this.dispatchEvent(new UnselectAllSignaturesEvent())
                  else this.dispatchEvent(new SelectAllSignaturesEvent())
                }}
              ></md-checkbox>
            </th>
            <th class="col-verification">
              <div>
                <md-outlined-select
                  id="verifier-selector"
                  label="Verifier"
                  @change="${(e: Event) => {
                    const target = e.target as unknown as MdOutlinedSelect
                    this.selectedVerifier = this.verifiers[target.selectedIndex]
                  }}"
                >
                  ${this.verifiers.map(
                    (v, i) =>
                      html`<md-select-option
                        value="${i}"
                        display-text="${v}"
                        ?selected="${i === 0}"
                      >
                        <div slot="headline">${v}</div>
                      </md-select-option>`
                  )}
                </md-outlined-select>
                <md-filled-tonal-icon-button
                  ?disabled=${this.signaturesForTrainingCount === 0}
                  @click=${this.onVerifyClick}
                >
                  <md-icon>verified</md-icon>
                </md-filled-tonal-icon-button>
              </div>
            </th>
            <th class="col-actions">
              <md-filled-tonal-button
                ?disabled=${this.signatures.length === 0}
                @click=${() => {
                  this.dispatchEvent(new RemoveAllSignaturesEvent())
                }}
              >
                Delete All
                <delete-icon slot="icon"></delete-icon>
              </md-filled-tonal-button>
            </th>
          </tr>
        </thead>

        <tbody>
          ${this.signatures.length === 0
            ? html` <div class="suggestion">
                <span class="signer-name">
                  ${this.selectedSigner?.name ?? 'Unknown signer'}
                </span>
                has no signatures.<br />
                Draw or import some signatures using the buttons above!
              </div>`
            : nothing}
          ${this.signatures.map(
            (s, i) => html`
              <tr>
                <td class="col-visibility">
                  <md-checkbox
                    ?checked=${s.visible}
                    @click=${() => {
                      this.dispatchEvent(
                        new SetSignatureVisibilityEvent(i, !s.visible)
                      )
                    }}
                  ></md-checkbox>
                </td>

                <td class="col-color">
                  <color-input-element
                    .id="color-input-${i}"
                    .value="#${s.colorHex}"
                    @change="${(e: ColorChangeEvent) => {
                      this.dispatchEvent(
                        new SetSignatureColorEvent(i, e.detail)
                      )
                    }}"
                  ></color-input-element>
                </td>

                <td class="col-name" title="${s.name}">${s.name}</td>

                <td class="col-signer">
                  ${s.signer?.name ?? 'Unknown Signer'}
                </td>

                <td class="col-origin">${s.origin ?? 'Unknown'}</td>

                <td class="col-length">${s.dataPoints.length}</td>

                <td class="col-authenticity">
                  ${(() => {
                    switch (s.authenticity) {
                      case 'unknown':
                        return html`<span class="authenticity-unknown">
                          Unknown
                        </span>`
                      case 'genuine':
                        return html`<span class="authenticity-genuine">
                          Genuine
                        </span>`
                      case 'forged':
                        return html`<span class="authenticity-forged">
                          Forged
                        </span>`
                    }
                  })()}
                </td>

                <td class="col-training">
                  <md-checkbox
                    ?checked=${s.forTraining}
                    @click=${() => {
                      this.dispatchEvent(
                        new SetSignatureSelectionEvent(i, !s.forTraining)
                      )
                    }}
                  ></md-checkbox>
                </td>

                <td class="col-verification">
                  ${(() => {
                    switch (s.verificationStatus) {
                      case 'training':
                        return html`<span class="verification-training">
                          Trained&nbsp;on
                        </span>`
                      case 'genuine':
                        return html`<span class="verification-genuine">
                          Genuine
                        </span>`
                      case 'forged':
                        return html`<span class="verification-forged">
                          Forged
                        </span>`
                      case 'unverified':
                        return html`<span class="verification-unverified">
                          Unverified
                        </span>`
                    }
                  })()}
                </td>

                <td class="col-actions">
                  <md-text-button
                    @click=${() => {
                      this.dispatchEvent(new RemoveSignatureEvent(i))
                    }}
                  >
                    Delete
                    <delete-icon slot="icon"></delete-icon>
                  </md-text-button>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
    </div>`
  }

  private onVerifyClick() {
    this.dispatchEvent(new ResetTrainSignaturesEvent())

    const verifier: SignatureVerifier = (() => {
      switch (this.selectedVerifier) {
        case 'EB-DBA LS-DTW':
          return new EbDbaLsDtwVerifier()
        case 'DTW':
          return new DtwVerifier()
        default:
          throw new Error('Unknown verifier')
      }
    })()

    try {
      verifier.trainUsingSignatures(this.signaturesForTraining).then(() => {
        const selectedSignaturesIndexes: number[] = []
        this.signatures.forEach((s, i) => {
          if (s.forTraining) {
            selectedSignaturesIndexes.push(i)
          }
        })

        this.dispatchEvent(
          new SetSignaturesForTrainingByIndexEvent(selectedSignaturesIndexes)
        )

        this.signatures.forEach((s, i) => {
          if (!s.forTraining) {
            verifier.testSignature(s).then((isGenuine) => {
              this.dispatchEvent(
                new SetSignatureVerificationStatusEvent(
                  i,
                  isGenuine ? 'genuine' : 'forged'
                )
              )
            })
          }
        })

        this.dispatchEvent(new UnselectAllSignaturesEvent())
      })
    } finally {
      verifier.dispose()
    }
  }
}
