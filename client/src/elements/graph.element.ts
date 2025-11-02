import { LitElement, css, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { signaturesContext } from '../contexts/signatures.context'
import { consume } from '@lit/context'
import { SignatureDataPoint } from 'signature-field'
import { normalizeDataContext } from '../contexts/normalize-data.context'
import { Signature } from '../model/signature.ts'
import { GoogleChart } from '@google-web-components/google-chart'
import {
  getFeatureDataFromSignature,
  standardize,
} from '../utils/signature.util.ts'
import LineChartOptions = google.visualization.LineChartOptions

@customElement('graph-element')
export class GraphElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      background-color: #ffffff;
    }

    google-chart {
      width: 100%;
      height: 100%;
    }
  `

  @property({ type: String })
  public feature!: keyof SignatureDataPoint

  @consume({ context: signaturesContext, subscribe: true })
  private signatures!: Signature[]

  private get visibleSignatures(): Signature[] {
    return this.signatures.filter((signature) => signature.visible)
  }

  @consume({ context: normalizeDataContext, subscribe: true })
  public normalizeData!: boolean

  @query('#chart')
  private chart?: GoogleChart

  private readonly elementResizeObserver = new ResizeObserver((entries) => {
    if (this.chart === null || this.chart === undefined) return

    this.chart.style.width = `${entries[0].contentBoxSize[0].inlineSize}px`
    this.chart.style.height = `${entries[0].contentBoxSize[0].blockSize}px`
    this.chart.redraw()
  })

  override connectedCallback(): void {
    super.connectedCallback()

    this.elementResizeObserver.observe(this as unknown as Element)
  }

  override disconnectedCallback() {
    super.disconnectedCallback()

    this.elementResizeObserver.disconnect()
  }

  render() {
    const options: LineChartOptions = {
      titlePosition: 'none',
      colors:
        this.visibleSignatures.length > 0
          ? this.visibleSignatures.map((s) => `#${s.colorHex}`)
          : ['#ffffff'],
      explorer: { keepInBounds: true },
      vAxis: { title: featureNames[this.feature] },
      hAxis: { title: 'Time' },
      chartArea: { left: 100, top: 30, height: '76%' },
    }

    const data: (string | number)[][] = [['Point in time']]

    if (this.visibleSignatures.length === 0) {
      options.hAxis!.minValue = 0
      options.hAxis!.maxValue = 10
      data[0].push('')
      data.push([0, 0])
    } else {
      data[0].push(...this.visibleSignatures.map((s) => s.name))

      const rowCount = Math.max(
        ...this.visibleSignatures.map((s) => s.dataPoints.length)
      )

      for (let i = 0; i < rowCount; i++) {
        const rowData = [i]
        this.visibleSignatures.forEach((s) => {
          const featureData = this.normalizeData
            ? standardize(getFeatureDataFromSignature(s, this.feature))
            : getFeatureDataFromSignature(s, this.feature)

          const dataPoint: number | undefined = featureData[i]
          rowData.push(dataPoint)
        })
        data.push(rowData)
      }
    }

    return html`<google-chart
      id="chart"
      type="line"
      options=${JSON.stringify(options)}
      data="${JSON.stringify(data)}"
    >
    </google-chart>`
  }
}

const featureNames: Record<keyof SignatureDataPoint, string> = {
  timeStamp: 'Timestamp',
  xCoord: 'X Coordinate',
  yCoord: 'Y Coordinate',
  pressure: 'Pressure',
  altitudeAngle: 'Altitude Angle',
  azimuthAngle: 'Azimuth Angle',
  height: 'Height',
  twist: 'Twist',
}
