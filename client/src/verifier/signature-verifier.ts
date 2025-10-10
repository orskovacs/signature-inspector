import { Signature } from '../model/signature.ts'

export interface SignatureVerifier {
  trainUsingSignatures(signatures: Signature[]): Promise<void>

  testSignature(signature: Signature): Promise<boolean>
}
