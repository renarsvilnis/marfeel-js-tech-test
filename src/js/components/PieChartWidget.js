var objectAssign = require('object-assign');

var PieChart = require('./../components/PieChart.js');

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

    
  }
};

module.exports = PieGraphWidget;

