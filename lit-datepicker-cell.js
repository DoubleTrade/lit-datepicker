import { LitElement, html, css } from 'lit';
import startOfDay from 'date-fns/esm/startOfDay';
import getTime from 'date-fns/esm/getTime';
import { ironFlexLayoutAlignTheme, ironFlexLayoutTheme } from './iron-flex-import';

class LitDatepickerCell extends LitElement {
  static get styles() {
    const mainStyle = css`
      :host {
        font-family: Roboto;
        display: block;
        width: 38px;
      }

      .day {
        text-align: center;
        height: 38px;
        width: 38px;
        margin: 0;
        padding: 0;
        color: var(--lit-datepicker-cell-text);
      }

      .day:not(.disabled):hover {
        background: var(--lit-datepicker-cell-hover, #e4e7e7);
        cursor: pointer;
      }

      .day.hovered {
        background: var(--lit-datepicker-cell-hovered, rgba(0, 150, 136, 0.5)) !important;
        color: var(--lit-datepicker-cell-hovered-text, white);
      }

      .day.selected {
        background: var(--lit-datepicker-cell-selected, rgb(0, 150, 136)) !important;
        color: var(--lit-datepicker-cell-selected-text, white);
        ;
      }

      .day.currentDate .currentDayMarker {
        width: 80%;
        height: 80%;
        font-weight: var(--current-day-font-weight, bold);;
        border-radius: 50%;
        background-color: var(--current-day-background-color);
        color: var(--current-day-color);
      }

      .day.disabled {
        opacity: 0.4;
      }`;
    return [mainStyle, ironFlexLayoutTheme, ironFlexLayoutAlignTheme];
  }

  render() {
    return html`
      <div
        @click="${this.handleTap.bind(this)}"
        @mouseover="${this.handleHover.bind(this)}"
        class="layout horizontal center center-justified day ${this.isCurrentDate ? 'currentDate' : null} ${this.isSelected(this.selected)} ${this.isHovered(this.hovered)} ${this.isEnabled(this.day, this.min, this.max, this.disabledDays)}">
        <div class="layout horizontal center center-justified currentDayMarker">
          ${this.day ? this.day.title : null}
        </div>
    </div>
`;
  }

  constructor() {
    super();
    this.selected = false;
    this.hovered = false;
    this.disabled = false;
    this.isCurrentDate = false;
    this.disabledDays = [];
  }

  static get properties() {
    return {
      day: { type: Object },
      selected: { type: Boolean },
      hovered: { type: Boolean },
      dateTo: { type: Number },
      dateFrom: { type: Number },
      month: { type: String },
      hoveredDate: { type: Number },
      min: { type: Number },
      max: { type: Number },
      disabled: { type: Boolean },
      isCurrentDate: { type: Boolean },
      disabledDays: { type: Array },
    };
  }

  updated(properties) {
    if (properties.has('dateFrom') || properties.has('dateTo') || properties.has('hoveredDate') || properties.has('day')) {
      this.dateChanged(this.dateFrom, this.dateTo, this.hoveredDate, this.day);
    }
  }

  dateChanged(dateFrom, dateTo, hoveredDate, day) {
    this.selected = false;
    this.hovered = false;
    const parsedDateFrom = parseInt(dateFrom, 10);
    const parsedDateTo = parseInt(dateTo, 10);
    if (day) {
      if (getTime(startOfDay(parsedDateTo * 1000)) / 1000 === day.date
        || getTime(startOfDay(parsedDateFrom * 1000)) / 1000 === day.date) {
        this.selected = true;
      }
      if (
        ((hoveredDate === day.date || day.date < hoveredDate)
          && day.date > parsedDateFrom
          && !parsedDateTo
          && !Number.isNaN(parsedDateFrom)
          && parsedDateFrom !== undefined
          && !this.selected)
        || (day.date > parsedDateFrom && day.date < parsedDateTo)
      ) {
        this.hovered = true;
      }
    }
  }

  handleTap() {
    if (!this.disabled) {
      this.dispatchEvent(new CustomEvent('date-is-selected', {
        detail: { date: this.day.date },
      }));
    }
  }

  handleHover() {
    this.dispatchEvent(new CustomEvent('date-is-hovered', {
      detail: { date: this.day.date },
    }));
  }

  isSelected(selected) {
    if (selected) {
      return 'selected';
    }
    return '';
  }

  isHovered(hovered) {
    if (hovered) {
      return 'hovered';
    }
    return '';
  }

  isEnabled(day, min, max, disabledDays) {
    this.disabled = false;
    if (disabledDays && day && day.date) {
      if (
        day.date < min
        || day.date > max
        || disabledDays.findIndex((disabledDay) => parseInt(disabledDay, 10) === day.date) !== -1
      ) {
        this.disabled = true;
        return 'disabled';
      }
    }
    return '';
  }
}

window.customElements.define('lit-datepicker-cell', LitDatepickerCell);
