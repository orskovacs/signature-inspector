import { Signature } from '../model/signature.ts'

export interface SignatureParser {
  parse(file: File): Signature[] | Promise<Signature[]>
}
