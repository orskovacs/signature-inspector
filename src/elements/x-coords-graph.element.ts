import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { ref } from 'lit/directives/ref.js'
import { getMockChartData } from '../mock/chart-data.mock'

@customElement('x-coords-graph-element')
export class XCoordsGraphElement extends LitElement {
  render() {
    return html`<div ${setupChart()}></div>`
  }
}

function setupChart() {
  return ref((instance) => {
    if (!instance) {
      return
    }

    const div = instance as HTMLDivElement
    google.charts.setOnLoadCallback(() => {
      const chart = new google.visualization.LineChart(div)
      const { data, options } = getMockChartData()
      chart.draw(data, options)
    })
  })
}
