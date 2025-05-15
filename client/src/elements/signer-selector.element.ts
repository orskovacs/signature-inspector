import { customElement, query } from 'lit/decorators.js'
import { css, html, LitElement } from 'lit'
import { consume } from '@lit/context'
import {
  PushSignersEvent, SelectSignerEvent,
  signersContext,
  SignersContextData,
} from '../contexts/signers.context.ts'
import { Signer } from '../model/signer.ts'
import { MdOutlinedSelect } from '@material/web/all'

@customElement('signer-selector-element')
export class SignerSelectorElement extends LitElement {
  static styles = css`
    :host {
      --md-sys-color-surface-container: var(--md-sys-color-surface-variant);
      
      display: flex;
      align-items: center;
      flex-direction: row;
      gap: 8px;
    }
  `

  @consume({ context: signersContext, subscribe: true })
  private signersContextData!: SignersContextData

  private get signers(): Signer[] {
    return this.signersContextData.signers
  }

  @query('#signer-selector')
  private signerSelector!: MdOutlinedSelect | null

  render() {
    return html`
      <md-outlined-select id="signer-selector" label="Signer" @change="${() =>
        this.signerSelector?.value
          ? this.dispatchEvent(new SelectSignerEvent(Number.parseInt(this.signerSelector.value)))
          : null}">
        
        ${this.signers.map(
          (s, i) => html`
            <md-select-option value="${i}">${s.id}</md-select-option>
          `
        )}
      </md-outlined-select>
      <md-outlined-button
        @click="${async () => {
          this.dispatchEvent(
            new PushSignersEvent([new Signer(Date.now().toString())])
          )
        }}"
      >
        New Signer
        <svg
          slot="icon"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#1f1f1f"
        >
          <path
            d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z"
          />
        </svg>
      </md-outlined-button>
    `
  }
}
