import { SignatureVerifierProxy } from '../proxy/signature-verifier-proxy.ts'
import { DotnetProxy } from '../proxy/dotnet-proxy.ts'
import { Signature } from 'signature-field'

export class SignatureVerifier {
  private readonly _proxy: Promise<SignatureVerifierProxy>
  private readonly _id: Promise<string>

  constructor() {
    this._proxy = DotnetProxy.instance.signatureVerifierProxy
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
}
