function getRandomNumberInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}

export const getRandomColorHex = () =>
  [
    getRandomNumberInRange(0, 256),
    getRandomNumberInRange(0, 256),
    getRandomNumberInRange(0, 256),
  ]
    .map((v) => {
      const hex = v.toString(16)
      return hex.length === 2 ? hex : `0${hex}`
    })
    .join('')
