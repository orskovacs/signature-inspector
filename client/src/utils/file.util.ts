export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (reader.result && typeof reader.result === 'string') {
        resolve(reader.result.replace('data:', '').replace(/^.+,/, ''))
      } else {
        reject(new Error('Failed to convert file to Base64'))
      }
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsDataURL(file)
  })
}
