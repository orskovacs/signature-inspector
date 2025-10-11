import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('color-input-element')
export class ColorInputElement extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      border-radius: 10px;
      width: 60px;
      height: 20px;
      box-sizing: border-box;
      border: 1px solid var(--md-sys-color-outline);
      position: relative;
      cursor: pointer;
    }

    :host div {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    label.color-input-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    input[type='color'] {
      min-width: 200%;
      min-height: 200%;
      border: none;
      background: none;
      cursor: pointer;
    }
  `

  @property({ type: String, reflect: true })
  public value: string = '#000000'

  @property({ type: String, reflect: true })
  public id!: string

  render() {
    return html`<div>
      <input
        type="color"
        .id="${this.id}"
        .value="${this.value}"
        @input=${(e: Event) => {
          if (!(e.target instanceof HTMLInputElement)) return

          const newColor = e.target.value.slice(1)
          this.dispatchEvent(new ColorChangeEvent(newColor))
        }}
      />
    </div>`
  }
}

export class ColorChangeEvent extends CustomEvent<string> {
  public static readonly key = 'change'

  constructor(color: string) {
    super(ColorChangeEvent.key, {
      bubbles: true,
      composed: true,
      detail: color,
    })
  }
}

type CustomEventMap = {
  [ColorChangeEvent.key]: ColorChangeEvent
}

declare global {
  interface HTMLElement {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void
    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void
  }
}
