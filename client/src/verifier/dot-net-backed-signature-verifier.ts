import { SignatureVerifier } from './signature-verifier.ts'
import { DotNetBackedObject } from '../dot-net-interop/dot-net-backed-object.ts'
import { SignatureVerifierImport } from '../dot-net-interop/dot-net-assembly-exports.ts'
import { Signature } from '../model/signature.ts'

export abstract class DotNetBackedSignatureVerifier
  extends DotNetBackedObject<SignatureVerifierImport>
  implements SignatureVerifier
{
  private readonly _dotNetId: Promise<string>

  protected abstract get classifierId(): string

  protected constructor() {
    super('SignatureVerifierExport')

    this._dotNetId = this.dotNetImport.then((manager) =>
      manager.InitializeNewVerifier(this.classifierId)
    )
  }

  public async trainUsingSignatures(signatures: Signature[]): Promise<void> {
    let manager = await this.dotNetImport
    let id = await this._dotNetId
    let signatureDataArray = signatures.map((s) => this.signatureToData(s))
    let signaturesJson = JSON.stringify(signatureDataArray)
    await manager.TrainUsingSignatures(id, signaturesJson)
  }

  public async testSignature(signature: Signature): Promise<boolean> {
    let manager = await this.dotNetImport
    let id = await this._dotNetId
    let signatureData = this.signatureToData(signature)
    let signatureJson = JSON.stringify(signatureData)
    return await manager.TestSignature(id, signatureJson)
  }

  private signatureToData(signature: Signature): SignatureData {
    return {
      id: signature.id,
      name: signature.name,
      authenticity: signature.authenticity,
      origin: signature.origin,
      dataPoints: signature.dataPoints,
    }
  }
}

type SignatureData = {
  id: string
  name: string
  authenticity: Signature['authenticity']
  origin: Signature['origin']
  dataPoints: Signature['dataPoints']
}
