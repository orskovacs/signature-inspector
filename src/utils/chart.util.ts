import { SignatureData } from '../contexts/signatures.context'

export function setupSignatureChart(
  element: Element,
  signatures: SignatureData[],
  feature: keyof SignatureData['signature']['dataPoints'][number]
) {
  google.charts.setOnLoadCallback(() => {
    const chart = new google.visualization.LineChart(element)
    const data = new google.visualization.DataTable()

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

    const options: google.visualization.LineChartOptions = {
      titlePosition: 'none',
      colors: signatures.map((s) => `#${s.colorHex}`),
      explorer: { keepInBounds: true },
      chartArea: { left: 4, top: 4, height: '90%', width: '80%' },
    }

    chart.draw(data, options)
  })
}
