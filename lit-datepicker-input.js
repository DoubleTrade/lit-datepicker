/* eslint-disable no-underscore-dangle */
import { LitElement, html, css, render } from 'lit';

import format from 'date-fns/esm/format';
import parse from 'date-fns/esm/parse';
import enGB from 'date-fns/esm/locale/en-GB';
import fr from 'date-fns/esm/locale/fr';
import '@polymer/paper-material/paper-material';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-icon-button/paper-icon-button';
import { ironFlexLayoutAlignTheme, ironFlexLayoutTheme } from './iron-flex-import';
import './lit-datepicker-calendar';
import LitDatepickerBehavior from './lit-datepicker-behavior';
import './components/lit-datepicker-writable-input';
import './components/lit-datepicker-default-input';

const locales = { en: enGB, fr };

class LitDatepickerInput extends LitDatepickerBehavior(LitElement) {
  constructor() {
    super();
    this.dateFrom = null;
    this.dateTo = null;
    this.noRange = false;
    this.maxRange = 0;
    this.dateFormat = 'dd/MM/yyyy';
    this.enableYearChange = false;
    this.enableMonthChange = false;
    this.forceNarrow = false;
    this.narrow = false;
    this.locale = 'en';
    this.horizontalAlign = 'left';
    this.verticalAlign = 'top';
    this.dropdownPosition = 'fixed';
    this.verticalOffset = 0;
    this.displayGoToday = false;
    this.label = 'Date';
    this.defaultAs = 'today';
    this.writableInput = false;
  }

  static get properties() {
    return {
      html: { type: Function },
      /**
       * If setted only one date can be selected.
       */
      noRange: { type: Boolean },
      /**
       * If setted the date to can be maximum X days after the date from.
       */
      maxRange: { type: Number },
      /**
       * Force display one month.
       */
      forceNarrow: { type: Boolean },
      /**
       * If true, only one month is displayed.
       */
      narrow: { type: Boolean },
      /**
       * Set locale of the calendar.
       * Default is 'en'.
       */
      locale: { type: String },
      /**
       * Set the default date to use if no month / year is set
       * possible values: dateFrom, dateTo or today
       * default: today
       */
      defaultAs: { type: String },
      /**
       * Set month.
       * Format is MM (example: 07 for July, 12 for january).
       * Default is current month.
       */
      month: { type: String },
      monthPlus: { type: String },
      yearPlus: { type: Number },
      /**
       * Set year.
       * Default is current year.
       */
      year: { type: String },
      /**
       * Date from.
       * Format is Unix timestamp.
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
      hoveredDate: { type: String },
      enableYearChange: { type: Boolean },
      enableMonthChange: { type: Boolean },
      /**
       * Minimal date.
       * Format is Unix timestamp.
       */
      min: { type: Number },
      /**
       * Maximal date.
       * Format is Unix timestamp.
       */
      max: { type: Number },
      /**
       * Array of disabled days.
       * Format is Unix timestamp.
       */
      disabledDays: { type: Array },

      /**
       * Format of the date.
       * Default is dd/MM/yyyy.
       */
      dateFormat: { type: String },
      /**
       * The orientation against which to align the dropdown content
       * horizontally relative to the dropdown trigger.
       */
      horizontalAlign: { type: String },
      verticalAlign: { type: String },
      _isNarrow: { type: Function },
      dropdownPosition: { type: String },
      verticalOffset: { type: Number },
      /**
       * If set to true, a button will be drawn next to month name
       * to shortcut to the current month / year
       */
      displayGoToday: { type: Boolean },
      /**
       * The input label to use if html property isn't set
       */
      label: { type: String },
      /**
       * Allow to write directly into the date input
       */
      writableInput: { type: Boolean },
      /**
       * change display style to outline
       */
      outline: { type: Boolean },
    };
  }

  static get styles() {
    const mainStyle = css`
      :host {
        display: block;
        font-family: Roboto;
      }

      #firstDatePicker {
        margin-right: 16px;
      }

      iron-dropdown {
        background: var(--lit-datepicker-dropdown-background-color, white);
      }

      paper-material {
        padding: 16px;
        display: block;
      }

      #trigger {
        width: 100%;
      }
      lit-datepicker-writable-input {
        margin-top: 11px;
      }
      lit-datepicker-writable-input.outline {
        margin-top: 0px;
        padding-top: 0px;
      }
    `;
    return [mainStyle, ironFlexLayoutTheme, ironFlexLayoutAlignTheme];
  }

  render() {
    let calendar;
    if (!this.forceNarrow && !this.narrow) {
      calendar = html`
        <div class="layout vertical center-justified">
          <div class="layout horizontal">
            <lit-datepicker-calendar
              id="firstDatePicker"
              .disabledDays="${this.disabledDays}"
              .min="${this.min}"
              .max="${this.max}"
              ?enableYearChange="${this.enableYearChange}"
              ?enableMonthChange="${this.enableMonthChange}"
              .defaultAs="${this.defaultAs}"
              ?prev="${true}"
              ?noRange="${this.noRange}"
              .maxRange=${this.maxRange}
              .locale="${this.locale}"
              .month="${this.month}"
              .year="${this.year}"
              .hoveredDate="${this.hoveredDate}"
              .dateTo="${this.dateTo}"
              .dateFrom="${this.dateFrom}"
              .displayGoToday="${this.displayGoToday}"
              @hovered-date-changed="${this.hoveredDateChanged.bind(this)}"
              @date-to-changed="${this.dateToChanged.bind(this)}"
              @date-from-changed="${this.dateFromChanged.bind(this)}"
              @prev-month="${this.handlePrevMonth.bind(this)}">
            </lit-datepicker-calendar>
            <lit-datepicker-calendar
              .disabledDays="${this.disabledDays}"
              .min="${this.min}"
              .max="${this.max}"
              ?enableYearChange="${this.enableYearChange}"
              ?enableMonthChange="${this.enableMonthChange}"
              .defaultAs="${this.defaultAs}"
              ?next="${true}"
              ?noRange="${this.noRange}"
              .maxRange=${this.maxRange}
              .locale="${this.locale}"
              .month="${this.monthPlus}"
              .year="${this.yearPlus}"
              .hoveredDate="${this.hoveredDate}"
              .dateTo="${this.dateTo}"
              .dateFrom="${this.dateFrom}"
              @hovered-date-changed="${this.hoveredDateChanged.bind(this)}"
              @date-to-changed="${this.dateToChanged.bind(this)}"
              @date-from-changed="${this.dateFromChanged.bind(this)}"
              @next-month="${this.handleNextMonth.bind(this)}">
            </lit-datepicker-calendar>
          </div>
        </div>`;
    } else {
      calendar = html`
        <lit-datepicker-calendar
          .disabledDays="${this.disabledDays}"
          .min="${this.min}"
          .max="${this.max}"
          ?enableYearChange="${this.enableYearChange}"
          ?enableMonthChange="${this.enableMonthChange}"
          .defaultAs="${this.defaultAs}"
          ?prev="${true}"
          ?next="${true}"
          ?noRange="${this.noRange}"
          .maxRange=${this.maxRange}
          .month="${this.month}"
          .year="${this.year}"
          .locale="${this.locale}"
          .hoveredDate="${this.hoveredDate}"
          .dateTo="${this.dateTo}"
          .dateFrom="${this.dateFrom}"
          ?narrow="${this.narrow || this.forceNarrow}"
          .displayGoToday="${this.displayGoToday}"
          @hovered-date-changed="${this.hoveredDateChanged.bind(this)}"
          @date-to-changed="${this.dateToChanged.bind(this)}"
          @date-from-changed="${this.dateFromChanged.bind(this)}">
        </lit-datepicker-calendar>`;
    }
    return html`
      <iron-media-query query="(max-width: 650px)" @query-matches-changed="${this.queryMatchesChanged.bind(this)}"></iron-media-query>

      ${!this.html ? html`
        ${this.writableInput ? html`
          <lit-datepicker-writable-input
          .dateFrom=${this.formatDate(this.dateFrom)}
          .dateTo=${this.formatDate(this.dateTo)}
          .noRange=${this.noRange}
          .maxRange=${this.maxRange}
          .label=${this.label}
          .dateFormat=${this.dateFormat}
          .locale=${this.locale}
          @clear-date=${this._clear.bind(this)}
          @date-from-changed=${this.dateFromChanged.bind(this)}
          @date-to-changed=${this.dateToChanged.bind(this)}
          @open-dropdown=${this.handleOpenDropdown.bind(this)}
          @close-dropdown=${this.closeDropdown.bind(this)}
          .outline=${this.outline}
          class="${this.outline ? 'outline' : ''}"
          ></lit-datepicker-writable-input>
        ` : html`
          <div id="trigger" @tap="${this.handleOpenDropdown.bind(this)}"></div>
          <lit-datepicker-default-input
          .dateFrom=${this.formatDate(this.dateFrom)}
          .dateTo=${this.formatDate(this.dateTo)}
          .dateFormat=${this.dateFormat}
          .label=${this.label}
          .noRange=${this.noRange}
          .maxRange=${this.maxRange}
          @tap=${this.handleOpenDropdown.bind(this)}
          @clear-date=${this._clear.bind(this)}
          .outline=${this.outline}
          ></lit-datepicker-default-input>
        `}
      ` : html`
        <div id="trigger" @tap="${this.handleOpenDropdown.bind(this)}"></div>
      `}
      <iron-dropdown no-overlap allow-outside-scroll dynamic-align vertical-align="${this.verticalAlign}" horizontal-align="${this.horizontalAlign}">
        <paper-material slot="dropdown-content">
          ${calendar}
        </paper-material>
      </iron-dropdown>`;
  }

  updated(properties) {
    if (properties.has('year') || properties.has('month')) {
      this.monthChanged(this.month, this.year);
    }

    if (properties.has('narrow')) {
      this.dispatchEvent(new CustomEvent('narrow-changed', { detail: { value: this.narrow } }));
    }

    if (properties.has('noRange')) {
      this.noRangeChanged(this.noRange, properties.get('noRange'));
    }

    if (properties.has('locale')) {
      this.localeChanged(this.locale);
    }

    if (properties.has('dateTo')) {
      if (this.dateTo) {
        this.shadowRoot.querySelector('iron-dropdown').close();
      }
      if (this.defaultAs === 'dateTo' && this.dateTo) {
        const { month, year } = this._getMonthAndYearFromDate(new Date(this.dateTo * 1000));
        this.month = month;
        this.year = year;
      }
      if (!properties.has('dateFrom') && !properties.has('html')) {
        this.renderHtml();
      }
    }

    if (properties.has('dateFrom')) {
      if (this.noRange && this.dateFrom) {
        this.shadowRoot.querySelector('iron-dropdown').close();
      }
      if (this.defaultAs === 'dateFrom' && this.dateFrom) {
        const { month, year } = this._getMonthAndYearFromDate(new Date(this.dateFrom * 1000));
        this.month = month;
        this.year = year;
      }
      if (!properties.has('html')) {
        this.renderHtml();
      }
    }

    if (properties.has('html')) {
      this.renderHtml();
    }
  }

  _getMonthAndYearFromDate(date) {
    let month = date.getMonth() + 1;
    month = (month < 10) ? `0${month}` : month;
    const year = date.getFullYear();
    return { month, year };
  }

  firstUpdated() {
    if (this.dropdownPosition === 'absolute') {
      this.setAbsolutePositioning();
    }
  }

  _clear() {
    this.dispatchEvent(new CustomEvent('clear-date', {}));
  }

  setAbsolutePositioning() {
    const ironDropdownEl = this.shadowRoot.querySelector('iron-dropdown');
    ironDropdownEl.resetFit();
    ironDropdownEl.style.position = 'absolute';
    ironDropdownEl.style.top = this.verticalOffset;
    ironDropdownEl.style.left = '0';
    ironDropdownEl.fit();
  }

  handleOpenDropdown() {
    this.shadowRoot.querySelector('iron-dropdown').open();
  }

  closeDropdown() {
    this.shadowRoot.querySelector('iron-dropdown').close();
  }

  formatDate(date) {
    if (date) {
      const dateFn = parse(date, 't', new Date());
      if (this.dateFormat) {
        return format(
          dateFn,
          this.dateFormat,
          { locale: locales[this.locale], awareOfUnicodeTokens: true },
        );
      }
      return date;
    }
    return '';
  }

  queryMatchesChanged({ detail }) {
    this.narrow = detail.value;
  }

  hoveredDateChanged({ detail }) {
    this.hoveredDate = detail.value;
  }

  renderHtml() {
    if (this.html) {
      const trigger = this.shadowRoot.querySelector('#trigger');
      render(this.html(this.formatDate(this.dateFrom), this.formatDate(this.dateTo)), trigger);
    }
  }

  dateToChanged({ detail }) {
    this.dateTo = detail.value;
    this.dispatchEvent(new CustomEvent('date-to-changed', { detail: { value: this.dateTo } }));
    const inputs = this.shadowRoot.querySelectorAll('lit-datepicker-writable-input');
    if (inputs) {
      inputs.forEach((input) => input.clearError());
    }
    this.renderHtml();
  }

  dateFromChanged({ detail }) {
    this.dateFrom = detail.value;
    this.dispatchEvent(new CustomEvent('date-from-changed', { detail: { value: this.dateFrom } }));
    if (this.html) {
      const trigger = this.shadowRoot.querySelector('#trigger');
      render(this.html(this.dateFrom, this.dateTo), trigger);
      this.renderHtml();
    }
  }
}

window.customElements.define('lit-datepicker-input', LitDatepickerInput);
