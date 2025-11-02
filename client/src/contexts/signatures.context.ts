import { createContext } from '@lit/context'
import { Signature } from '../model/signature.ts'
import { VerificationStatus } from '../model/verification-status.ts'

export const signaturesContext = createContext<Array<Signature>>(
  Symbol('signatures-context')
)

export class PushSignatureEvent extends CustomEvent<Signature> {
  public static readonly key = 'push-signature'

  constructor(signature: Signature) {
    super(PushSignatureEvent.key, {
      bubbles: true,
      composed: true,
      detail: signature,
    })
  }
}

export class PushSignaturesEvent extends CustomEvent<Signature[]> {
  public static readonly key = 'push-signatures'

  constructor(signatures: Signature[]) {
    super(PushSignaturesEvent.key, {
      bubbles: true,
      composed: true,
      detail: signatures,
    })
  }
}

export class SetSignatureVisibilityEvent extends CustomEvent<{
  signatureIndex: number
  visibility: boolean
}> {
  public static readonly key = 'set-signature-visibility'

  constructor(signatureIndex: number, visibility: boolean) {
    super(SetSignatureVisibilityEvent.key, {
      bubbles: true,
      composed: true,
      detail: { signatureIndex, visibility },
    })
  }
}

export class HideAllSignaturesEvent extends CustomEvent<void> {
  public static readonly key = 'hide-all-signatures'

  constructor() {
    super(HideAllSignaturesEvent.key, {
      bubbles: true,
      composed: true,
    })
  }
}

export class ShowAllSignaturesEvent extends CustomEvent<void> {
  public static readonly key = 'show-all-signatures'

  constructor() {
    super(ShowAllSignaturesEvent.key, {
      bubbles: true,
      composed: true,
    })
  }
}

export class SetSignatureSelectionEvent extends CustomEvent<{
  signatureIndex: number
  selection: boolean
}> {
  public static readonly key = 'set-signature-selection'

  constructor(signatureIndex: number, selection: boolean) {
    super(SetSignatureSelectionEvent.key, {
      bubbles: true,
      composed: true,
      detail: { signatureIndex, selection },
    })
  }
}

export class UnselectAllSignaturesEvent extends CustomEvent<void> {
  public static readonly key = 'unselect-all-signatures'

  constructor() {
    super(UnselectAllSignaturesEvent.key, {
      bubbles: true,
      composed: true,
    })
  }
}

export class SelectAllSignaturesEvent extends CustomEvent<void> {
  public static readonly key = 'select-all-signatures'

  constructor() {
    super(SelectAllSignaturesEvent.key, {
      bubbles: true,
      composed: true,
    })
  }
}

export class SetSignatureColorEvent extends CustomEvent<{
  signatureIndex: number
  colorHex: string
}> {
  public static readonly key = 'set-signature-color'

  constructor(signatureIndex: number, colorHex: string) {
    super(SetSignatureColorEvent.key, {
      bubbles: true,
      composed: true,
      detail: { signatureIndex, colorHex },
    })
  }
}

export class RemoveSignatureEvent extends CustomEvent<{
  signatureIndex: number
}> {
  public static readonly key = 'remove-signature'

  constructor(signatureIndex: number) {
    super(RemoveSignatureEvent.key, {
      bubbles: true,
      composed: true,
      detail: { signatureIndex },
    })
  }
}

export class RemoveAllSignaturesEvent extends CustomEvent<void> {
  public static readonly key = 'remove-all-signatures'

  constructor() {
    super(RemoveAllSignaturesEvent.key, {
      bubbles: true,
      composed: true,
    })
  }
}

export class SetSignaturesForTrainingByIndexEvent extends CustomEvent<{
  signatureIndexes: number[]
}> {
  public static readonly key = 'set-signatures-for-training'

  constructor(signatureIndexes: number[]) {
    super(SetSignaturesForTrainingByIndexEvent.key, {
      bubbles: true,
      composed: true,
      detail: { signatureIndexes },
    })
  }
}

export class ResetTrainSignaturesEvent extends CustomEvent<void> {
  public static readonly key = 'reset-signatures'

  constructor() {
    super(ResetTrainSignaturesEvent.key, {
      bubbles: true,
      composed: true,
    })
  }
}

export class SetSignatureVerificationStatusEvent extends CustomEvent<{
  signatureIndex: number
  status: VerificationStatus
}> {
  public static readonly key = 'set-signature-verification-status'

  constructor(signatureIndex: number, status: VerificationStatus) {
    super(SetSignatureVerificationStatusEvent.key, {
      bubbles: true,
      composed: true,
      detail: { signatureIndex, status },
    })
  }
}

type CustomEventMap = {
  [PushSignatureEvent.key]: PushSignatureEvent
  [PushSignaturesEvent.key]: PushSignaturesEvent
  [SetSignatureVisibilityEvent.key]: SetSignatureVisibilityEvent
  [HideAllSignaturesEvent.key]: HideAllSignaturesEvent
  [ShowAllSignaturesEvent.key]: ShowAllSignaturesEvent
  [SetSignatureSelectionEvent.key]: SetSignatureSelectionEvent
  [UnselectAllSignaturesEvent.key]: UnselectAllSignaturesEvent
  [SelectAllSignaturesEvent.key]: SelectAllSignaturesEvent
  [SetSignatureColorEvent.key]: SetSignatureColorEvent
  [RemoveSignatureEvent.key]: RemoveSignatureEvent
  [RemoveAllSignaturesEvent.key]: RemoveAllSignaturesEvent
  [SetSignaturesForTrainingByIndexEvent.key]: SetSignaturesForTrainingByIndexEvent
  [ResetTrainSignaturesEvent.key]: ResetTrainSignaturesEvent
  [SetSignatureVerificationStatusEvent.key]: SetSignatureVerificationStatusEvent
}

declare global {
  interface HTMLElement {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void
    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void
  }
}
