import { Signature } from 'signature-field'

export interface SignatureParser {
  parse(file: File): Signature[] | Promise<Signature[]>
}
