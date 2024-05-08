import { LitElement, css, html, nothing } from 'lit'
import { customElement } from 'lit/decorators.js'
import {
  HideAllSignaturesEvent,
  RemoveAllSignaturesEvent,
  RemoveSignatureEvent,
  SetSignatureColorEvent,
  SetSignatureVisibilityEvent,
  ShowAllSignaturesEvent,
  SignatureData,
  signaturesContext,
} from '../contexts/signatures.context'
import { consume } from '@lit/context'

@customElement('signature-list-element')
export class SignatureListElement extends LitElement {
  static styles = css`
    :host {
      --md-list-item-top-space: 0;
      --md-list-item-bottom-space: 0;

      height: 100%;
      overflow: auto;
    }

    div[slot='start'],
    div[slot='end'] {
      display: contents;
    }

    label.color-input-label {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .color-input-wrapper {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      box-sizing: border-box;
      border: 1px solid var(--md-sys-color-on-secondary-container);
      position: relative;
    }

    .color-input-wrapper div {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .color-input-wrapper input[type='color'] {
      min-width: 200%;
      min-height: 200%;
      border: none;
      background: none;
    }
  `

  @consume({ context: signaturesContext, subscribe: true })
  private signatures!: SignatureData[]

  render() {
    return html`<md-list>
      <md-list-item>
        <signature-loader-element></signature-loader-element>
        <div slot="start">
          <md-checkbox
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
        </div>
        <div slot="end">
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

  private getItemTemplate = (s: SignatureData, index: number) =>
    html`<md-list-item>
        <span>${new Date(s.signature.creationTimeStamp).toLocaleString()}</span>
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
          <md-filled-tonal-button
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
          </md-filled-tonal-button>
        </div>
      </md-list-item>
      <md-divider></md-divider>`
}
