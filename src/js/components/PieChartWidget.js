var objectAssign = require('object-assign'),
    format       = require('string-template');

var PieChart     = require('./../components/PieChart.js');

let defaults = {
  width: 176,
  height: 176,
  circleWidth: 10
};

class PieGraphWidget {
  constructor(parentNode, data, opts) {

    this.parentNode = parentNode;
    this.data = data;
    this.opts = objectAssign({}, defaults, opts);

    // var data = [ 8000.00, 12000.00];
    // var colors = ['#64B5F6', '#2196F3'];

    // var texts = {
    //   h1: 'REVENUE',
    //   h2: '200.000€'
    // };

    console.log(data, opts);

    let base = document.createElement('div');
    base.classList.add('chart');

    // place it in dome before creating pie chart, as it calculated rendered
    // height of elements
    this.parentNode.appendChild(base);

    let pieChart = new PieChart(base, this.data, this.opts);

    let mock = [
      {
        name: 'Tablet',
        percentage: '60%',
        value: '120.000€',
        color: '#2196F3',
      },
      {
        name: 'Smartphone',
        percentage: '40%',
        value: '80.000€',
        color: '#64B5F6'
      },
    ];

    let template = "<div class='chart__labels'>" +
      "<div class='chart__label chart__label--left'>" +
        "<div class='chart__label-name' style='color: {i1Color}'>{i1Name}</div>"+
        "<span class='chart__label-percentage'>{i1Percentage}</span>" +
        "<span class='chart__label-value'>{i1Value}</span>" +
      "</div>" +
      "<div class='chart__label chart__label--right'>" +
        "<div class='chart__label-name' style='color: {i2Color}'>{i2Name}</div>"+
        "<span class='chart__label-percentage'>{i2Percentage}</span>" +
        "<span class='chart__label-value'>{i2Value}</span>" +
      "</div>" +
    "</div>";

    let templateString = format(template, {
      i1Name: mock[0].name,
      i1Percentage: mock[0].percentage,
      i1Value: mock[0].value,
      i1Color: mock[0].color,
      i2Name: mock[1].name,
      i2Percentage: mock[1].percentage,
      i2Value: mock[1].value,
      i2Color: mock[1].color
    });

    var labels = document.createElement('div');
    labels.innerHTML = templateString;
    labels.classList.add('chart__labels');
    base.appendChild(labels);

  }
};

module.exports = PieGraphWidget;

