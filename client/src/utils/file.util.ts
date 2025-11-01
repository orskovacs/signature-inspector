export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()

      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          resolve(reader.result.replace('data:', '').replace(/^.+,/, ''))
        } else {
          reject(new Error('Failed to convert ArrayBuffer to Base64'))
        }
      }

      reader.onerror = (error) => reject(error)

      reader.readAsDataURL(blob)
    } catch (e) {
      reject(e)
    }
  })
}

export function fileToBase64(file: File): Promise<string> {
  return blobToBase64(file)
}

export function arrayBufferToBase64(arrayBuffer: ArrayBuffer): Promise<string> {
  return blobToBase64(new Blob([arrayBuffer]))
}
