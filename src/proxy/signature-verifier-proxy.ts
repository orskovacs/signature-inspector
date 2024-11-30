export type SignatureVerifierProxy = {
  InitializeNewVerifier: () => string
  TrainUsingSignatures: (id: string, signaturesJson: string) => Promise<void>
}
