import { createContext } from '@lit/context'
import { Signature } from 'signature-field'

export type SignatureData = {
  signature: Signature
  visible: boolean
  colorHex: string
}

export const signaturesContext = createContext<Array<SignatureData>>(
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

type CustomEventMap = {
  [PushSignatureEvent.key]: PushSignatureEvent
  [PushSignaturesEvent.key]: PushSignaturesEvent
  [SetSignatureVisibilityEvent.key]: SetSignatureVisibilityEvent
  [HideAllSignaturesEvent.key]: HideAllSignaturesEvent
  [ShowAllSignaturesEvent.key]: ShowAllSignaturesEvent
  [SetSignatureColorEvent.key]: SetSignatureColorEvent
  [RemoveSignatureEvent.key]: RemoveSignatureEvent
  [RemoveAllSignaturesEvent.key]: RemoveAllSignaturesEvent
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
