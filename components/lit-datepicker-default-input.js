/* eslint-disable no-underscore-dangle */
import { LitElement, html, css } from 'lit';

import '@polymer/paper-material/paper-material';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-icon-button/paper-icon-button';
import { ironFlexLayoutAlignTheme, ironFlexLayoutTheme } from '../iron-flex-import';


class LitDatepickerDefaultInput extends LitElement {
  constructor() {
    super();
    this.dateFrom = null;
    this.dateTo = null;
    this.noRange = false;
    this.dateFormat = 'dd/MM/yyyy';
  }

  static get properties() {
    return {
      noRange: { type: Boolean },
      /**
       * Force display one month.
       */
      dateFrom: { type: String },
      /**
       * Date to.
       * Format is Unix timestamp.
       */
      dateTo: { type: String },
      /**
       * Format of the date.
       * Default is dd/MM/yyyy.
       */
      dateFormat: { type: String },
      /**
       * The input label to use if html property isn't set
       */
      label: { type: String },
      outline: { type: Boolean },
    };
  }

  static get styles() {
    const mainStyle = css`
      paper-input {
        --paper-input-container-underline_-_border-bottom: 1px solid var(--dt-contract-input-underline-color, #ebedf2);
      }

      paper-icon-button[icon="clear"] {
        width: 24px;
        height: 24px;
        padding: 0;
        color: var(--paper-grey-600);
      }
      .dateInput {
        min-width: 220px
      }
    `;
    return [mainStyle, ironFlexLayoutTheme, ironFlexLayoutAlignTheme];
  }

  render() {
    return html`
      <paper-input class="dateInput" .label="${this.label}" .value="${this._computeDateLabel(this.dateFrom, this.dateTo)}" readonly>
        <paper-icon-button icon="clear" slot="suffix" @tap="${this._clear.bind(this)}"></paper-icon-button>
      </paper-input>`;
  }

  _computeDateLabel(dateFrom, dateTo) {
    if (!this.noRange) {
      if (dateFrom && dateTo) {
        return `${dateFrom} - ${dateTo}`;
      }
      return '';
    }
    return dateFrom || '';
  }

  _clear() {
    this.dispatchEvent(new CustomEvent('clear-date', {}));
  }
}

window.customElements.define('lit-datepicker-default-input', LitDatepickerDefaultInput);
