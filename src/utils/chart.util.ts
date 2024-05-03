import { SignatureData } from '../contexts/signatures.context'

export function setupSignatureChart(
  element: Element,
  signatures: SignatureData[],
  feature: keyof SignatureData['signature']['dataPoints'][number]
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
        data.addColumn(
          'number',
          new Date(s.signature.creationTimeStamp).toLocaleString()
        )
      })

      const rowCount = Math.max(
        ...signatures.map((s) => s.signature.dataPoints.length)
      )

      for (let i = 0; i < rowCount; i++) {
        const rowData = [i]
        signatures.forEach((s) => {
          const dataPoint: number | undefined =
            s.signature.dataPoints[i]?.[feature]
          rowData.push(dataPoint)
        })
        data.addRow(rowData)
      }
    }

    chart.draw(data, options)
  })
}
