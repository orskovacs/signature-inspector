import { Signature } from './signature.ts'

export class Signer {
  private readonly _id: string
  private readonly _signatures: Signature[] = []

  constructor(id: string) {
    this._id = id
  }

  public get id(): string {
    return this._id
  }

  public get signatures() {
    return this._signatures
  }

  public addSignatures(...signatures: Signature[]) {
    for (const signature of signatures) {
      signature.setSigner(this)
      this.signatures.push(signature)
    }
  }
}
