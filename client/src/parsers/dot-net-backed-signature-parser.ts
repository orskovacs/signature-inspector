import { DotNetBackedObject } from '../dot-net-interop/dot-net-backed-object.ts'
import { SignatureParser } from './signature-parser.ts'
import { Signature } from '../model/signature.ts'
import { SignatureParserImport } from '../dot-net-interop/dot-net-assembly-exports.ts'
import { fileToBase64 } from '../utils/file.util.ts'
import { Signer } from '../model/signer.ts'
import { SignatureDataPoint } from 'signature-field'

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

  public async parse(file: File, options?: any): Promise<Signature[]> {
    let manager = await this.dotNetImport
    let id = await this._dotNetId
    let fileBase64 = await fileToBase64(file)
    let signersJson = await manager.ParseFileContents(id, fileBase64)
    const result: [{ x: [number]; y: [number]; signer: string }] =
      JSON.parse(signersJson)

    const signers: Map<string, Signer> = new Map<string, Signer>()

    return result.map((signatureData) => {
      const dataPoints: SignatureDataPoint[] = Array.from(
        { length: Math.min(signatureData.x.length, signatureData.y.length) },
        (_, index) => ({
          xCoord: signatureData.x[index],
          yCoord: signatureData.y[index],
          timeStamp: index,
          pressure: 0,
          altitudeAngle: 0,
          azimuthAngle: 0,
          height: 0,
          twist: 0,
        })
      )
      const signature = new Signature(dataPoints)

      const signerId = signatureData.signer
      if (signers.has(signerId)) {
        signers.get(signerId)!.addSignatures(signature)
      } else {
        const signer = new Signer(signerId)
        signer.addSignatures(signature)
        signers.set(signerId, signer)
      }

      return signature
    })
  }
}
