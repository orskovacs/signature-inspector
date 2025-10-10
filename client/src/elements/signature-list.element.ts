import { LitElement, css, html, nothing } from 'lit'
import { customElement } from 'lit/decorators.js'
import {
  HideAllSignaturesEvent,
  RemoveAllSignaturesEvent,
  RemoveSignatureEvent,
  ResetTrainSignaturesEvent,
  SetSignatureColorEvent,
  SetSignatureGenuinenessEvent,
  SetSignaturesForTrainingByIndexEvent,
  SetSignatureVisibilityEvent,
  ShowAllSignaturesEvent,
  signaturesContext,
} from '../contexts/signatures.context'
import { consume } from '@lit/context'
import { EbDbaLsDtwVerifier } from '../verifier/eb-dba-ls-dtw-verifier.ts'
import { Signature } from '../model/signature.ts'

@customElement('signature-list-element')
export class SignatureListElement extends LitElement {
  static styles = css`
    :host {
      --md-list-item-top-space: 0;
      --md-list-item-bottom-space: 0;
      --md-list-item-one-line-container-height: 0;

      display: grid;
      align-content: flex-start;
    }

    div[slot='start'],
    div[slot='end'] {
      display: contents;
    }

    label.color-input-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .color-input-wrapper {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      box-sizing: border-box;
      border: 1px solid var(--md-sys-color-on-secondary-container);
      position: relative;
      cursor: pointer;
    }

    .color-input-wrapper div {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .color-input-wrapper input[type='color'] {
      min-width: 200%;
      min-height: 200%;
      border: none;
      background: none;
      cursor: pointer;
    }

    md-list {
      overflow: scroll;
    }

    md-list::after {
      content: ' ';
      min-height: 40px;
      position: sticky;
      bottom: -8px;
      background: -webkit-linear-gradient(
        bottom,
        var(--md-sys-color-surface, #fef7ff),
        transparent 40px
      );
      background: linear-gradient(
        0,
        var(--md-sys-color-surface, #fef7ff),
        transparent 40px
      );
    }
  `

  @consume({ context: signaturesContext, subscribe: true })
  private signatures!: Signature[]

  private get signaturesCount(): number {
    return this.signatures.length
  }

  private get visibleSignaturesCount(): number {
    return this.visibleSignatures.length
  }

  private get selectedSignaturesCount(): number {
    return this.selectedSignatures.length
  }

  private get visibleSignatures(): Signature[] {
    return this.signatures.filter((s) => s.visible)
  }

  private get selectedSignatures(): Signature[] {
    return this.signatures.filter((s) => s.selected)
  }

  render() {
    return html` <md-list-item>
        <div slot="start">
          <md-checkbox
            id="toggle-all-checkbox"
            touch-target="wrapper"
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
          <label>
            ${this.visibleSignaturesCount} / ${this.signaturesCount} signatures
            visible
          </label>
        </div>
        <div slot="end">
          <md-filled-tonal-button
            ?disabled=${this.selectedSignaturesCount === 0}
            @click=${() => {
              this.dispatchEvent(new ResetTrainSignaturesEvent())
              const verifier = new EbDbaLsDtwVerifier()
              verifier
                .trainUsingSignatures(this.selectedSignatures)
                .then(() => {
                  const selectedSignaturesIndexes: number[] = []
                  this.signatures.forEach((s, i) => {
                    if (s.visible) {
                      selectedSignaturesIndexes.push(i)
                    }
                  })

                  this.dispatchEvent(
                    new SetSignaturesForTrainingByIndexEvent(
                      selectedSignaturesIndexes
                    )
                  )

                  this.signatures.forEach((s, i) => {
                    if (!s.visible) {
                      verifier.testSignature(s).then((isGenuine) => {
                        this.dispatchEvent(
                          new SetSignatureGenuinenessEvent(i, isGenuine)
                        )
                      })
                    }
                  })
                })
            }}
          >
            Train
            <svg slot="icon" height="24" viewBox="0 -960 960 960" width="24">
              <path
                d="M206-206q-41-48-63.5-107.5T120-440q0-150 105-255t255-105h8l-64-64 56-56 160 160-160 160-57-57 63-63h-6q-116 0-198 82t-82 198q0 51 16.5 96t46.5 81l-57 57Zm234-14q0-23-15.5-45.5t-34.5-47q-19-24.5-34.5-51T340-420q0-58 41-99t99-41q58 0 99 41t41 99q0 30-15.5 56.5t-34.5 51q-19 24.5-34.5 47T520-220h-80Zm0 100v-60h80v60h-80Zm314-86-57-57q30-36 46.5-81t16.5-96q0-66-27.5-122.5T657-657l57-57q58 50 92 120.5T840-440q0 67-22.5 126.5T754-206Z"
              />
            </svg>
          </md-filled-tonal-button>
          <md-filled-tonal-button
            ?disabled=${this.signatures.length === 0}
            @click=${() => {
              this.dispatchEvent(new RemoveAllSignaturesEvent())
            }}
          >
            Delete All
            <svg slot="icon" height="24" viewBox="0 -960 960 960" width="24">
              <path
                d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
              />
            </svg>
          </md-filled-tonal-button>
        </div>
      </md-list-item>
      <md-divider></md-divider>
      <md-list>
        ${this.signatures.length === 0
          ? html`<md-list-item>
              <div style="font-style: oblique;">
                Draw or import some signatures using the buttons above!
              </div>
            </md-list-item>`
          : nothing}
        ${this.signatures.map((s, i) => {
          return this.getItemTemplate(s, i)
        })}
      </md-list>`
  }

  private getItemTemplate = (s: Signature, index: number) =>
    html` <md-list-item>
      <span>[${s.signer?.name ?? 'Unknown Signer'}]: ${s.name}</span>
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
        <md-chip-set aria-label="Training results">
          ${s.status === 'train'
            ? html` <md-assist-chip
                class="train"
                label="Used for training"
              ></md-assist-chip>`
            : nothing}
          ${s.status === 'genuine'
            ? html` <md-assist-chip
                class="genuine"
                label="Genuine"
              ></md-assist-chip>`
            : nothing}
          ${s.status === 'forgery'
            ? html` <md-assist-chip
                class="forgery"
                label="Forgery"
              ></md-assist-chip>`
            : nothing}
        </md-chip-set>
        <label
          class="color-input-label"
          .id="hex-${index}"
          .for="color-input-${index}"
        >
          <span class="label">Signature colour</span>
          <span class="color-input-wrapper">
            <div>
              <input
                type="color"
                .id="color-input-${index}"
                .value="#${s.colorHex}"
                @input=${(e: Event) => {
                  if (!(e.target instanceof HTMLInputElement)) return

                  const newColor = e.target.value.slice(1)
                  this.dispatchEvent(
                    new SetSignatureColorEvent(index, newColor)
                  )
                }}
              />
            </div>
          </span>
        </label>
        <md-text-button
          @click=${() => {
            this.dispatchEvent(new RemoveSignatureEvent(index))
          }}
        >
          Delete
          <svg slot="icon" height="24" viewBox="0 -960 960 960" width="24">
            <path
              d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
            />
          </svg>
        </md-text-button>
      </div>
    </md-list-item>`
}
