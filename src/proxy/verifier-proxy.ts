export type VerifierProxy = {
  InitializeNewVerifier: () => string
  TrainUsingSignatures: (id: string, signaturesJson: string) => Promise<void>
}
