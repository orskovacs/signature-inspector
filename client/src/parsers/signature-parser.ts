import { Signature } from '../model/signature.ts'

export interface SignatureParser {
  parse(file: File, options?: any): Signature[] | Promise<Signature[]>
}
