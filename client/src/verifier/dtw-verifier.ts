import { DotNetBackedSignatureVerifier } from './dot-net-backed-signature-verifier.ts'

export class DtwVerifier extends DotNetBackedSignatureVerifier {
  protected get classifierId(): string {
    return 'Dtw'
  }

  constructor() {
    super()
  }
}
