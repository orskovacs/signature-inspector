export const verificationStatusValues = [
  'genuine',
  'forged',
  'unverified',
  'training',
] as const

export type VerificationStatus = (typeof verificationStatusValues)[number]
