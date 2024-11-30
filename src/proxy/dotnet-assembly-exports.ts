import { SignatureVerifierProxy } from './signature-verifier-proxy.ts'

export type DotnetAssemblyExports = {
  SignatureVerifier: {
    VerifierExport: SignatureVerifierProxy
  }
}
