import { provide } from '@lit/context'
import { LitElement, css, html } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import {
  HideAllSignaturesEvent,
  PushSignatureEvent,
  PushSignaturesEvent,
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
import {
  PushSignersEvent,
  SelectSignerEvent,
  signersContext,
  SignersContextData,
} from '../contexts/signers.context.ts'
import { Signature } from '../model/signature.ts'
import {
  BeginLoadingEvent,
  EndLoadingEvent,
  LoadingSpinnerElement,
} from './loading-spinner.element.ts'
import { UUID } from '../utils/types.ts'
import {
  DisplayErrorEvent,
  ErrorNotificationElement,
} from './error-notification.element.ts'

@customElement('app-element')
export class AppElement extends LitElement {
  static styles = css`
    :host {
      --field-block-space: 8px;
      --button-height: 30px;
      --md-outlined-field-bottom-space: var(--field-block-space);
      --md-outlined-field-top-space: var(--field-block-space);
      --md-text-button-container-height: var(--button-height);
      --md-filled-button-container-height: var(--button-height);
      --md-filled-tonal-button-container-height: var(--button-height);
      --md-outlined-button-container-height: var(--button-height);
      --md-switch-track-height: 25px;
      --md-menu-item-top-space: var(--field-block-space);
      --md-menu-item-bottom-space: var(--field-block-space);
      --md-menu-item-one-line-container-height: 40px;
      --md-outlined-text-field-top-space: var(--field-block-space);
      --md-outlined-text-field-bottom-space: var(--field-block-space);
      --md-sys-color-surface-container: var(--md-sys-color-surface-variant);
      --md-dialog-container-color: var(--md-sys-color-surface);

      height: 100%;
      display: grid;
      grid-template-rows: min-content 1fr;
      grid-template-columns: 100%;
    }

    main {
      position: relative;
      bottom: 0;
      display: grid;
      grid-template-rows: 40% 60%;
      grid-template-columns: 100%;
      gap: 6px;
      height: calc(100vh - 69px);
      transition: bottom 0.5s ease-in-out;
    }

    main.hidden {
      bottom: -100%;
    }

    header-element {
      position: relative;
      top: 0;
      transition: top 0.5s ease-in-out;
    }

    header-element.center {
      top: calc(50vh - 100%);
    }

    signature-list-element,
    visualizer-element {
      background: var(--md-sys-color-surface);
      border-radius: 16px;
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

  @query('#loading-spinner')
  private loadingSpinnerElement!: LoadingSpinnerElement

  @query('#error-notification')
  private errorNotificationElement!: ErrorNotificationElement

  private loadings: Set<UUID> = new Set()

  private get isAppEmpty(): boolean {
    return this.signersContext.signers.length === 0
  }

  override connectedCallback() {
    super.connectedCallback()

    this.addExitAlert()

    this.addEventListener(DisplayErrorEvent.key, this.handleDisplayError)

    this.addEventListener(BeginLoadingEvent.key, this.handleBeginLoading)
    this.addEventListener(EndLoadingEvent.key, this.handleEndLoading)

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
      SetSignatureVerificationStatusEvent.key,
      this.handleSetSignatureVerificationStatusEvent
    )
  }

  override disconnectedCallback() {
    window.onbeforeunload = null
  }

  render() {
    return html` <header-element
        class="${this.isAppEmpty ? 'center' : ''}"
      ></header-element>
      <main class="${this.isAppEmpty ? 'hidden' : ''}">
        <signature-list-element></signature-list-element>
        <visualizer-element></visualizer-element>
      </main>
      <loading-spinner-element id="loading-spinner"></loading-spinner-element>
      <error-notification-element
        id="error-notification"
      ></error-notification-element>`
  }

  private pushSignatures(...signatures: Signature[]): void {
    if (signatures.length === 0) return

    if (this.signatures.length === 0 && signatures.every((s) => !s.visible)) {
      const visibleSignaturesCount = Math.min(3, signatures.length)
      for (let i = 0; i < visibleSignaturesCount; i++) {
        signatures[i].visible = true
      }
    }

    this.signatures = [...this.signatures, ...signatures]
  }

  private handlePushSignatureEvent(e: PushSignatureEvent): void {
    this.pushSignatures(e.detail)
  }

  private handlePushSignaturesEvent(e: PushSignaturesEvent): void {
    this.pushSignatures(...e.detail)
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
    signature.forTraining = e.detail.selection
    this.signatures = [...this.signatures]
  }

  private handleUnselectAllSignaturesEvent(
    _e: UnselectAllSignaturesEvent
  ): void {
    this.signatures.forEach((s) => (s.forTraining = false))
    this.signatures = [...this.signatures]
  }

  private handleSelectAllSignaturesEvent(_e: SelectAllSignaturesEvent): void {
    this.signatures.forEach((s) => (s.forTraining = true))
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
        s.verificationStatus = 'training'
      }

      this.signatures = [...this.signatures]
    })
  }

  private handleResetTrainingSignatures(_e: ResetTrainSignaturesEvent): void {
    this.signatures.forEach((s) => (s.verificationStatus = 'unverified'))
    this.signatures = [...this.signatures]
  }

  private handleSetSignatureVerificationStatusEvent(
    e: SetSignatureVerificationStatusEvent
  ): void {
    this.signatures[e.detail.signatureIndex].verificationStatus =
      e.detail.status
    this.signatures = [...this.signatures]
  }

  private handlePushSignersEvent(e: PushSignersEvent): void {
    const selectFirst =
      this.signersContext.signers.length === 0 && e.detail.length > 0

    this.signersContext = {
      ...this.signersContext,
      signers: [...this.signersContext.signers, ...e.detail],
    }

    if (selectFirst) {
      this.dispatchEvent(new SelectSignerEvent(0))
    }
  }

  private handleSelectSignerEvent(e: SelectSignerEvent): void {
    this.signersContext = {
      ...this.signersContext,
      selectedSignerIndex: e.detail.signerIndex,
    }

    this.signatures = []

    this.pushSignatures(
      ...this.signersContext.signers[e.detail.signerIndex].signatures
    )
  }

  private handleDisplayError(e: DisplayErrorEvent): void {
    this.errorNotificationElement.addError(e.detail.error)
  }

  private handleBeginLoading(e: BeginLoadingEvent): void {
    this.loadings.add(e.detail.uuid)
    this.loadingSpinnerElement.display(e.detail.label)
  }

  private handleEndLoading(e: EndLoadingEvent): void {
    this.loadings.delete(e.detail.uuid)
    if (this.loadings.size === 0) {
      this.loadingSpinnerElement.hide()
    }
  }

  private addExitAlert() {
    if (!import.meta.env.DEV) {
      window.onbeforeunload = (event) => {
        if (this.signersContext.signers.length === 0) return

        event.preventDefault()
        const message = `Please keep in mind that Signature Inspector doesn't save your data.`
        event.returnValue = message
        return message
      }
    }
  }
}
