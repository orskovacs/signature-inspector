import { Signature as SignatureBase, SignatureDataPoint } from 'signature-field'
import { Signer } from './signer.ts'

export class Signature extends SignatureBase {
  private _signer: Signer | null = null

  constructor(dataPoints: SignatureDataPoint[]) {
    super(dataPoints)
  }

  public get signer(): Signer | null {
    return this._signer
  }

  public setSigner(signer: Signer): void {
    this._signer = signer
  }
}
