export type DotNetAssemblyExports = {
  DotNetGateway: {
    SignatureVerifierExport: SignatureVerifierImport
    SignatureParserExport: SignatureParserImport
  }
}

export interface DotNetImport {}

export interface SignatureVerifierImport extends DotNetImport {
  InitializeNewVerifier: (classifierId: string) => string
  TrainUsingSignatures: (id: string, signaturesJson: string) => Promise<void>
  TestSignature: (id: string, signatureJson: string) => Promise<boolean>
}

export interface SignatureParserImport extends DotNetImport {}
