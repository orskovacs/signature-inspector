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
  @consume({ context: signaturesContext, subscribe: true })
  private signatures!: SignatureData[]

  render() {
    return html`<canvas
      width="500px"
      height="200px"
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
    context.clearRect(0, 0, 500, 200)
    signatures.forEach((s) => {
      context.strokeStyle = `#${s.colorHex}`
      context.lineCap = 'round'

      context.beginPath()
      context.moveTo(
        s.signature.dataPoints[0].xCoord,
        s.signature.dataPoints[0].yCoord
      )

      s.signature.dataPoints.slice(1).forEach((p) => {
        const pointSize = 0.1 + p.pressure * 7
        const [x, y] = [p.xCoord, p.yCoord]

        context.lineWidth = pointSize
        context.lineTo(x, y)
        context.stroke()
        context.beginPath()
        context.moveTo(x, y)
      })
    })
  })
}
