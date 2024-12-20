import { VerifierProxy } from './verifier-proxy.ts'

export type DotnetAssemblyExports = {
  Verifier: {
    VerifierExport: VerifierProxy
  }
}
