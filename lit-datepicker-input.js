import { LitElement, html, css } from 'lit-element';
import { render } from 'lit-html';

import format from 'date-fns/esm/format';
import parse from 'date-fns/esm/parse';
import enGB from 'date-fns/esm/locale/en-GB';
import fr from 'date-fns/esm/locale/fr';
import { ironFlexLayoutAlignTheme, ironFlexLayoutTheme } from './iron-flex-import';
import '@polymer/paper-material/paper-material';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';
import './lit-datepicker-calendar';
import LitDatepickerBehavior from './lit-datepicker-behavior';

const locales = { en: enGB, fr };

class LitDatepickerInput extends LitDatepickerBehavior(LitElement) {
  constructor() {
    super();
    this.dateFrom = null;
    this.dateTo = null;
    this.noRange = false;
    this.dateFormat = 'dd/MM/yyyy';
    this.enableYearChange = false;
    this.forceNarrow = false;
    this.narrow = false;
    this.locale = 'en';
    this.horizontalAlign = 'left';
    this.verticalAlign = 'top';
    this.dropdownPosition = 'fixed';
    this.verticalOffset = 0;
  }

  static get properties() {
    return {
      html: { type: Function },
      /**
       * If setted only one date can be selected.
       */
      noRange: { type: Boolean },
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
        background: white;
      }

      paper-material {
        padding: 16px;
        display: block;
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
              ?prev="${true}"
              ?noRange="${this.noRange}"
              .locale="${this.locale}"
              .month="${this.month}"
              .year="${this.year}"
              .hoveredDate="${this.hoveredDate}"
              .dateTo="${this.dateTo}"
              .dateFrom="${this.dateFrom}"
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
              ?next="${true}"
              ?noRange="${this.noRange}"
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
          ?prev="${true}"
          ?next="${true}"
          ?noRange="${this.noRange}"
          .month="${this.month}"
          .year="${this.year}"
          .locale="${this.locale}"
          .hoveredDate="${this.hoveredDate}"
          .dateTo="${this.dateTo}"
          .dateFrom="${this.dateFrom}"
          ?narrow="${this.narrow || this.forceNarrow}"
          @hovered-date-changed="${this.hoveredDateChanged.bind(this)}"
          @date-to-changed="${this.dateToChanged.bind(this)}"
          @date-from-changed="${this.dateFromChanged.bind(this)}">
        </lit-datepicker-calendar>`;
    }

    return html`
      <iron-media-query query="(max-width: 650px)" @query-matches-changed="${this.queryMatchesChanged.bind(this)}"></iron-media-query>

      <div id="trigger" @tap="${this.handleOpenDropdown.bind(this)}"></div>

      <iron-dropdown no-overlap allow-outside-scroll vertical-align="${this.verticalAlign}" horizontal-align="${this.horizontalAlign}">
        <paper-material slot="dropdown-content">
          ${calendar}
        </paper-material>
      </iron-dropdown>`;
  }

  updated(properties) {

    if (properties.has('month') || properties.has('year')) {
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
    }

    if (properties.has('dateFrom')) {
      if (this.noRange && this.dateFrom) {
        this.shadowRoot.querySelector('iron-dropdown').close();
      }
    }

    if (properties.has('html')) {
      this.renderHtml();
    }
  }

  firstUpdated() {
    if (this.dropdownPosition === 'absolute') {
      this.setAbsolutePositioning();
    }
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
    const trigger = this.shadowRoot.querySelector('#trigger');
    render(this.html(this.formatDate(this.dateFrom), this.formatDate(this.dateTo)), trigger);
  }

  dateToChanged({ detail }) {
    this.dateTo = detail.value;
    this.dispatchEvent(new CustomEvent('date-to-changed', { detail: { value: this.dateTo } }));
    this.renderHtml();
  }

  dateFromChanged({ detail }) {
    this.dateFrom = detail.value;
    this.dispatchEvent(new CustomEvent('date-from-changed', { detail: { value: this.dateFrom } }));
    const trigger = this.shadowRoot.querySelector('#trigger');
    render(this.html(this.dateFrom, this.dateTo), trigger);
    this.renderHtml();
  }
}

window.customElements.define('lit-datepicker-input', LitDatepickerInput);
