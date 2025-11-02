export const authenticityValues = ['genuine', 'forged', 'unknown'] as const

export type Authenticity = (typeof authenticityValues)[number]
