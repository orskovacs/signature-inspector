import { SignatureVerifier } from './signature-verifier.ts'
import { DotNetInteropManager } from '../dot-net-interop/dot-net-interop-manager.ts'
import { SignatureVerifierManager } from '../dot-net-interop/signature-verifier-manager.ts'
import { Signature } from 'signature-field'

export abstract class DotNetBackedSignatureVerifier
  implements SignatureVerifier
{
  private readonly _manager: Promise<SignatureVerifierManager>
  private readonly _id: Promise<string>

  protected abstract get classifierId(): string

  protected constructor() {
    this._manager = DotNetInteropManager.instance.signatureVerifierManager
    this._id = this._manager.then((manager) =>
      manager.InitializeNewVerifier(this.classifierId)
    )
  }

  public async trainUsingSignatures(signatures: Signature[]): Promise<void> {
    let manager = await this._manager
    let id = await this._id
    let signatureDataArray = signatures.map((s) => ({
      timeStamp: s.creationTimeStamp,
      dataPoints: s.dataPoints,
    }))
    let signaturesJson = JSON.stringify(signatureDataArray)
    await manager.TrainUsingSignatures(id, signaturesJson)
  }

  public async testSignature(signature: Signature): Promise<boolean> {
    let manager = await this._manager
    let id = await this._id
    let signatureData = {
      timeStamp: signature.creationTimeStamp,
      dataPoints: signature.dataPoints,
    }
    let signatureJson = JSON.stringify(signatureData)
    return await manager.TestSignature(id, signatureJson)
  }
}
