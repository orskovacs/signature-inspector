import { Signature } from '../model/signature.ts'

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
