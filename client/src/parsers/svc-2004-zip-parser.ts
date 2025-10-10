import { DotNetBackedSignatureParser } from './dot-net-backed-signature-parser.ts'

export class Svc2004ZipParser extends DotNetBackedSignatureParser {
  protected get loaderId(): string {
    return 'Svc2004'
  }

  constructor() {
    super()
  }
}
