import { SignatureVerifier } from './signature-verifier.ts'
import { Signature } from 'signature-field'
import { DotNetBackedObject } from '../dot-net-interop/dot-net-backed-object.ts'
import { SignatureVerifierImport } from '../dot-net-interop/dot-net-assembly-exports.ts'

export abstract class DotNetBackedSignatureVerifier
  extends DotNetBackedObject<SignatureVerifierImport>
  implements SignatureVerifier
{
  private readonly _dotNetId: Promise<string>

  protected abstract get classifierId(): string

  protected constructor() {
    super("SignatureVerifierExport")

    this._dotNetId = this.dotNetImport.then((manager) =>
      manager.InitializeNewVerifier(this.classifierId)
    )
  }

  public async trainUsingSignatures(signatures: Signature[]): Promise<void> {
    let manager = await this.dotNetImport
    let id = await this._dotNetId
    let signatureDataArray = signatures.map((s) => ({
      timeStamp: s.creationTimeStamp,
      dataPoints: s.dataPoints,
    }))
    let signaturesJson = JSON.stringify(signatureDataArray)
    await manager.TrainUsingSignatures(id, signaturesJson)
  }

  public async testSignature(signature: Signature): Promise<boolean> {
    let manager = await this.dotNetImport
    let id = await this._dotNetId
    let signatureData = {
      timeStamp: signature.creationTimeStamp,
      dataPoints: signature.dataPoints,
    }
    let signatureJson = JSON.stringify(signatureData)
    return await manager.TestSignature(id, signatureJson)
  }
}
