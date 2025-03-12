import { createContext } from '@lit/context'

export const normalizeDataContext = createContext<boolean>(
  Symbol('normalize-data-context')
)

type CustomEventMap = {}

declare global {
  interface HTMLElement {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void
    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void
  }
}
