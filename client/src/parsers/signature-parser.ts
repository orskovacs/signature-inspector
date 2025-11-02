import { Signer } from '../model/signer.ts'
import { Disposable } from '../utils/disposable.ts'

export type ParseResult = {
  newSigners: Signer[]
  signersWithNewSignatures: Signer[]
}

export interface SignatureParser extends Disposable {
  parse(
    file: File,
    existingSigners: Signer[],
    signerIds?: string[]
  ): Promise<ParseResult>
}
