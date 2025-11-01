import { ParseResult, SignatureParser } from './signature-parser'
import { Signature } from '../model/signature.ts'
import { Signer } from '../model/signer.ts'
import { Authenticity, authenticityValues } from '../model/authenticity.ts'

export class SignaturesFileParser implements SignatureParser {
  public dispose(): void {}

  async parse(file: File, _existingSigners: Signer[]): Promise<ParseResult> {
    const json = await file.text()
    const object: unknown = JSON.parse(json)

    if (!Array.isArray(object)) {
      throw new Error('Cannot parse the given file: object is not an array')
    }

    const signer = new Signer('Signer')

    const signatures = object.map((element, index) => {
      let name: string = index.toString()
      let authenticity: Authenticity = 'unknown'
      let origin: string = 'Unknown'

      if (!('creationTimeStamp' in element)) {
        throw new Error(
          `Cannot parse element no. ${index} of the array: expected property: 'creationTimeStamp' not found`
        )
      }

      if (!('dataPoints' in element)) {
        throw new Error(
          `Cannot parse element no. ${index} of the array: expected property: 'dataPoints' not found`
        )
      }

      if (
        'authenticity' in element &&
        typeof element.authenticity === 'string' &&
        authenticityValues.includes(element.authenticity)
      ) {
        authenticity = element.authenticity
      }

      if ('origin' in element) {
        origin = element.origin
      }

      if ('name' in element) {
        name = element.name
      }

      const signature = new Signature(
        String(name),
        element.dataPoints,
        authenticity,
        origin
      )

      signature.signer = signer

      return signature
    })

    signer.addSignatures(...signatures)

    return {
      newSigners: [signer],
      signersWithNewSignatures: [],
    }
  }
}
