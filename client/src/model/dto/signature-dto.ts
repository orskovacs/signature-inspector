import { Signature } from '../signature.ts'
import { authenticityValues } from '../authenticity.ts'
import { Signer } from '../signer.ts'

export type SignatureDto = {
  id?: string
  name: string
  authenticity: Signature['authenticity']
  origin: Signature['origin']
  dataPoints: Signature['dataPoints']
}

export function signatureToDto(signature: Signature): SignatureDto {
  if (!authenticityValues.includes(signature.authenticity))
    throw new Error(`Invalid authenticity type: ${signature.authenticity}`)

  return {
    id: signature.id,
    name: signature.name,
    authenticity: signature.authenticity,
    origin: signature.origin,
    dataPoints: signature.dataPoints,
  }
}

export function dtoToSignature(dto: SignatureDto, signer: Signer): Signature {
  const signature = new Signature(
    dto.name,
    dto.dataPoints,
    dto.authenticity,
    dto.origin
  )
  signer.addSignatures(signature)
  return signature
}
