import { Signature as SignatureBase, SignatureDataPoint } from 'signature-field'
import { Signer } from './signer.ts'
import { getRandomColorHex } from '../utils/color.util.ts'

export class Signature extends SignatureBase {
  private readonly _name: string
  private _signer: Signer | null = null
  private _visible: boolean = true
  private _selected: boolean = false
  private _colorHex: string = getRandomColorHex()
  private _status: SignatureStatus

  constructor(
    name: string,
    dataPoints: SignatureDataPoint[],
    status: SignatureStatus = 'unknown'
  ) {
    super(dataPoints)
    this._name = name
    this._status = status
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

  public get selected(): boolean {
    return this._selected
  }

  public set selected(value: boolean) {
    this._selected = value
  }

  public get colorHex(): string {
    return this._colorHex
  }

  public set colorHex(value: string) {
    this._colorHex = value
  }

  public get status(): SignatureStatus {
    return this._status
  }

  public set status(value: SignatureStatus) {
    this._status = value
  }
}

export type SignatureStatus = 'genuine' | 'forgery' | 'train' | 'unknown'
