import { provide } from '@lit/context'
import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import {
  HideAllSignaturesEvent,
  PushSignatureEvent,
  PushSignaturesEvent,
  RemoveAllSignaturesEvent,
  RemoveSignatureEvent,
  SetSignatureColorEvent,
  SetSignatureVisibilityEvent,
  ShowAllSignaturesEvent,
  SignatureData,
  signaturesContext,
} from '../contexts/signatures.context'
import { getRandomColorHex } from '../utils/color.util'

@customElement('app-element')
export class AppElement extends LitElement {
  static styles = css`
    :host {
      height: 100%;
      display: block;
    }

    h1 {
      font-family: var(--md-ref-typeface-brand);
      margin-inline: 16px;
    }

    main {
      height: calc(100% - 90px);
      display: grid;
      align-items: start;
      grid-template-rows: 40% 60%;
    }
  `

  @provide({ context: signaturesContext })
  @state()
  private signatures: SignatureData[] = []

  override connectedCallback() {
    super.connectedCallback()

    this.addEventListener(PushSignatureEvent.key, this.handlePushSignatureEvent)
    this.addEventListener(
      PushSignaturesEvent.key,
      this.handlePushSignaturesEvent
    )
    this.addEventListener(
      SetSignatureVisibilityEvent.key,
      this.handleSetSignatureVisibilityEvent
    )
    this.addEventListener(
      HideAllSignaturesEvent.key,
      this.handleHideAllSignaturesEvent
    )
    this.addEventListener(
      ShowAllSignaturesEvent.key,
      this.handleShowAllSignaturesEvent
    )
    this.addEventListener(
      SetSignatureColorEvent.key,
      this.handleSetSignatureColorEvent
    )
    this.addEventListener(
      RemoveSignatureEvent.key,
      this.handleRemoveSignatureEvent
    )
    this.addEventListener(
      RemoveAllSignaturesEvent.key,
      this.handleRemoveAllSignaturesEvent
    )
  }

  render() {
    return html`<h1>Signature Inspector</h1>
      <main>
        <signature-list-element></signature-list-element>
        <visualizer-element></visualizer-element>
      </main>`
  }

  private handlePushSignatureEvent(e: PushSignatureEvent): void {
    this.signatures = [
      ...this.signatures,
      { signature: e.detail, visible: true, colorHex: getRandomColorHex() },
    ]
  }

  private handlePushSignaturesEvent(e: PushSignaturesEvent): void {
    this.signatures = [
      ...this.signatures,
      ...e.detail.map((s) => ({
        signature: s,
        visible: true,
        colorHex: getRandomColorHex(),
      })),
    ]
  }

  private handleSetSignatureVisibilityEvent(
    e: SetSignatureVisibilityEvent
  ): void {
    const signature = this.signatures[e.detail.signatureIndex]
    signature.visible = e.detail.visibility
    this.signatures = [...this.signatures]
  }

  private handleHideAllSignaturesEvent(_e: HideAllSignaturesEvent): void {
    this.signatures.forEach((s) => (s.visible = false))
    this.signatures = [...this.signatures]
  }

  private handleShowAllSignaturesEvent(_e: HideAllSignaturesEvent): void {
    this.signatures.forEach((s) => (s.visible = true))
    this.signatures = [...this.signatures]
  }

  private handleSetSignatureColorEvent(e: SetSignatureColorEvent): void {
    const signature = this.signatures[e.detail.signatureIndex]
    signature.colorHex = e.detail.colorHex
    this.signatures = [...this.signatures]
  }

  private handleRemoveSignatureEvent(e: RemoveSignatureEvent): void {
    const signaturesCopy = this.signatures.slice()
    signaturesCopy.splice(e.detail.signatureIndex, 1)
    this.signatures = [...signaturesCopy]
  }

  private handleRemoveAllSignaturesEvent(_e: RemoveAllSignaturesEvent): void {
    this.signatures = []
  }
}
