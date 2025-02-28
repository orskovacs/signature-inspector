import { VerifierProxy } from '../proxy/verifier-proxy.ts'
import { DotnetProxy } from '../proxy/dotnet-proxy.ts'
import { Signature } from 'signature-field'

export class EbDbaLsDtwVerifier {
  private readonly _proxy: Promise<VerifierProxy>
  private readonly _id: Promise<string>

  constructor() {
    this._proxy = DotnetProxy.instance.verifierProxy
    this._id = this._proxy.then((proxy) => proxy.InitializeNewVerifier())
  }

  public async trainUsingSignatures(signatures: Signature[]): Promise<void> {
    let proxy = await this._proxy
    let id = await this._id
    let signatureDataArray = signatures.map((s) => ({
      timeStamp: s.creationTimeStamp,
      dataPoints: s.dataPoints,
    }))
    let signaturesJson = JSON.stringify(signatureDataArray)
    await proxy.TrainUsingSignatures(id, signaturesJson)
  }

  public async testSignature(signature: Signature): Promise<boolean> {
    let proxy = await this._proxy
    let id = await this._id
    let signatureData = {
      timeStamp: signature.creationTimeStamp,
      dataPoints: signature.dataPoints,
    }
    let signatureJson = JSON.stringify(signatureData)
    return await proxy.TestSignature(id, signatureJson)
  }
}
