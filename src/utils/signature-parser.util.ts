import { Signature } from 'signature-field'

export async function parseSignaturesFile(file: File): Promise<Signature[]> {
  const json = await file.text()
  const object: unknown = JSON.parse(json)

  if (!Array.isArray(object)) {
    throw new Error('Cannot parse the given file: object is not an array')
  }

  return object.map((element, index) => {
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
    return new Signature(element.dataPoints)
  })
}
