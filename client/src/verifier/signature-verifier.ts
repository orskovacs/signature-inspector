import { Signature } from 'signature-field'

export interface SignatureVerifier {
  trainUsingSignatures(signatures: Signature[]): Promise<void>

  testSignature(signature: Signature): Promise<boolean>
}
