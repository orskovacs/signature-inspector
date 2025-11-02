import {
  dtoToSignature,
  SignatureDto,
  signatureToDto,
} from './signature-dto.ts'
import { Signer } from '../signer.ts'

export type SignerDto = {
  id?: string
  name: string
  signatures: SignatureDto[]
}

export function signerToDto(signer: Signer) {
  return {
    id: signer.id,
    name: signer.name,
    signatures: signer.signatures.map((s) => signatureToDto(s)),
  }
}

export function dtoToSigner(dto: SignerDto) {
  const signer = new Signer(dto.name)

  for (const signatureDto of dto.signatures) {
    dtoToSignature(signatureDto, signer)
  }

  return signer
}
