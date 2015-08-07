'use strict'

var d3 = require('d3');


let fontFamily = '\'Karla\', sans-serif';

class PieChart {
  
  constructor(parentNode, data, opts) {

    this.data = data;
    // this.colors = d3.scale.ordinal().range(colors);
    // this.texts = texts;

    this.opts = opts;

    let width = this.opts.width,
        height = this.opts.height;

    // create svg instance
    this.ctx = d3.select(parentNode)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'pie-graph-widget__svg');
    
    // using a main group to offset drawing to the center off svg
    this.mainGroup = this.ctx.append('g')
      .attr('transform', 'translate(' + (width / 2) + ', ' + (height / 2) + ')');
    
    // create pie chart constructor
    this.pie = d3.layout.pie()
      .sort(null)
      .value(d => d.dataValue);
    
    this.outerRadius = Math.min(width, height) / 2;
    this.innerRadius = this.outerRadius - this.opts.circleWidth;
    
    // pie chart arc constructor
    this.arc = d3.svg.arc()
      .outerRadius(this.outerRadius)
      .innerRadius(this.innerRadius);

    // create arc parts
    this.arcs = this.mainGroup.selectAll('.arc')
      .data(this.pie(this.data.pieData))
      .enter()
        .append('g')
        .attr('class', 'arc');

    // for each arc add path
    this.arcs.append('path')
      .attr('d', this.arc)
      .attr('fill', d => d.data.color);
    
    this.renderText();
    this.renderGuides()
  }
  
  renderText() {
    this.textGroup = this.mainGroup.append('g');
    
    this.h1 = this.textGroup
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('font-weight', '700')
      .attr('fill', '#999999')
      .attr('font-family', fontFamily)
      .attr('font-size', 18)
      .text(this.data.title);

    this.h2 = this.textGroup
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('font-weight', '400')
      .attr('fill', '#303030')
      .attr('font-family', fontFamily)
      .attr('font-size', 22)
      .text(this.data.subTitle);

    // verticaly align both items
    let heightOffset = this.h2.node().getBBox().height / 2;
    console.log(this.h1.node().getBBox());
    this.h2.attr('y', heightOffset);
    this.h1.attr('y', heightOffset - this.h1.node().getBBox().height);
  }
  
  renderGuides() {
    
    // convert rotation
    let guideRotationScale = d3.scale.linear()
      .domain([0, 3])
      .range([0, 270]);

    this.mainGroup.selectAll('.pie-graph-widget__guide-line')
      .data(d3.range(0, 4))
      .enter()
        .append('line')
        .attr('class', 'pie-graph-widget__guide-line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', this.outerRadius)
        .attr('y2', this.outerRadius - this.opts.circleWidth)
        .attr('transform', function(d){
          return 'rotate(' + guideRotationScale(d) + ')';
        })
        .style('stroke-width', 8)
        .style('stroke-width', 'round')
        .style('fill', '#333');

  }
  
};

module.exports = PieChart;