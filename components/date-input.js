/* eslint-disable no-underscore-dangle */
import { LitElement, html, css } from 'lit';

import format from 'date-fns/esm/format';
import parse from 'date-fns/esm/parse';
import '@polymer/paper-material/paper-material';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-icon-button/paper-icon-button';
import getDate from 'date-fns/esm/getDate';
import getMonth from 'date-fns/esm/getMonth';
import getYear from 'date-fns/esm/getYear';
import { ironFlexLayoutAlignTheme, ironFlexLayoutTheme } from '../iron-flex-import';
import localize from './localize';

class LitDatepickerDateInput extends localize(LitElement) {
  constructor() {
    super();
    this.date = null;
    this.error = null;
    this.dateFormat = 'dd/MM/yyyy';
    this.language = 'en';
    this.resources = {
      en: {
        FORMAT_ERROR: 'Bad format ( \\d\\d )',
        MIN_ERROR: 'Value is too small',
        MAX_ERROR: 'Value is to high',
        RANGE_ERROR: 'Bad range',

      },
      'en-en': {
        FORMAT_ERROR: 'Bad format ( \\d\\d )',
        MIN_ERROR: 'Value is too small',
        MAX_ERROR: 'Value is to high',
        RANGE_ERROR: 'Bad range',
      },
      'en-US': {
        FORMAT_ERROR: 'Bad format ( \\d\\d )',
        MIN_ERROR: 'Value is too small',
        MAX_ERROR: 'Value is to high',
        RANGE_ERROR: 'Date "to" should be greater or equal to date "from"',
      },
      'en-us': {
        FORMAT_ERROR: 'Bad format ( \\d\\d )',
        MIN_ERROR: 'Value is too small',
        MAX_ERROR: 'Value is to high',
        RANGE_ERROR: 'Bad range',
      },
      fr: {
        FORMAT_ERROR: 'Mauvais format ( \\d\\d )',
        MIN_ERROR: 'Valeur trop petite',
        MAX_ERROR: 'Valeur trop grande',
        RANGE_ERROR: 'Mauvais intervalle',
      },
      'fr-fr': {
        FORMAT_ERROR: 'Mauvais format ( \\d\\d )',
        MIN_ERROR: 'Valeur trop petite',
        MAX_ERROR: 'Valeur trop grande',
        RANGE_ERROR: 'Mauvais intervalle',
      },
    };
  }

  static get properties() {
    return {
      date: { type: String },
      min: { type: Number },
      max: { type: Number },
      dateFormat: { type: String },
      _day: { type: String },
      _month: { type: String },
      _year: { type: String },
      error: { type: String },
      resources: { type: Object },
      language: { type: String },
      outline: { type: Boolean },
    };
  }

  static get styles() {
    const mainStyle = css`
      :host {
        display: block;
        position: relative;
      }
      .date-input .date-separator::after {
        content:'/';
        border-bottom: 1px solid var(--paper-input-container-color, var(--secondary-text-color));
        height: 23px;
        display: flex;
        align-items: flex-end;
        margin-bottom: 5px;
        padding-bottom: 4px;
        width: 8px;
      }
      .date-input input:focus {
        outline: none;
        border-bottom: 2px solid var(--paper-input-container-focus-color, var(--primary-color));
      }
      .date-input input {
        text-align: center;
        background-color: transparent;
        border: none;
        border-bottom: 1px solid var(--paper-input-container-color, var(--secondary-text-color));
        padding: 0;
        padding-bottom: 2px;
        margin-bottom: 5px;
        font-family: Roboto;
        font-size: 14px;
        height:23px;
      }
      .date-input input.day, .date-input input.month  {
        width: 40px;
      }
      .date-input input.year  {
        width: 50px;
      }
      .date-input {
        display: flex;
        justify-content: center;
        width: 146px;
        align-items: flex-end;
        margin-right: 10px;
      }
      #error {
        height: 20px;
        color: var(--error-color, red);
        font-size: 10px;
        text-align: center;
      }
      .date-input input.error {
        border-bottom: 2px solid var(--error-color, red);
      }
      .date-input.error .date-separator::after {
        border-bottom: 2px solid var(--error-color, red);
      }
      .date-input.error input {
        border-bottom: 2px solid var(--error-color, red);
      }
      #error.outline {
        position: absolute;
        bottom: -25px;
        background-color: var(--error-background-color, white);
        padding: 0 8px;
      }
      .outline.date-input .date-separator::after ,
      .outline.date-input input {
        border-bottom: none;
      }

      input {
        color: var(--lit-datepicker-input-color);
      }
      `;
    return [ironFlexLayoutTheme, ironFlexLayoutAlignTheme, mainStyle];
  }

  render() {
    return html`
      <div class="date-input ${this.outline ? 'outline' : ''}">
        <input class="day" tabindex=1 max="31" min="1"
        @keydown=${this.keypress.bind(this)} @focus=${this.selectAll.bind(this)}
        @tap=${this.selectAll.bind(this)}
        @focusout=${this.focusout.bind(this)}
        .value=${this._day} />
        <div class="date-separator"></div>
        <input class="month" tabindex=2 max="12" min="1"
        @keydown=${this.keypress.bind(this)} @focus=${this.selectAll.bind(this)}
        @tap=${this.selectAll.bind(this)}
        @focusout=${this.focusout.bind(this)}
        .value=${this._month} />
        <div class="date-separator"></div>
        <input class="year" tabindex=3 max="2100" min="1970"
        @keydown=${this.keypress.bind(this)} @focus=${this.selectAll.bind(this)}
        @tap=${this.selectAll.bind(this)}
        @focusout=${this.focusout.bind(this)}
        .value=${this._year} />
      </div>
      ${this.error ? html`
        <div class="${this.outline ? 'outline' : ''}" id="error">${this.localize(this.error)}</div>
      ` : null}
    `;
  }

  updated(changedProperties) {
    if (changedProperties.has('date')) {
      this._refreshDayMonthYear(this.date);
    }
  }

  _refreshDayMonthYear(date) {
    this._day = this.getDay(date);
    this._month = this.getMonth(date);
    this._year = this.getYear(date);
  }

  focusNext(element) {
    if (element) {
      const next = element.nextElementSibling;
      if (next == null) {
        element.blur();
        this.dispatchEvent(new CustomEvent('end-of-input'));
        return;
      }
      if (next.tagName.toLowerCase() === 'input') {
        next.focus();
        next.select();
        return;
      }
      this.focusNext(next);
    }
  }

  focusPrev(element) {
    if (element) {
      const prev = element.previousElementSibling;
      if (prev == null) {
        this.dispatchEvent(new CustomEvent('focus-prev'));
        return;
      }
      if (prev.tagName.toLowerCase() === 'input') {
        prev.focus();
        prev.select();
        return;
      }
      this.focusPrev(prev);
    }
  }

  keypress(event) {
    event.preventDefault();
    const { currentTarget } = event;
    this.clearError(currentTarget);
    if (!currentTarget.currentChar) {
      currentTarget.currentChar = 1;
    }
    if (event.key === 'Enter') {
      currentTarget.blur();
      this.dispatchEvent(new CustomEvent('validate'));
    }
    if (event.key === 'ArrowRight' || (!event.shiftKey && event.key === 'Tab')) {
      this.focusNext(currentTarget);
    }
    if (event.key === 'ArrowLeft' || (event.shiftKey && event.key === 'Tab')) {
      this.focusPrev(currentTarget);
    }
    if (event.key === 'Delete' || event.key === 'Backspace') {
      currentTarget.value = '';
      currentTarget.currentChar = 1;
      this.dispatchEvent(new CustomEvent('date-changed'));
    }
    if (!Number.isNaN(parseInt(event.key, 10))) {
      const newValue = this.getFieldValue(currentTarget, event.key);
      currentTarget.value = newValue > currentTarget.max ? currentTarget.max : newValue;
      currentTarget.currentChar += 1;
      if (currentTarget.currentChar > currentTarget.max.toString().length) {
        currentTarget.currentChar = 1;
        this.focusNext(currentTarget);
      }
      this.dispatchEvent(new CustomEvent('date-changed'));
    }
  }

  getFieldValue(currentTarget, key) {
    if (currentTarget.currentChar === 1) {
      return `0000${key}`.slice(-parseInt(currentTarget.max.toString().length, 10));
    }
    return `${currentTarget.value.slice(1 - currentTarget.value.length)}${key}`;
  }

  selectAll(e) {
    e.preventDefault();
    const { currentTarget } = e;
    setTimeout(() => currentTarget.select());
  }

  focusout({ currentTarget }) {
    if (currentTarget.value === '00') {
      currentTarget.value = '01';
    }
    currentTarget.currentChar = 1;
  }

  clear() {
    this.clearError(this.shadowRoot.querySelector('.day'));
    this.clearError(this.shadowRoot.querySelector('.month'));
    this.clearError(this.shadowRoot.querySelector('.year'));
    this._refreshDayMonthYear('00/00/0000');
    setTimeout(() => { this._refreshDayMonthYear(this.date); });
  }

  getDay(date) {
    if (date) {
      const day = getDate(parse(date, this.dateFormat, new Date()));
      return day ? `0${day}`.slice(-2) : '';
    }
    return '';
  }

  getMonth(date) {
    if (date) {
      const month = getMonth(parse(date, this.dateFormat, new Date())) + 1;
      return month ? `0${month}`.slice(-2) : '';
    }
    return '';
  }

  getYear(date) {
    if (date) {
      return getYear(parse(date, this.dateFormat, new Date())) || '';
    }
    return '';
  }

  focus() {
    super.focus();
  }

  select() {
    const firstInput = this.shadowRoot.querySelector('.day');
    setTimeout(() => firstInput.select());
  }

  selectLast() {
    const lastInput = this.shadowRoot.querySelector('.year');
    setTimeout(() => lastInput.select());
  }

  getDate() {
    const day = this._validateInput(this.shadowRoot.querySelector('.day'));
    if (day) {
      const month = this._validateInput(this.shadowRoot.querySelector('.month'));
      if (month) {
        const year = this._validateInput(this.shadowRoot.querySelector('.year'));
        if (year) {
          const date = this._getClosestValidDate(day, month, year);
          return parseInt(format(date, 't'), 10);
        }
      }
    }
    return false;
  }

  _validateInput(input) {
    const { value } = input;
    let valid = true;
    if (!(value.length === input.max.length)) {
      valid = false;
      this.error = 'FORMAT_ERROR';
    }
    if (valid && !(parseInt(value, 10) >= parseInt(input.min, 10))) {
      valid = false;
      this.error = 'MIN_ERROR';
    }
    if (valid && !(parseInt(value, 10) <= parseInt(input.max, 10))) {
      valid = false;
      this.error = 'MAX_ERROR';
    }
    if (!valid) {
      input.classList.add('error');
      input.focus();
      return false;
    }
    return value;
  }


  _getClosestValidDate(day, month, year) {
    const date = parse(`${day}/${month}/${year}`, 'dd/MM/yyyy', new Date());
    if (Number.isNaN(date.getTime())) {
      return this._getClosestValidDate(parseInt(day, 10) - 1, month, year);
    }
    return date;
  }

  clearError(element) {
    if (element) {
      element.classList.remove('error');
    }
    this.shadowRoot.querySelector('.date-input').classList.remove('error');
    this.error = null;
  }

  setError(error) {
    this.error = error;
    this.shadowRoot.querySelector('.date-input').classList.add('error');
  }
}

window.customElements.define('lit-datepicker-date-input', LitDatepickerDateInput);
