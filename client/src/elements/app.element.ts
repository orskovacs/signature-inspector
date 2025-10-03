import { provide } from '@lit/context'
import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import {
  HideAllSignaturesEvent,
  PushSignatureEvent,
  PushSignaturesEvent,
  RemoveAllSignaturesEvent,
  RemoveSignatureEvent,
  ResetTrainSignaturesEvent,
  SetSignatureColorEvent,
  SetSignatureGenuinenessEvent,
  SetSignaturesForTrainingByIndexEvent,
  SetSignatureVisibilityEvent,
  ShowAllSignaturesEvent,
  SignatureData,
  signaturesContext,
} from '../contexts/signatures.context'
import { getRandomColorHex } from '../utils/color.util'
import {
  PushSignersEvent,
  SelectSignerEvent,
  signersContext,
  SignersContextData,
} from '../contexts/signers.context.ts'

@customElement('app-element')
export class AppElement extends LitElement {
  static styles = css`
    :host {
      --select-block-space: 8px;
      --md-outlined-field-bottom-space: var(--select-block-space);
      --md-outlined-field-top-space: var(--select-block-space);

      height: 100%;
      display: grid;
      grid-template-rows: min-content 1fr;
    }

    main {
      display: grid;
      grid-template-rows: 4fr 6fr;
      gap: 4px;
    }

    signature-list-element,
    visualizer-element {
      background: var(--md-sys-color-surface);
      border-radius: 28px;
    }

    signature-list-element,
    visualizer-element {
      height: calc(100% - 2 * 18px - 4px);
      padding: 18px;
    }
  `

  @provide({ context: signersContext })
  @state()
  private signersContext: SignersContextData = {
    signers: [],
    selectedSignerIndex: null,
  }

  @provide({ context: signaturesContext })
  @state()
  private signatures: SignatureData[] = []

  override connectedCallback() {
    super.connectedCallback()

    this.addEventListener(PushSignersEvent.key, this.handlePushSignersEvent)
    this.addEventListener(SelectSignerEvent.key, this.handleSelectSignerEvent)

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
    this.addEventListener(
      SetSignaturesForTrainingByIndexEvent.key,
      this.handleSetSignaturesForTrainingByIndexEvent
    )
    this.addEventListener(
      ResetTrainSignaturesEvent.key,
      this.handleResetTrainingSignatures
    )
    this.addEventListener(
      SetSignatureGenuinenessEvent.key,
      this.handleSetSignatureGenuinenessEvent
    )
  }

  render() {
    return html`<header-element></header-element>
      <main>
        <signature-list-element></signature-list-element>
        <visualizer-element></visualizer-element>
      </main>`
  }

  private handlePushSignatureEvent(e: PushSignatureEvent): void {
    this.signatures = [
      ...this.signatures,
      {
        signature: e.detail,
        visible: true,
        colorHex: getRandomColorHex(),
        genuineness: undefined,
      },
    ]
  }

  private handlePushSignaturesEvent(e: PushSignaturesEvent): void {
    this.signatures = [
      ...this.signatures,
      ...e.detail.map((s) => ({
        signature: s,
        visible: true,
        colorHex: getRandomColorHex(),
        usedForTraining: false,
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

  private handleSetSignaturesForTrainingByIndexEvent(
    e: SetSignaturesForTrainingByIndexEvent
  ): void {
    this.signatures.forEach((s, i) => {
      if (e.detail.signatureIndexes.includes(i)) {
        s.genuineness = 'train'
      }

      this.signatures = [...this.signatures]
    })
  }

  private handleResetTrainingSignatures(_e: ResetTrainSignaturesEvent): void {
    this.signatures.forEach((s) => (s.genuineness = undefined))
    this.signatures = [...this.signatures]
  }

  private handleSetSignatureGenuinenessEvent(
    e: SetSignatureGenuinenessEvent
  ): void {
    this.signatures[e.detail.signatureIndex].genuineness = e.detail.isGenuine
      ? 'genuine'
      : 'fake'
    this.signatures = [...this.signatures]
  }

  private handlePushSignersEvent(e: PushSignersEvent): void {
    this.signersContext = {
      ...this.signersContext,
      signers: [...this.signersContext.signers, ...e.detail],
    }
  }

  private handleSelectSignerEvent(e: SelectSignerEvent): void {
    this.signersContext = {
      ...this.signersContext,
      selectedSignerIndex: e.detail.signerIndex,
    }

    this.signatures = this.signersContext.signers[
      e.detail.signerIndex
    ].signatures.map((s) => ({
      signature: s,
      visible: true,
      colorHex: getRandomColorHex(),
      usedForTraining: false,
    }))
  }
}
