'use strict'

var d3 = require('d3');


let fontFamily = '\'Karla\', sans-serif';

class PieChart {
  
  constructor(parentNode, data, opts) {

    this.data = data;
    this.opts = opts;

    // minimize lookups
    let width  = this.opts.width,
        height = this.opts.height;

    this.outerRadius = Math.min(width, height) / 2;
    this.innerRadius = this.outerRadius - this.opts.circleWidth;

    // create svg instance
    this.ctx = d3.select(parentNode)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'chart__svg');
    
    // create a main group to offset drawing to the center of svg
    var translate = 'translate(' + (width / 2) + ', ' + (height / 2) + ')';
    this.mainGroup = this.ctx.append('g')
      .attr('transform', translate);
    
    // create pie chart constructor
    // TODO: add animation http://bl.ocks.org/mbostock/1346410
    this.pie = d3.layout.pie()
      .sort(null)
      .value(d => d.value);
    
    // pie chart arc constructor
    this.arc = d3.svg.arc()
      .outerRadius(this.outerRadius)
      .innerRadius(this.innerRadius);

    // create arc parts
    this.arcs = this.mainGroup.selectAll('.chart__graph-arc')
      .data(this.pie(this.data.pie))
      .enter()
        .append('g')
        .attr('class', 'chart__graph-arc');

    // for each arc add path
    this.arcs.append('path')
      .attr('d', this.arc)
      .attr('fill', (d,i) => this.opts.colors.pie[i]);

    this.renderText();
    this.renderGuides()
  }
  
  renderText() {
    this.textGroup = this.mainGroup.append('g');
    
    let h1 = this.textGroup
      .append('text')
      .attr('class', 'chart__title')
      .text(this.data.title);

    let h2 = this.textGroup
      .append('text')
      .attr('class', 'chart__sum')
      .text(this.data.sumString);

    // verticaly align both items
    let heightOffset = h2.node().getBBox().height / 2;
    h2.attr('y', heightOffset);
    h1.attr('y', heightOffset - h1.node().getBBox().height);
  }
  
  renderGuides() {
    
    // convert rotation
    let guideRotationScale = d3.scale.linear()
      .domain([0, 3])
      .range([0, 270]);

    this.mainGroup.selectAll('.chart__guide-line')
      .data(d3.range(0, 4))
      .enter()
        .append('line')
        .attr('class', 'chart__guide-line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', this.innerRadius)
        .attr('y2', this.innerRadius - this.opts.circleWidth / 2)
        .attr('transform', function(d){
          return 'rotate(' + guideRotationScale(d) + ')';
        });
        // TODO add specific guide stroke
        // .style('stroke', '#333');

  }
  
};

module.exports = PieChart;