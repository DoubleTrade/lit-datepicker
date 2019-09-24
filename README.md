[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/@doubletrade/lit-datepicker)
## &lt;range-datepicker&gt;

![lit-datepicker in action](https://raw.githubusercontent.com/roxus/range-datepicker/master/demo.png)

`lit-datepicker` provides a simple datepicker with range.

### Install

    npm install @doubletrade/lit-datepicker

Inspired by [airbnb datepicker](https://github.com/airbnb/react-dates).

```js
  // Simple
  return html`<lit-datepicker date-from="${dateFrom}" date-to="${dateTo}"></lit-datepicker>`;

  // No range
  return html`<lit-datepicker no-range></lit-datepicker>`;

  // No range and narrow view
  return html`<lit-datepicker no-range force-narrow></lit-datepicker>`;

  // i18n
  return html`<lit-datepicker locale="fr"></lit-datepicker>`;

  // Inputs
  const input = (dateFrom, dateTo) => html`
    <paper-input value="${dateFrom} - ${dateTo}" readonly label="Input">
      <paper-icon-button slot="suffix" icon="today"></paper-icon-button>
    </paper-input>`;
  return html`<lit-datepicker-input .html="${input}" dateFormat="dd/MM/yyyy" locale="en"></lit-datepicker-input>`;
```
