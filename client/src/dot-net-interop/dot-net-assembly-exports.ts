import { SignatureVerifierManager } from './signature-verifier-manager.ts'

export type DotNetAssemblyExports = {
  DotNetGateway: {
    SignatureVerifierExport: SignatureVerifierManager
  }
}
