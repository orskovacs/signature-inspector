import { Signature, SignatureDataPoint } from 'signature-field'

type Feature = keyof SignatureDataPoint

export function getFeatureDataFromSignature(
  signature: Signature,
  feature: Feature
) {
  return signature.dataPoints.map((p) => p[feature])
}

export function normalizeTimeSeries(timeSeries: number[]): number[] {
  const tsFinite = timeSeries.filter(
    (x) => !Number.isNaN(x) && Number.isFinite(x)
  )
  const maxFinite = Math.max(...tsFinite)
  const minFinite = Math.min(...tsFinite)

  const ts = timeSeries.map((x) => {
    if (Number.isNaN(x)) return 0
    if (x === Infinity) return maxFinite
    if (x === -Infinity) return minFinite
    return x
  })

  // Calculate the sum
  const sum = ts.reduce((acc, curr) => acc + curr)

  // Calculate the mean
  const mean = sum / ts.length

  // Calculate the corrected empirical standard deviation
  const stdDev = Math.sqrt(
    ts.reduce((acc, curr) => acc + (curr - mean) * (curr - mean)) /
      (ts.length - 1)
  )

  return ts.map((x) => (x - mean) / stdDev)
}
