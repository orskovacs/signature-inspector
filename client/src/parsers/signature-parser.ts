import { Signature } from '../model/signature.ts'
import { Signer } from '../model/signer.ts'
import { Disposable } from '../utils/disposable.ts'

export type ParseResult = { signatures: Signature[]; signers: Signer[] }

export interface SignatureParser extends Disposable {
  parse(
    file: File,
    existingSigners: Signer[],
    signerIds?: string[]
  ): ParseResult | Promise<ParseResult>
}
