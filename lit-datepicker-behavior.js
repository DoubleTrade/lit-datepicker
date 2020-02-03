import format from 'date-fns/esm/format';
import parse from 'date-fns/esm/parse';
import getMonth from 'date-fns/esm/getMonth';
import getYear from 'date-fns/esm/getYear';
// import en from 'date-fns/esm/locale/en';
//
// const locales = { en, fr };

/* eslint no-unused-vars: off */

/* @polymerMixin */
export default (subclass) => class extends subclass {
  localeChanged(locale) {
    if (!this.month) {
      switch (this.defaultAs) {
        case 'dateFrom':
          this.month = this.dateFrom ? `0${getMonth(parse(this.dateFrom, 't', new Date())) + 1}`.slice(-2) : format(new Date(), 'MM', { awareOfUnicodeTokens: true });
          break;
        case 'dateTo':
          this.month = this.dateTo ? `0${getMonth(parse(this.dateTo, 't', new Date())) + 1}`.slice(-2) : format(new Date(), 'MM', { awareOfUnicodeTokens: true });
          break;
        default:
          this.month = format(new Date(), 'MM', { awareOfUnicodeTokens: true });
      }
    }
    if (!this.year) {
      switch (this.defaultAs) {
        case 'dateFrom':
          this.year = this.dateFrom ? getYear(parse(this.dateFrom, 't', new Date())) : format(new Date(), 'yyyy');
          break;
        case 'dateTo':
          this.year = this.dateTo ? getYear(parse(this.dateTo, 't', new Date())) : format(new Date(), 'yyyy');
          break;
        default:
          this.year = format(new Date(), 'yyyy');
      }
    }
  }

  handlePrevMonth() {
    if (!this.enableYearChange) {
      this.shadowRoot.querySelector('lit-datepicker-calendar[next]').handlePrevMonth();
    }
  }

  handleNextMonth() {
    if (!this.enableYearChange) {
      this.shadowRoot.querySelector('lit-datepicker-calendar[prev]').handleNextMonth();
    }
  }

  monthChanged(month, year) {
    if (year && month) {
      const monthPlus = `0${((month % 12) + 1)}`;
      this.monthPlus = monthPlus.substring(monthPlus.length - 2);
      if (this.monthPlus === '01') {
        this.yearPlus = parseInt(year, 10) + 1;
      } else {
        this.yearPlus = parseInt(year, 10);
      }
    }
  }

  noRangeChanged(isNoRange, wasNoRange) {
    if (!wasNoRange && isNoRange) {
      this.dateTo = undefined;
      this.hoveredDate = undefined;
    }
  }
};
