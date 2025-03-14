import { DotNetBackedObject } from '../dot-net-interop/dot-net-backed-object.ts'
import { SignatureParser } from './signature-parser.ts'
import { Signature } from 'signature-field'
import { SignatureParserImport } from '../dot-net-interop/dot-net-assembly-exports.ts'

export abstract class DotNetBackedSignatureParser
  extends DotNetBackedObject<SignatureParserImport>
  implements SignatureParser
{
  private readonly _dotNetId: Promise<string>

  protected abstract get loaderId(): string

  protected constructor() {
    super('SignatureParserExport')

    this._dotNetId = this.dotNetImport.then((manager) =>
      manager.InitializeNewParser(this.loaderId)
    )
  }

  public async parse(file: File): Promise<Signature[]> {
    let manager = await this.dotNetImport
    let id = await this._dotNetId
    let fileContents = await file.text()
    let signaturesJson = await manager.ParseFileContents(id, fileContents)
    return JSON.parse(signaturesJson)
  }
}
