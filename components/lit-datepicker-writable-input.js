/* eslint-disable no-underscore-dangle */
import { LitElement, html, css } from 'lit';

import '@polymer/paper-material/paper-material';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-icon-button/paper-icon-button';
import { ironFlexLayoutAlignTheme, ironFlexLayoutTheme } from '../iron-flex-import';
import './date-input';

class LitDatepickerWritableInput extends LitElement {
  constructor() {
    super();
    this.dateFrom = null;
    this.dateTo = null;
    this.noRange = false;
    this.dateFormat = 'dd/MM/yyyy';
    this._valuesHadChanged = false;
  }

  static get properties() {
    return {
      /**
       * If setted only one date can be selected.
       */
      noRange: { type: Boolean },
      maxRange: { type: Number },
      /**
       * Set the default date to use if no month / year is set
       * possible values: dateFrom, dateTo or today
       * default: today
       */
      dateFrom: { type: String },
      /**
       * Date to.
       * Format is Unix timestamp.
       */
      dateTo: { type: String },
      /**
       * Current hovered date.
       * Format is Unix timestamp.
       */
      min: { type: Number },
      /**
       * Maximal date.
       * Format is Unix timestamp.
       */
      max: { type: Number },
      /**
       * Format of the date.
       * Default is dd/MM/yyyy.
       */
      dateFormat: { type: String },
      /**
       * The input label to use if html property isn't set
       */
      label: { type: String },
      _valuesHadChanged: { type: Boolean },
      /**
       * Set locale for errors display.
       * Default is 'en'.
       */
      locale: { type: String },
      outline: { type: Boolean },
    };
  }

  static get styles() {
    const mainStyle = css`
      :host {
        display: block;
        padding-top: 16px;
        position: relative;
      }
      .date-input-container {
        display: flex;
        justify-content: center;
        width: fit-content;
        align-items: flex-start;
      }
      .date-input-container paper-icon-button {
        margin-top: 4px;
        margin-right: 8px;
        width: 24px;
        height: 24px;
        padding: 0;
        color: var(--paper-grey-600);
      }
      .date-input-container paper-icon-button[icon="save"] {
        color: var(--primary-color, var(--paper-grey-600));
      }
      label {
        position: absolute;
        top: 0px;
        left: 0px;
        font-weight: 400;
        font-size: 13px;
        font-family: "Roboto";
        line-height: 15px;
        overflow: hidden;
        white-space: no-wrap;
        text-overflow: ellipsis;
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }

      .outline:hover label {
        color: var(--lit-datepicker-outline-hover-color, black);
      }
      .outline:hover {
        border-color: var(--lit-datepicker-outline-hover-border-color, black);
      }

      .outline {
        border: var(--dt-input-border-width, 2px) solid var(--dt-input-border-color, rgba(0, 0, 0, var(--dark-divider-opacity)));
        border-radius: var(--dt-input-border-radius, 5px);
        padding: 13px 10px 10px 15px;
      }

      .outline label {
        background-color: var(--input-outlined-background-color, white);
        top: -8px;
        left: 15px;
        padding: 0 6px
      }

      paper-icon-button.action:hover {
        color: var(--primary-color, black);
      }
      `;
    return [ironFlexLayoutTheme, ironFlexLayoutAlignTheme, mainStyle];
  }

  render() {
    return html`
    <div class="${this.outline ? 'outline' : ''}">
      <label>${this.label}</label>
      <div class="date-input-container">
        <lit-datepicker-date-input id="date-from-input"
          .date=${this.dateFrom}
          .min=${this.min}
          .max=${this.max}
          .language=${this.locale}
          .outline=${this.outline}
          @end-of-input=${this.focusNext.bind(this)}
          @validate=${this._saveValues.bind(this)}
          @date-changed=${this._handleValuesHadChanged.bind(this)}
        ></lit-datepicker-date-input>
        ${!this.noRange ? html`
          <lit-datepicker-date-input id="date-to-input"
            .date=${this.dateTo}
            .min=${this.min}
            .max=${this.max}
            .language=${this.locale}
            .outline=${this.outline}
            @focus-prev=${this.focusPrev.bind(this)}
            @validate=${this._saveValues.bind(this)}
            @date-changed=${this._handleValuesHadChanged.bind(this)}
          ></lit-datepicker-date-input>
        ` : null}
        ${this._valuesHadChanged ? html`
          <paper-icon-button class="action" icon="save" @tap="${this._saveValues.bind(this)}"></paper-icon-button>
        ` : html`
          <paper-icon-button class="action" icon="today" @tap="${this.handleOpenDropdown.bind(this)}"></paper-icon-button>
        `}
        <paper-icon-button icon="clear" @tap="${this._clear.bind(this)}"></paper-icon-button>
      </div>
    </div>`;
  }

  focusNext({ currentTarget }) {
    if (!currentTarget) {
      return;
    }
    const next = currentTarget.nextElementSibling;
    if (!next) {
      return;
    }
    if (next.tagName.toLowerCase() === 'lit-datepicker-date-input') {
      next.focus();
      next.select();
      return;
    }
    this.focusNext(next);
  }

  focusPrev({ currentTarget }) {
    if (!currentTarget) {
      return;
    }
    const previous = currentTarget.previousElementSibling;
    if (!previous) {
      return;
    }
    if (previous.tagName.toLowerCase() === 'lit-datepicker-date-input') {
      previous.focus();
      previous.selectLast();
      return;
    }
    this.focusPrev(previous);
  }

  _clear() {
    this.shadowRoot.querySelector('#date-from-input').clear();
    const dateToInput = this.shadowRoot.querySelector('#date-to-input');
    if (dateToInput) {
      dateToInput.clear();
    }
    this._valuesHadChanged = false;
    this.dispatchEvent(new CustomEvent('clear-date', {}));
  }

  handleOpenDropdown() {
    this.dispatchEvent(new CustomEvent('open-dropdown'));
  }

  _handleValuesHadChanged() {
    this._valuesHadChanged = true;
  }

  _saveValues() {
    const dateFrom = this.shadowRoot.querySelector('#date-from-input').getDate();
    if (dateFrom) {
      if (this.noRange) {
        this.dispatchEvent(new CustomEvent('date-from-changed', { detail: { value: dateFrom } }));
        this._valuesHadChanged = false;
      } else {
        const dateTo = this.shadowRoot.querySelector('#date-to-input').getDate();
        if (dateTo) {
          if (dateFrom > dateTo
            || (this.maxRange && dateTo - dateFrom > this.maxRange * 24 * 3600)) {
            this.shadowRoot.querySelector('#date-to-input').setError('RANGE_ERROR');
          } else {
            this.dispatchEvent(new CustomEvent('date-from-changed', { detail: { value: dateFrom } }));
            this.dispatchEvent(new CustomEvent('date-to-changed', { detail: { value: dateTo } }));
            this._valuesHadChanged = false;
          }
        }
      }
    }
  }

  clearError() {
    const dateToInput = this.shadowRoot.querySelector('#date-to-input');
    if (dateToInput) {
      dateToInput.clearError();
    }
  }
}

window.customElements.define('lit-datepicker-writable-input', LitDatepickerWritableInput);
