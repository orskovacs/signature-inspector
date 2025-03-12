export interface SignatureVerifierManager {
  InitializeNewVerifier: () => string
  TrainUsingSignatures: (id: string, signaturesJson: string) => Promise<void>
  TestSignature: (id: string, signatureJson: string) => Promise<boolean>
}
