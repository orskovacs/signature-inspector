import { customElement } from 'lit/decorators.js'
import { css, html, LitElement } from 'lit'

@customElement('header-element')
export class HeaderElement extends LitElement {
  static styles = css`
    :host {
      --md-dialog-container-color: var(--md-sys-color-surface);
      --md-sys-color-surface-container: var(--md-sys-color-surface-variant);
    }

    header {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
      font-family: var(--md-ref-typeface-brand);
      padding-inline: 24px;
      padding-block: 8px;
    }

    .buttons {
      display: flex;
      gap: 8px;
    }
  `

  render() {
    return html`
      <header>
        <signer-selector-element></signer-selector-element>
        <div class="buttons">
          <signature-capture-element></signature-capture-element>
          <signature-files-loader-element></signature-files-loader-element>
          <signature-database-importer-element></signature-database-importer-element>
        </div>
      </header>
    `
  }
}
