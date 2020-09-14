//import './views/calculator-view.js';

import { LitElement, html, css } from 'https://unpkg.com/@polymer/lit-element@latest/lit-element.js?module';
import { classMap } from 'https://unpkg.com/lit-html/directives/class-map.js?module';
//import { LitElement, html, css } from 'lit-element';
//import { classMap } from 'lit-html/directives/class-map.js';

import * as calc from './logic/calculations.js';

class CalculatorView extends LitElement {
  static get properties() {
    return {
      _estWeight: { type: String },
      _calculations: { type: Array },
      _vitals: { type: Array },
    };
  }

  constructor() {
    super();
    this._estWeight = '';
    this._calculations = [];
    this._vitals = [];
  }

  _updateEstimatedWeight(e) {
    const age = e.target.value;
    this._clearCalculations();
    if (!age) return this._estWeight = '';

    this._estWeight = age <= 5
      ? 2 * age + 8
      : 3 * age + 7;

    if (this._estWeight >= 70) this._estWeight = 70;
    console.log('estWeight', this._estWeight);
  }
  _clearCalculations() {
    this._calculations = [];
  }
  _btnSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const age = formData.get('age');
    const weight = formData.get('weight') ? formData.get('weight') : this._estWeight;

    calc.setAge(age);
    calc.setWeight(weight);

    this._vitals = [
      ...calc.respiratoryVitals(),
      ...calc.cardiovascularVitals()
    ];

    this._calculations = [
      calc.airway(),
      calc.tidalVolume(),
      calc.bloodVolume(),
      calc.drug('Atropine', { formula: [20], max: [600], class: 'antimuscarinic' }),
      calc.drug('Propofol', { formula: [4000], class: 'sedative' }),
      calc.drug('Ketamine', { formula: [1000, 2000], class: 'sedative' }),
      calc.drug('Thiopentone', { formula: [3000, 5000], class: 'sedative' }),
      calc.drug('Suxamethonium', { formula: [2000, 4000], max: [1000], class: 'nmbd' }),
      calc.drug('Atracurium', { formula: [500], max: [50000], class: 'nmbd' }),
      calc.drug('Fentanyl', { formula: [1, 2], max: [200], class: 'opioid' }),
      calc.drug('Morphine', { formula: [50], class: 'opioid' }),
      calc.drug('Oramorph', { formula: [20, 40], class: 'opioid' }),
      calc.drug('Paracetamol', { formula: [10000, 15000] }),
      calc.drug('Ibuprofen', { formula: [5000, 7000], max: [400] }),
      calc.drug('Co-amoxiclav', { formula: [30000], max: [1200000] }),
      calc.drug('Cefuroxime', { formula: [50000], max: [1500000] }),
      calc.drug('Flucloxacillin', { formula: [25000], max: [2000000] }),
      calc.drug('Benpen', { formula: [25000], max: [1200000] }),
      calc.drug('Metronidazole', { formula: [7500], max: [500000] }),
      calc.drug('Lignocaine 1% | with adrenaline', { formula: [3000, 7000], class: 'local' }),
      calc.drug('Bupivacaine 0.5%', { formula: [400], type: 'liquid' }),
      calc.drug('Mannitol 20%', { formula: [2500], type: 'liquid' }),
    ];

    /*
    if (age<=1) {
      container.appendChild(make(['div', {class:'flex-item-view'}, 'Term>3kg to <8mo']));
      container.appendChild(make(['div', {class:'flex-item-view'}, 'COETT #3']));
    }
    */
  }

  renderForm() {
    return html`
      <form id="formCalc" @submit="${this._btnSubmit}">
        <section>
          <div>
            <label for="age">Age in years</label>
            <input
              type="number"
              name="age"
              placeholder="Years"
              @input="${this._updateEstimatedWeight}"
            />
          </div>
          <div>
            <label for="weight">Weight in kg</label>
            <input
              type="number"
              name="weight"
              placeholder="~${this._estWeight || ''}kg"
              @input="${this._clearCalculations}"
            />
          </div>
        </section>
        <button type="submit" class="calc-submit" id="calc-submit">
          <svg enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/></g><g><path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M13.03,7.06L14.09,6l1.41,1.41 L16.91,6l1.06,1.06l-1.41,1.41l1.41,1.41l-1.06,1.06L15.5,9.54l-1.41,1.41l-1.06-1.06l1.41-1.41L13.03,7.06z M6.25,7.72h5v1.5h-5 V7.72z M11.5,16h-2v2H8v-2H6v-1.5h2v-2h1.5v2h2V16z M18,17.25h-5v-1.5h5V17.25z M18,14.75h-5v-1.5h5V14.75z"/></g></svg>
        </button>
      </form>
    `;
  }
  render() {
    return html`
      ${this.renderForm()}
      ${this._calculations.length === 0
        ? html`
            <div class="label">Weight is estimated based on age if actual weight is not known</div>
            <div class="label">This is a demo app and not to be used clinically</div>
            <div class="label">You can find the GitHub repository <a href="https://github.com/anaestheticsapp/calculator">here</a></div>
            <div class="label">And the tutorial here <a href="https://anaesthetics.app/blog/">here</a></div>
            <div class="label">Created by AnaestheticsApp</div>
          `
        : ''
      }
      <output class="flex">
        ${this._vitals.map(item => {
          return html`
            <figure class="${item.class}">
              <figcaption>${item.title}</figcaption>
              <span>${item.dose}</span>
            </figure>

          `;
        })}
      </output>
      <output class="grid">
        ${this._calculations.map(item => {
          return html`
            <div class="drug-label ${item.class}">${item.title}</div>
            <div class="drug-dose ${item.class}">${item.dose}</div>
            <div class="drug-dose ${item.class}">${item.formula}</div>
          `;
        })}
      </output>
    `;
  }
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 600px;
          padding: 10px;
        }
        button:focus,
        select:focus,
        input:focus {
          outline: none;
        }
        button,
        input,
        select {
          font-family: inherit;
          font-size: inherit;
          border: 0;
        }
        summary {
          outline: none;
          -webkit-tap-highlight-color: transparent;
          cursor: pointer;
        }
        a {
          color: red;
        }

        form {
          display: flex;
          width: 100%;
          padding: 15px 0px;
        }
        form {
          width: 100%;
          padding: 10px;
          display: flex;
          align-items: flex-end;
          margin: 2px;
        }
        section {
          display: flex;
        }
        section div {
          margin-right: 10px;
        }
        label {
          color: #949494;
          text-transform: uppercase;
          font-size: 0.7rem;
          letter-spacing: 0.025em;
          font-weight: 500;
          display: block;
          margin: 5px;
        }
        input {
          background-color: #eceff1;
          color: #000;
          border: 0;
          padding: 8px;
          width: 80px;
          text-align: center;
          border-radius: 0.5em;
        }
        button {
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          background-color: transparent;
          fill: rgb(33, 150, 243);
          padding: 0;
          line-height: 0;
        }
        button:hover {
          fill: #F44336;
        }
        svg {
          width: 36px;
          height: 36px;
        }
        div.label {
          width: 100%;
          padding: 10px;
          color: #2196F3;
          font-weight: 500;
          font-size: 0.9rem;
          margin: 2px;
        }
        output.flex {
          width: 100%;
          color: #fff;
          justify-content: center;
          display: flex;
          text-align: center;
          margin: 20px 0px;
          background-color: rgb(19, 19, 19);
          border-radius: 0.7em;
        }
        output.grid {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          flex-wrap: nowrap;
          align-items: stretch;
          margin: 10px;
          color: var(--on-surface);
          font-size: 0.9rem;
        }
        output figure {
          padding: 10px;
          margin: 5px;
          min-width: 75px;
        }
        figure.green {
          color: #43ff43;
        }
        figure.red {
          color: #ff5722;
        }
        figure span {
          font-size: 1.3rem;
          line-height: 3rem;
        }
        figure figcaption {
          font-size: 0.7rem;
        }
        footer {
          padding: 2px 8px;
          background-color: var(--card-important-background);
          grid-column-end: span 3;
          font-size: 12px;
          color: var(--card-important-color);
        }
        .drug-label {
          border-radius: 0.7em;
          background-color: #fff;
          color: #000;
          padding: 10px;
        }
        .drug-dose {
          font-weight: 500;
          white-space: nowrap;
          color: #fff;
          padding: 10px 5px;
          text-align: center;
        }
        output div {
          border: 2px solid #000;
        }
        output div {
          animation: fadein 0.5s;
          -moz-animation: fadein 0.5s;
          -webkit-animation: fadein 0.5s;
          -o-animation: fadein 0.5s;
        }
        .drug-label.nmbd {
          background-color: #ef5350;
        }
        .drug-label.opioid {
          background-color: #90caf9;
        }
        .drug-label.sedative {
          background-color: #ffeb3b;
        }
        .drug-label.antimuscarinic {
          background-color: #4caf50;
        }
        .drug-label.local {
          background-color: #e0e0e0;
        }
        .drug-dose.nmbd {
          color: #ef5350;
        }
        .drug-dose.opioid {
          color: #90caf9;
        }
        .drug-dose.sedative {
          color: #ffeb3b;
        }
        .drug-dose.antimuscarinic {
          color: #4caf50;
        }
        .drug-dose.local {
          color: #e0e0e0;
        }
        @keyframes fadein {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @-webkit-keyframes fadein {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        } /* Safari and Chrome */
      `,
    ];
  }
}
customElements.define('calculator-view', CalculatorView);
