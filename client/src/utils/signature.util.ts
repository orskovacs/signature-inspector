import { Signature, SignatureDataPoint } from 'signature-field'

type Feature = keyof SignatureDataPoint

export function getFeatureDataFromSignature(
  signature: Signature,
  feature: Feature
) {
  return signature.dataPoints.map((p) => p[feature])
}

export function standardize(data: number[]): number[] {
  if (data.length === 0) return []
  const sum = data.reduce((acc, curr) => acc + curr, 0)
  const count = data.length
  const mean = sum / count
  const squaredDifferences = data.map((x) => (x - mean) * (x - mean))
  const sumOfSquaredDifferences = squaredDifferences.reduce(
    (acc, curr) => acc + curr,
    0
  )
  const variance = sumOfSquaredDifferences / (count - 1)
  const stdDev = Math.sqrt(variance)

  const zScoreData = data.map((x) => (x - mean) / stdDev)
  return zScoreData
}
