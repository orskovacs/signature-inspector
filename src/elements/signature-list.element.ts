import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('signature-list-element')
export class SignatureListElement extends LitElement {
  private static itemTemplate = html`<md-list-item>
      <span>${new Date(Date.now()).toLocaleString()}</span>
      <div slot="start">
        <md-checkbox touch-target="wrapper" checked></md-checkbox>
      </div>
      <div slot="end">
        <input type="color" value="#f6b73c" />
        <md-filled-tonal-button>
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

  @property({ type: Array, reflect: true })
  public visibleSignatureIndexes: number[] = []

  @property({ type: Array })
  public signatures: any[] = [undefined, undefined, undefined]

  render() {
    return html`<md-list>
      <md-list-item>
        <div slot="start">
          <md-checkbox
            touch-target="wrapper"
            ?checked=${this.signatures.length ===
            this.visibleSignatureIndexes.length}
          ></md-checkbox>
        </div>
      </md-list-item>
      ${this.signatures.map(() => {
        return SignatureListElement.itemTemplate
      })}
    </md-list>`
  }
}
