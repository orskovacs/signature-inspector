import { ParseResult, SignatureParser } from './signature-parser'
import { Signature } from '../model/signature.ts'
import { Signer } from '../model/signer.ts'

export class SignaturesFileParser implements SignatureParser {
  async parse(file: File, _existingSigners: Signer[]): Promise<ParseResult> {
    const json = await file.text()
    const object: unknown = JSON.parse(json)

    if (!Array.isArray(object)) {
      throw new Error('Cannot parse the given file: object is not an array')
    }

    return {
      signatures: object.map((element, index) => {
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

        // TODO: Additional checks
        // TODO: creationTimestamp is ignored
        return new Signature(String(element.creationTimeStamp), element.dataPoints)
      }),
      signers: [],
    }
  }
}
