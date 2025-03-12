import { VerifierProxy } from './verifier-proxy.ts'

export type DotNetAssemblyExports = {
  Verifier: {
    VerifierExport: VerifierProxy
  }
}
