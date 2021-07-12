import { LitElement, html, css } from 'lit';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-icons/iron-icons';
import '@polymer/paper-styles/paper-styles';
import format from 'date-fns/esm/format';
import parse from 'date-fns/esm/parse';
import addDays from 'date-fns/esm/addDays';
import endOfMonth from 'date-fns/esm/endOfMonth';
import startOfDay from 'date-fns/esm/startOfDay';
import getDay from 'date-fns/esm/getDay';
import getMonth from 'date-fns/esm/getMonth';
import getYear from 'date-fns/esm/getYear';
import addMonths from 'date-fns/esm/addMonths';
import addYears from 'date-fns/esm/addYears';
import subMonths from 'date-fns/esm/subMonths';
import subYears from 'date-fns/esm/subYears';
import enUS from 'date-fns/esm/locale/en-US';
import fr from 'date-fns/esm/locale/fr';
import { ironFlexLayoutAlignTheme, ironFlexLayoutTheme } from './iron-flex-import';
import './lit-datepicker-cell';

const locales = { en: enUS, fr };

class LitDatepickerCalendar extends LitElement {
  static get styles() {
    const mainStyle = css`
      :host {
        font-family: Roboto;
        display: block;
        width: 266px;
      }

      :host>div {
        overflow: hidden;
      }

      div.table {
        display: table;
        border-collapse: collapse;
        table-layout: fixed;
        margin-top: 10px;
      }

      div.th {
        display: table-cell;
        line-height: 20px;
        font-weight: 400;
        color: var(--lit-datepicker-day-names-text, rgb(117, 117, 117));
        font-size: 11px;
        width: 38px;
        padding: 0;
        margin: 0;
        text-align: center;
      }

      div.tr {
        display: table-row;
        height: 38px;
      }

      div.td {
        display: table-cell;
        padding: 0;
        width: 38px;
        margin: 0;
      }

      .monthName {
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
        width: 266px;
        margin: 10px 0 0 0;
        text-align: center;
        color: var(--lit-datepicker-month-text);
        height: 32px;
        overflow: hidden;
      }

      .monthName::first-letter {
        text-transform: uppercase;
      }

      .monthName>div>div {
        margin-right: 8px;
        height: 30px;
      }

      paper-listbox {
        max-height: 200px;
      }

      div.tbody {
        transition: all 0ms;
        transform: translateX(0);
        height: 235px;
      }

      .withTransition {
        transition: all 100ms;
      }

      .moveToLeft {
        transform: translateX(-274px);
      }

      .moveToRight {
        transform: translateX(274px);
      }

      .withTransition td,
      .moveToLeft td,
      .moveToRight td {
        border: none;
      }

      paper-dropdown-menu {
        width: 75px;
        padding: 0;
        height: auto;
      }

      .go-today {
        text-align: center;
        text-decoration: underline;
        font-size: 10px;
        color: var(--lit-datepicker-today-shortcut, rgb(0, 150, 136));
        height: 11px;
      }
      .go-today span {
        cursor: pointer;
      }
      .month-change {
        min-width: 130px;
      }

      .monthName paper-icon-button {
        width: 30px;
        height: 30px;
        padding: 0px;
      }
    `;
    return [mainStyle, ironFlexLayoutTheme, ironFlexLayoutAlignTheme];
  }

  render() {
    return html`
    <div>
      <div class="monthName layout horizontal center">
        ${this.prev || this.narrow || this.enableYearChange ? html`<paper-icon-button icon="chevron-left" @tap="${this.handlePrevMonth.bind(this)}"></paper-icon-button>` : null}
        <div class="flex layout horizontal center center-justified">
          ${this.enableMonthChange ? html`
            <paper-dropdown-menu class="month-change" no-label-float>
              <paper-listbox slot="dropdown-content" selected="${this.month}" @selected-changed="${this.handleMonthListChanged.bind(this)}" attr-for-selected="data-name">
                ${this.monthsList && this.monthsList.map((monthList) => html`<paper-item data-name="${monthList}">${this.computeCurrentMonthName(monthList, this.year)}</paper-item>`)}
              </paper-listbox>
            </paper-dropdown-menu>` : html`<div>${this.computeCurrentMonthName(this.month, this.year)}</div>`}
          ${this.enableYearChange ? html`
          <paper-dropdown-menu class="year-change" no-label-float>
            <paper-listbox slot="dropdown-content" selected="${this.year}" @selected-changed="${this.handleYearListChanged.bind(this)}" attr-for-selected="data-name">
              ${this.yearsList && this.yearsList.map((yearList) => html`<paper-item data-name="${yearList}">${yearList}</paper-item>`)}
            </paper-listbox>
          </paper-dropdown-menu>` : html`${this.year}`}
        </div>
        ${this.next || this.narrow || this.enableYearChange ? html`<paper-icon-button icon="chevron-right" @tap="${this.handleNextMonth.bind(this)}"></paper-icon-button>` : null}
      </div>
      <div class="go-today">
        ${this.shouldDisplayGoToday(this.displayGoToday, this.month, this.year) ? html`
          <span @tap=${this.goToday}>Aujourd'hui</span>
        ` : null}
      </div>

      <div class="table">
        <div class="thead">
          <div class="tr">
            ${this.dayNamesOfTheWeek && this.dayNamesOfTheWeek.map((dayNameOfWeek) => html`<div class="th">${dayNameOfWeek}</div>`)}
          </div>
        </div>
        <div class="tbody">
          ${this.daysOfMonth && this.daysOfMonth.map((week) => html`
          <div class="tr">
            ${week && week.map((dayOfMonth) => html`
              <div class="td ${this.tdIsEnabled(dayOfMonth)}">
                ${dayOfMonth ? html`
                  <lit-datepicker-cell
                    .disabledDays="${this.disabledDays}"
                    .min="${this.min}"
                    .max="${this.max}"
                    .month="${this.month}"
                    .hoveredDate="${this.hoveredDate}"
                    .dateTo="${this.dateTo}"
                    .dateFrom="${this.dateFrom}"
                    .day="${dayOfMonth}"
                    ?isCurrentDate="${this.isCurrentDate(dayOfMonth)}"
                    @date-is-hovered="${this.handleDateHovered.bind(this)}"
                    @date-is-selected="${this.handleDateSelected.bind(this)}"></lit-datepicker-cell>
                ` : null}
              </div>`)}
          </div>`)}
        </div>
      </div>
    </div>
`;
  }

  constructor() {
    super();
    this.dayNamesOfTheWeek = [];
    this.locale = 'en';
    this.narrow = false;
    this.yearsList = [];
    this.enableYearChange = false;
    this.enableMonthChange = false;
    this.noRange = false;
    this.maxRange = 0;
    this.currentDate = parseInt(format(startOfDay(Date.now()), 't'), 10);
    this.displayGoToday = false;
    this.defaultAs = 'today';
  }

  isCurrentDate(dayOfMonth) {
    const dayDate = dayOfMonth.date;
    return dayDate === this.currentDate;
  }

  updated(properties) {
    if (properties.has('locale')) {
      this.localeChanged();
    }
    if (properties.has('enableYearChange')) {
      this.enableYearChangeChanged(this.enableYearChange);
    }
    if (properties.has('year')) {
      this.dispatchEvent(new CustomEvent('year-changed', { detail: { value: this.year } }));
    }

    if (properties.has('year') || properties.has('month')) {
      this.yearAndMonthChanged(this.year, this.month);
    }
  }

  static get properties() {
    return {
      month: { type: String },
      prev: { type: Boolean },
      next: { type: Boolean },
      min: { type: Number },
      max: { type: Number },
      disabledDays: { type: Array },
      year: { type: String },
      dayNamesOfTheWeek: { type: Array },
      daysOfMonth: { type: Array },
      locale: { type: String },
      dateTo: { type: Number },
      dateFrom: { type: Number },
      hoveredDate: { type: Number },
      noRange: { type: Boolean },
      maxRange: { type: Number },
      narrow: { type: Boolean },
      yearsList: { type: Array },
      monthsList: { type: Array },
      enableYearChange: { type: Boolean },
      enableMonthChange: { type: Boolean },
      displayGoToday: { type: Boolean },
      defaultAs: { type: String },
    };
  }

  localeChanged() {
    if (locales[this.locale]) {
      const dayNamesOfTheWeek = [];
      let i = 0;
      for (i; i < 7; i += 1) {
        dayNamesOfTheWeek.push(locales[this.locale].localize.day(i, { width: 'short' }));
      }

      const firstDayOfWeek = locales[this.locale].options.weekStartsOn;
      const tmp = dayNamesOfTheWeek.slice().splice(0, firstDayOfWeek);
      const newDayNamesOfTheWeek = dayNamesOfTheWeek
        .slice()
        .splice(firstDayOfWeek, dayNamesOfTheWeek.length)
        .concat(tmp);
      this.dayNamesOfTheWeek = newDayNamesOfTheWeek;
    }
  }

  yearAndMonthChanged(year, month) {
    if (year && month) {
      let monthMinus = month;
      monthMinus = monthMinus.substring(monthMinus.length - 2);
      let startDateString = `01/${monthMinus}/${year}`;
      let startDateFn = parse(startDateString, 'dd/MM/yyyy', new Date(), { awareOfUnicodeTokens: true });
      const endDateFn = endOfMonth(startDateFn);
      const endDateString = format(endDateFn, 'dd/MM/yyyy', { awareOfUnicodeTokens: true });

      const firstDayOfWeek = locales[this.locale].options.weekStartsOn;

      const rows = [];
      let columns = [];

      const lastDayOfWeek = 6;

      while (startDateString !== endDateString) {
        let dayNumberFn = getDay(startDateFn) - firstDayOfWeek;
        if (dayNumberFn < 0) {
          dayNumberFn = 6;
        }

        const columnFn = {
          hover: false,
          date: parseInt(format(startDateFn, 't'), 10),
          title: parseInt(format(startDateFn, 'd', { awareOfUnicodeTokens: true }), 10),
        };
        columns.push(columnFn);

        if (dayNumberFn === lastDayOfWeek) {
          for (let i = columns.length; i < lastDayOfWeek + 1; i += 1) {
            columns.unshift(0);
          }
          rows.push(columns.slice());
          columns = [];
        }

        startDateFn = addDays(startDateFn, 1);
        startDateString = format(startDateFn, 'dd/MM/yyyy', { awareOfUnicodeTokens: true });

        if (startDateString === endDateString) {
          const endColumnFn = {
            hover: false,
            date: parseInt(format(startDateFn, 't'), 10),
            title: parseInt(format(startDateFn, 'd', { awareOfUnicodeTokens: true }), 10),
          };
          columns.push(endColumnFn);
          for (let i = columns.length; i <= lastDayOfWeek; i += 1) {
            columns.push(0);
          }
          rows.push(columns.slice());
          columns = [];
        }
      }
      this.daysOfMonth = rows;
    }
  }

  computeCurrentMonthName(month, year) {
    if (month && year) {
      const dateFn = parse(`${month}/${year}`, 'MM/yyyy', new Date());
      return format(dateFn, 'MMMM', { locale: locales[this.locale] });
    }
    return '';
  }

  tdIsEnabled(day) {
    if (day) {
      return 'enabled';
    }
    return '';
  }

  handleDateSelected({ detail }) {
    const { date } = detail;
    if (!this.noRange) {
      if (this.dateFrom && this.dateTo) {
        this.dateFrom = date;
        this.dateTo = null;
        this.hoveredDate = undefined;
        this.dispatchEvent(new CustomEvent('hovered-date-changed', { detail: { value: this.hoveredDate } }));
      } else if (!this.dateFrom || (this.dateFrom && date < this.dateFrom) || (this.maxRange > 0 && date - this.dateFrom > this.maxRange * 24 * 3600)) {
        this.dateFrom = date;
      } else if (!this.dateTo || (this.dateTo && date > this.dateTo)) {
        this.dateTo = date;
      }
    } else {
      this.dateFrom = date;
    }
    this.dispatchEvent(new CustomEvent('date-from-changed', { detail: { value: this.dateFrom } }));
    this.dispatchEvent(new CustomEvent('date-to-changed', { detail: { value: this.dateTo } }));
  }

  handleDateHovered(event) {
    if (!this.noRange) {
      this.hoveredDate = event.detail.date;
      this.dispatchEvent(new CustomEvent('hovered-date-changed', { detail: { value: this.hoveredDate } }));
    }
  }

  handleNextMonth() {
    const tbody = this.shadowRoot.querySelector('.tbody');
    const monthName = this.shadowRoot.querySelector('.monthName > div');
    tbody.classList.add('withTransition');
    tbody.classList.add('moveToLeft');
    monthName.classList.add('withTransition');
    monthName.classList.add('moveToLeft');

    const month = parse(this.month, 'MM', new Date());
    const monthPlusDate = addMonths(month, 1);
    const monthPlusString = format(monthPlusDate, 'MM', { locale: locales[this.locale] });

    this.month = monthPlusString;
    if (this.month === '01') {
      const year = parse(this.year, 'yyyy', new Date());
      const yearPlusDate = addYears(year, 1);
      const yearPlusString = format(yearPlusDate, 'yyyy', { locale: locales[this.locale] });
      this.year = yearPlusString;
    }
    this.dispatchEvent(new CustomEvent('next-month'));

    setTimeout(() => {
      tbody.classList.remove('withTransition');
      tbody.classList.add('moveToRight');
      tbody.classList.remove('moveToLeft');
      monthName.classList.remove('withTransition');
      monthName.classList.add('moveToRight');
      monthName.classList.remove('moveToLeft');

      setTimeout(() => {
        tbody.classList.add('withTransition');
        tbody.classList.remove('moveToRight');
        monthName.classList.add('withTransition');
        monthName.classList.remove('moveToRight');
        setTimeout(() => {
          tbody.classList.remove('withTransition');
          monthName.classList.remove('withTransition');
        }, 100);
      }, 100);
    }, 100);
  }

  handlePrevMonth() {
    const tbody = this.shadowRoot.querySelector('.tbody');
    const monthName = this.shadowRoot.querySelector('.monthName > div');
    tbody.classList.add('withTransition');
    tbody.classList.add('moveToRight');
    monthName.classList.add('withTransition');
    monthName.classList.add('moveToRight');

    const month = parse(this.month, 'MM', new Date());
    const monthMinusDate = subMonths(month, 1);
    const monthMinusString = format(monthMinusDate, 'MM', { locale: locales[this.locale] });

    this.month = monthMinusString;
    if (this.month === '12') {
      const year = parse(this.year, 'yyyy', new Date());
      const yearMinusDate = subYears(year, 1);
      const yearMinusString = format(yearMinusDate, 'yyyy', { locale: locales[this.locale] });
      this.year = yearMinusString;
    }
    this.dispatchEvent(new CustomEvent('prev-month'));

    setTimeout(() => {
      tbody.classList.remove('withTransition');
      tbody.classList.add('moveToLeft');
      tbody.classList.remove('moveToRight');
      monthName.classList.remove('withTransition');
      monthName.classList.add('moveToLeft');
      monthName.classList.remove('moveToRight');

      setTimeout(() => {
        tbody.classList.add('withTransition');
        tbody.classList.remove('moveToLeft');
        monthName.classList.add('withTransition');
        monthName.classList.remove('moveToLeft');
        setTimeout(() => {
          monthName.classList.remove('withTransition');
          monthName.classList.remove('withTransition');
        }, 100);
      }, 100);
    }, 100);
  }

  setYears(from, to) {
    const yearsList = [];
    for (let i = from; i <= to; i += 1) {
      yearsList.push(i);
    }
    this.yearsList = yearsList;
  }

  async firstUpdated() {
    this.monthsList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    setTimeout(() => { this.setYears(1930, 2100); });
    await this.updateComplete;
    if (this.enableYearChange) {
      const paperDropdownMenu = this.shadowRoot.querySelector('.year-change');
      paperDropdownMenu.updateStyles({
        '--paper-input-container-underline_-_display': 'none',
        '--paper-input-container-shared-input-style_-_font-weight': '500',
        '--paper-input-container-shared-input-style_-_text-align': 'right',
        '--paper-input-container-shared-input-style_-_font-size': '20px',
        '--paper-input-container_-_width': '75px',
        '--paper-input-container_-_padding': '0',
        '--paper-input-container-shared-input-style_-_color': 'var(--paper-datatable-navigation-bar-text-color, rgba(0, 0, 0, .54))',
        '--paper-input-container-input-color': 'var(--paper-datatable-navigation-bar-text-color, rgba(0, 0, 0, .54))',
        '--disabled-text-color': 'var(--paper-datatable-navigation-bar-text-color, rgba(0, 0, 0, .54))',
      });
    }
    if (this.enableMonthChange) {
      const paperDropdownMenu = this.shadowRoot.querySelector('.month-change');
      paperDropdownMenu.updateStyles({
        '--paper-input-container-underline_-_display': 'none',
        '--paper-input-container-shared-input-style_-_font-weight': '500',
        '--paper-input-container-shared-input-style_-_text-align': 'center',
        '--paper-input-container-shared-input-style_-_font-size': '20px',
        '--paper-input-container_-_width': '75px',
        '--paper-input-container_-_padding': '0',
        '--paper-input-container-shared-input-style_-_color': 'var(--paper-datatable-navigation-bar-text-color, rgba(0, 0, 0, .54))',
        '--paper-input-container-input-color': 'var(--paper-datatable-navigation-bar-text-color, rgba(0, 0, 0, .54))',
        '--disabled-text-color': 'var(--paper-datatable-navigation-bar-text-color, rgba(0, 0, 0, .54))',
      });
    }
  }

  enableYearChangeChanged(enableYearChange) {
    this.enableYearChange = enableYearChange;
  }

  handleYearListChanged({ detail }) {
    this.year = detail.value;
  }

  handleMonthListChanged({ detail }) {
    this.month = detail.value;
  }

  goToday() {
    this.month = `0${getMonth(new Date()) + 1}`.slice(-2);
    this.year = getYear(new Date());
  }

  shouldDisplayGoToday(displayGoToday, month, year) {
    return displayGoToday
      && (parseInt(month, 10) !== getMonth(new Date()) + 1
        || parseInt(year, 10) !== getYear(new Date()));
  }
}

window.customElements.define('lit-datepicker-calendar', LitDatepickerCalendar);
