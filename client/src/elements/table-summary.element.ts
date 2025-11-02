import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { signaturesContext } from '../contexts/signatures.context'
import { consume } from '@lit/context'
import { Signature } from '../model/signature.ts'

@customElement('table-summary-element')
export class TableSummaryElement extends LitElement {
  static styles = css`
    thead {
      position: sticky;
      top: 0;
    }

    google-chart {
      width: 100%;
      height: 100%;
      color: #1d1b20;
    }
  `

  @consume({ context: signaturesContext, subscribe: true })
  private signatures!: Signature[]

  private get visibleSignatures(): Signature[] {
    return this.signatures.filter((s) => s.visible)
  }

  render() {
    if (this.visibleSignatures.length !== 1) {
      return html`<div style="font-style: oblique">
        Select one and only one signature
      </div>`
    }

    const signature = this.visibleSignatures[0]

    const options: google.visualization.TableOptions = {
      showRowNumber: false,
      width: '100%',
      height: '100%',
    }

    const data: (number | string)[][] = [
      [
        'Timestamp',
        'X Coordinate',
        'Y Coordinate',
        'Pressure',
        'Altitude Angle',
        'Azimuth Angle',
      ],
    ]

    const rows = signature.dataPoints.map((p) => [
      p.timeStamp,
      p.xCoord,
      p.yCoord,
      p.pressure,
      p.altitudeAngle,
      p.azimuthAngle,
    ])
    data.push(...rows)

    return html`<google-chart
      type="table"
      options=${JSON.stringify(options)}
      data=${JSON.stringify(data)}
    ></google-chart>`
  }
}
