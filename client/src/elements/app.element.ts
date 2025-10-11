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
  SelectAllSignaturesEvent,
  SetSignatureColorEvent,
  SetSignatureGenuinenessEvent,
  SetSignatureSelectionEvent,
  SetSignaturesForTrainingByIndexEvent,
  SetSignatureVisibilityEvent,
  ShowAllSignaturesEvent,
  signaturesContext,
  UnselectAllSignaturesEvent,
} from '../contexts/signatures.context'
import {
  PushSignersEvent,
  SelectSignerEvent,
  signersContext,
  SignersContextData,
} from '../contexts/signers.context.ts'
import { Signature } from '../model/signature.ts'

@customElement('app-element')
export class AppElement extends LitElement {
  static styles = css`
    :host {
      --select-block-space: 8px;
      --button-height: 30px;
      --md-outlined-field-bottom-space: var(--select-block-space);
      --md-outlined-field-top-space: var(--select-block-space);
      --md-text-button-container-height: var(--button-height);
      --md-filled-button-container-height: var(--button-height);
      --md-filled-tonal-button-container-height: var(--button-height);
      --md-outlined-button-container-height: var(--button-height);
      --md-switch-track-height: 25px;
      --md-menu-item-top-space: var(--select-block-space);
      --md-menu-item-bottom-space: var(--select-block-space);
      --md-menu-item-one-line-container-height: 40px;

      height: 100%;
      display: grid;
      grid-template-rows: min-content 1fr;
    }

    main {
      display: grid;
      grid-template-rows: 40% 60%;
      gap: 6px;
      height: calc(100vh - 69px);
    }

    signature-list-element,
    visualizer-element {
      background: var(--md-sys-color-surface);
      border-radius: 16px;
    }

    signature-list-element {
      padding: 8px;
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
  private signatures: Signature[] = []

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
      SetSignatureSelectionEvent.key,
      this.handleSetSignatureSelectionEvent
    )
    this.addEventListener(
      UnselectAllSignaturesEvent.key,
      this.handleUnselectAllSignaturesEvent
    )
    this.addEventListener(
      SelectAllSignaturesEvent.key,
      this.handleSelectAllSignaturesEvent
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
    this.signatures = [...this.signatures, e.detail]
  }

  private handlePushSignaturesEvent(e: PushSignaturesEvent): void {
    this.signatures = [...this.signatures, ...e.detail]
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

  private handleSetSignatureSelectionEvent(
    e: SetSignatureSelectionEvent
  ): void {
    const signature = this.signatures[e.detail.signatureIndex]
    signature.selected = e.detail.selection
    this.signatures = [...this.signatures]
  }

  private handleUnselectAllSignaturesEvent(
    _e: UnselectAllSignaturesEvent
  ): void {
    this.signatures.forEach((s) => (s.selected = false))
    this.signatures = [...this.signatures]
  }

  private handleSelectAllSignaturesEvent(_e: SelectAllSignaturesEvent): void {
    this.signatures.forEach((s) => (s.selected = true))
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
        s.status = 'train'
      }

      this.signatures = [...this.signatures]
    })
  }

  private handleResetTrainingSignatures(_e: ResetTrainSignaturesEvent): void {
    this.signatures.forEach((s) => (s.status = 'unknown'))
    this.signatures = [...this.signatures]
  }

  private handleSetSignatureGenuinenessEvent(
    e: SetSignatureGenuinenessEvent
  ): void {
    this.signatures[e.detail.signatureIndex].status = e.detail.isGenuine
      ? 'genuine'
      : 'forgery'
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

    this.signatures =
      this.signersContext.signers[e.detail.signerIndex].signatures
  }
}
