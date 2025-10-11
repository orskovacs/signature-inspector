import { getFeatureDataFromSignature, standardize } from './signature.util'
import { Signature } from '../model/signature.ts'
import { SignatureDataPoint } from 'signature-field'

export function setupSignatureFeatureChart(
  element: Element,
  signatures: Signature[],
  feature: keyof SignatureDataPoint,
  normalizeData: boolean
) {
  google.charts.setOnLoadCallback(() => {
    const chart = new google.visualization.LineChart(element)
    const data = new google.visualization.DataTable()
    const options: google.visualization.LineChartOptions = {
      titlePosition: 'none',
      colors:
        signatures.length > 0
          ? signatures.map((s) => `#${s.colorHex}`)
          : ['#ffffff'],
      explorer: { keepInBounds: true },
      chartArea: { left: 4, top: 4, height: '90%', width: '80%' },
      hAxis: {},
    }

    if (signatures.length === 0) {
      options.hAxis!.minValue = 0
      options.hAxis!.maxValue = 10
      data.addColumn('number', 'Time')
      data.addColumn('number', '')
    } else {
      data.addColumn('number', 'Time')
      signatures.forEach((s) => {
        data.addColumn('number', s.name)
      })

      const rowCount = Math.max(...signatures.map((s) => s.dataPoints.length))

      for (let i = 0; i < rowCount; i++) {
        const rowData = [i]
        signatures.forEach((s) => {
          const featureData = normalizeData
            ? standardize(getFeatureDataFromSignature(s, feature))
            : getFeatureDataFromSignature(s, feature)

          const dataPoint: number | undefined = featureData[i]
          rowData.push(dataPoint)
        })
        data.addRow(rowData)
      }
    }

    chart.draw(data, options)
  })
}

export function setupSignatureSummaryTable(
  element: Element,
  signature: Signature
) {
  google.charts.setOnLoadCallback(() => {
    const data = new google.visualization.DataTable()
    data.addColumn('number', 'Timestamp')
    data.addColumn('number', 'X Coordinate')
    data.addColumn('number', 'Y Coordinate')
    data.addColumn('number', 'Pressure')
    data.addColumn('number', 'Altitude angle')
    data.addColumn('number', 'Azimuth angle')

    const rows = signature.dataPoints.map((p) => [
      p.timeStamp,
      p.xCoord,
      p.yCoord,
      p.pressure,
      p.altitudeAngle,
      p.azimuthAngle,
    ])
    data.addRows(rows)

    const options: google.visualization.TableOptions = {
      showRowNumber: true,
      width: '100%',
      height: '100%',
    }

    const table = new google.visualization.Table(element)
    table.draw(data, options)
  })
}
