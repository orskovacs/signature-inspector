import { Signature } from '../model/signature.ts'
import { Disposable } from '../utils/disposable.ts'

export interface SignatureVerifier extends Disposable {
  trainUsingSignatures(signatures: Signature[]): Promise<void>

  testSignature(signature: Signature): Promise<boolean>
}
