import { createContext } from '@lit/context'
import { Signer } from '../model/signer.ts'

export type SignersContextData = {
  signers: Signer[]
  selectedSignerIndex: number | null
}

export const signersContext = createContext<SignersContextData>(
  Symbol('signers-context')
)

export class PushSignersEvent extends CustomEvent<Signer[]> {
  public static readonly key = 'push-signers'

  constructor(signers: Signer[]) {
    super(PushSignersEvent.key, {
      bubbles: true,
      composed: true,
      detail: signers,
    })
  }
}

export class SelectSignerEvent extends CustomEvent<{
  signerIndex: number
}> {
  public static readonly key = 'select-signer'

  constructor(signerIndex: number) {
    super(SelectSignerEvent.key, {
      bubbles: true,
      composed: true,
      detail: { signerIndex },
    })
  }
}

type CustomEventMap = {
  [PushSignersEvent.key]: PushSignersEvent
  [SelectSignerEvent.key]: SelectSignerEvent
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
