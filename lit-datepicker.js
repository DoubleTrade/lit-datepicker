import { LitElement, html, css } from 'lit';
import { ironFlexLayoutAlignTheme, ironFlexLayoutTheme } from './iron-flex-import';
import LitDatepickerBehavior from './lit-datepicker-behavior';
import './lit-datepicker-calendar';

class LitDatepicker extends LitDatepickerBehavior(LitElement) {
  static get styles() {
    const mainStyle = css`
      :host {
        font-family: Roboto;
        display: block;
      }

      #firstDatePicker {
        margin-right: 16px;
      }`;
    return [mainStyle, ironFlexLayoutTheme, ironFlexLayoutAlignTheme];
  }

  render() {
    return html`
    <iron-media-query query="(max-width: 650px)" @query-matches-changed="${this.queryMatchesChanged.bind(this)}"></iron-media-query>

    ${!this.forceNarrow && !this.narrow ? html`
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
            ?enableMonthChange="${this.enableMonthChange}"
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
      </div>` : html`
        <lit-datepicker-calendar
          .disabledDays="${this.disabledDays}"
          .min="${this.min}"
          .max="${this.max}"
          ?enableYearChange="${this.enableYearChange}"
          ?enableMonthChange="${this.enableMonthChange}"
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
      </lit-datepicker-calendar>`}
`;
  }

  constructor() {
    super();
    this.noRange = false;
    this.forceNarrow = false;
    this.narrow = false;
    this.locale = 'en';
    this.enableYearChange = false;
    this.enableMonthChange = false;
    this.defaultAs = 'today';
  }

  updated(properties) {
    if (properties.has('month') || properties.has('year')) {
      this.monthChanged(this.month, this.year);
    }

    if (properties.has('noRange')) {
      this.noRangeChanged(this.noRange, properties.get('noRange'));
    }

    if (properties.has('narrow')) {
      this.dispatchEvent(new CustomEvent('narrow-changed', { detail: { value: this.narrow } }));
    }

    if (properties.has('locale')) {
      this.localeChanged(this.locale);
    }
  }

  static get properties() {
    return {
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
      _monthPlus: { type: String },
      _yearPlus: { type: Number },
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
       * Set the default date to use if no month / year is set
       * possible values: dateFrom, dateTo or today
       * default: today
       */
      defaultAs: { type: String },
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
    };
  }

  queryMatchesChanged({ detail }) {
    this.narrow = detail.value;
  }

  hoveredDateChanged({ detail }) {
    this.hoveredDate = detail.value;
  }

  dateToChanged({ detail }) {
    this.dateTo = detail.value;
    this.dispatchEvent(new CustomEvent('date-to-changed', { detail: { value: this.dateTo } }));
  }

  dateFromChanged({ detail }) {
    this.dateFrom = detail.value;
    this.dispatchEvent(new CustomEvent('date-from-changed', { detail: { value: this.dateFrom } }));
  }
}

window.customElements.define('lit-datepicker', LitDatepicker);
