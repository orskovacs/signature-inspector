import { DotNetBackedSignatureParser } from './dot-net-backed-signature-parser.ts'

export class DeepSignZipParser extends DotNetBackedSignatureParser {
  protected get loaderId(): string {
    return 'Svc2021'
  }

  constructor() {
    super()
  }
}
