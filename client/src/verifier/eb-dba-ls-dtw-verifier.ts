import { DotNetBackedSignatureVerifier } from './dot-net-backed-signature-verifier.ts'

export class EbDbaLsDtwVerifier extends DotNetBackedSignatureVerifier {
  protected get classifierId(): string {
    return 'EbDbaLsDtw'
  }

  constructor() {
    super()
  }
}
