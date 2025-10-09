import { Signature } from '../model/signature.ts'
import { Signer } from '../model/signer.ts'

export type ParseResult = { signatures: Signature[]; signers: Signer[] }

export interface SignatureParser {
  parse(
    file: File,
    existingSigners: Signer[],
    signerIds?: string[]
  ): ParseResult | Promise<ParseResult>
}
