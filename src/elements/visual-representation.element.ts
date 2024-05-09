import { consume } from '@lit/context'
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import {
  signaturesContext,
  SignatureData,
} from '../contexts/signatures.context'
import { ref } from 'lit/directives/ref.js'

@customElement('visual-representation-element')
export class VisualRepresentationElement extends LitElement {
  static readonly canvasWidth = 700
  static readonly canvasHeight = 200

  @consume({ context: signaturesContext, subscribe: true })
  private signatures!: SignatureData[]

  render() {
    return html`<canvas
      width="${VisualRepresentationElement.canvasWidth}px"
      height="${VisualRepresentationElement.canvasHeight}px"
      ${setupCanvas(this.signatures.filter((s) => s.visible))}
    ></canvas>`
  }
}

function setupCanvas(signatures: SignatureData[]) {
  return ref((element) => {
    if (!(element instanceof HTMLCanvasElement)) {
      return
    }

    const context = element.getContext('2d')!
    context.clearRect(
      0,
      0,
      VisualRepresentationElement.canvasWidth,
      VisualRepresentationElement.canvasHeight
    )
    signatures.forEach((s) => {
      context.strokeStyle = `#${s.colorHex}`
      context.lineCap = 'round'

      const xMax = Math.max(...s.signature.dataPoints.map((p) => p.xCoord))
      const yMax = Math.max(...s.signature.dataPoints.map((p) => p.yCoord))

      const xStart =
        (s.signature.dataPoints[0].xCoord / xMax) *
        VisualRepresentationElement.canvasWidth
      const yStart =
        (s.signature.dataPoints[0].xCoord / yMax) *
        VisualRepresentationElement.canvasHeight

      context.beginPath()
      context.moveTo(xStart, yStart)

      s.signature.dataPoints.slice(1).forEach((p) => {
        const pressure = p.pressure <= 1 ? p.pressure : p.pressure / 1000
        const pointSize = 0.1 + pressure * 7
        const [x, y] = [
          (p.xCoord / xMax) * VisualRepresentationElement.canvasWidth,
          (p.yCoord / yMax) * VisualRepresentationElement.canvasHeight,
        ]

        context.lineWidth = pointSize
        context.lineTo(x, y)
        context.stroke()
        context.beginPath()
        context.moveTo(x, y)
      })
    })
  })
}
