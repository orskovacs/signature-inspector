export interface SignatureVerifierManager {
  InitializeNewVerifier: (classifierId: string) => string
  TrainUsingSignatures: (id: string, signaturesJson: string) => Promise<void>
  TestSignature: (id: string, signatureJson: string) => Promise<boolean>
}
