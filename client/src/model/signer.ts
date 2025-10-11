import { Signature } from './signature.ts'

export class Signer {
  private readonly _id: string
  private readonly _name: string
  private readonly _signatures: Signature[] = []

  constructor(name: string) {
    this._name = name
    this._id = crypto.randomUUID()
  }

  public get id(): string {
    return this._id
  }

  public get name(): string {
    return this._name
  }

  public get signatures() {
    return this._signatures
  }

  public addSignatures(...signatures: Signature[]) {
    for (const signature of signatures) {
      signature.signer = this
      this.signatures.push(signature)
    }
  }
}
