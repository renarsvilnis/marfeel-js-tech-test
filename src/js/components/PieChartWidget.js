var objectAssign = require('object-assign'),
    format       = require('string-template');

var PieChart     = require('./../components/PieChart.js'),
    utils        = require('./../utils.js');

var d3 = require('d3');

const DEFAULTS = {
  width: 176,
  height: 176,
  circleWidth: 10,
  colors: {
    pie: ['#005f00', '#005f00'],
    history: []
  }
};

class ChartWidget {
  constructor(parentNode, data, opts) {
    this.parentNode = parentNode;
    this.data = data;
    this.opts = objectAssign({}, DEFAULTS, opts);

    this.calcSum();
    this.calcPerc();

    this.render();
  }

  createRenderValue(value) {

    value = utils.convertToDot(value);

    if(this.data.valueSign)
      value += this.data.valueSign;

    return value;
  }

  calcSum() {
    let pieData = this.data.pie;
    let sum = 0;

    for(let i = 0, l = pieData.length; i < l; i++) {
      sum += pieData[i].value;
    }

    this.data.sum = sum;
    this.data.sumString = this.createRenderValue(sum);
  }

  calcPerc() {
    let pieData = this.data.pie;
    let sum = this.data.sum;

    for(let i = 0, l = pieData.length; i < l; i++) {
      let entryData = pieData[i];

      let perc = entryData.value / sum;
      entryData.percentage = perc;
      entryData.percentageString = (perc * 100).toFixed(2) + '%';

      entryData.valueString = this.createRenderValue(entryData.value);
    }
  }

  render() {
    let base = d3.select(this.parentNode)
      .append('div')
      .attr('class', 'chart');

    // create svg chart
    let pieChart = new PieChart(base.node(), this.data, this.opts);

    let pieData = this.data.pie;
    let pieColors = this.opts.colors.pie;

    // flip template data
    let templateData = {
      i1Name: pieData[1].name,
      i1Perc: pieData[1].percentageString,
      i1Value: pieData[1].valueString,
      i1Color: pieColors[1],
      i2Name: pieData[0].name,
      i2Perc: pieData[0].percentageString,
      i2Value: pieData[0].valueString,
      i2Color: pieColors[0]
    };

    // create labels
    let labels = base
      .append('div')
      .attr('class', 'chart__labels')
      .html(() => format(ChartWidget.LABEL_TEMPLATE, templateData));

    console.log(this.data, base.node());

  }

};

ChartWidget.LABEL_TEMPLATE = "<div class='chart__label chart__label--left'>" +
  "<div class='chart__label-name' style='color: {i1Color}'>{i1Name}</div>"+
  "<span class='chart__label-percentage'>{i1Perc}</span>" +
  "<span class='chart__label-value'>{i1Value}</span>" +
"</div>" +
"<div class='chart__label chart__label--right'>" +
  "<div class='chart__label-name' style='color: {i2Color}'>{i2Name}</div>"+
  "<span class='chart__label-percentage'>{i2Perc}</span>" +
  "<span class='chart__label-value'>{i2Value}</span>" +
"</div>";

module.exports = ChartWidget;