import format from 'date-fns/esm/format';
// import en from 'date-fns/esm/locale/en';
//
// const locales = { en, fr };

/* eslint no-unused-vars: off */

/* @polymerMixin */
export default (subclass) => class extends subclass {
  localeChanged(locale) {
    if (!this.month) {
      this.month = format(new Date(), 'MM', { awareOfUnicodeTokens: true });
    }
    if (!this.year) {
      this.year = format(new Date(), 'yyyy');
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
