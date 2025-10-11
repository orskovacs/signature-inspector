import { Signature as SignatureBase, SignatureDataPoint } from 'signature-field'
import { Signer } from './signer.ts'
import { getRandomColorHex } from '../utils/color.util.ts'

export class Signature extends SignatureBase {
  private readonly _name: string
  private _signer: Signer | null = null
  private _visible: boolean = false
  private _forTraining: boolean = false
  private _colorHex: string = getRandomColorHex()
  private readonly _authenticity: Authenticity = 'unknown'
  private _verificationStatus: VerificationStatus = 'unverified'
  private readonly _origin: string | null = null

  constructor(
    name: string,
    dataPoints: SignatureDataPoint[],
    authenticity: Authenticity = 'unknown',
    origin: string | null = null
  ) {
    super(dataPoints)
    this._name = name
    this._authenticity = authenticity
    this._origin = origin
  }

  public get name(): string {
    return this._name
  }

  public get signer(): Signer | null {
    return this._signer
  }

  public set signer(signer: Signer) {
    this._signer = signer
  }

  public get visible(): boolean {
    return this._visible
  }

  public set visible(value: boolean) {
    this._visible = value
  }

  public get forTraining(): boolean {
    return this._forTraining
  }

  public set forTraining(value: boolean) {
    this._forTraining = value
  }

  public get colorHex(): string {
    return this._colorHex
  }

  public set colorHex(value: string) {
    this._colorHex = value
  }

  public get authenticity(): Authenticity {
    return this._authenticity
  }

  public get verificationStatus(): VerificationStatus {
    return this._verificationStatus
  }

  public set verificationStatus(value: VerificationStatus) {
    this._verificationStatus = value
  }

  public get origin() {
    return this._origin
  }
}

export type VerificationStatus =
  | 'genuine'
  | 'forged'
  | 'unverified'
  | 'training'
export type Authenticity = 'genuine' | 'forged' | 'unknown'
