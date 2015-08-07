'use strict';

module.exports = {
  green: {
    title: 'REVENUE',
    subTitle: '200.000€',

    pieData: [
      {
        name: 'Smartphone',
        value: '80.000€',
        dataValue: 8000,
        color: '#64B5F6'
      },
      {
        name: 'Tablet',
        value: '120.000€',
        dataValue: 12000,
        color: '#2196F3'
      }
    ],

    graphData: [
      160000,
      150000,
      170000,
      160000,
      190000,
      180000,
      210000,
      200000,
      200000,
      210000,
      220000,
      200000
    ]
  },

  blue: {
    title: 'IMPRESSIONS',
    subTitle: '200.000€',

    pieData: [
      {
        name: 'Smartphone',
        value: '80.000€',
        dataValue: 8000,
        color: '#64B5F6'
      },
      {
        name: 'Tablet',
        value: '120.000€',
        dataValue: 12000,
        color: '#2196F3'
      }
    ],

    graphData: [
      
    ]
  }
};

// let temp = {

//   // items
//   Tablet
//   Smartphone

//   item

//   // values per each
//   revenue,
//   impressions,
//   visits
// }

var convertToDot = function(number) {
  var input = number + '';

  var output = '';

  var lastSlice;

  for(let i = input.length - 1, j = 1; i >= 0; i--, j++) {
    if(j % 3 === 0) {
      output = input.slice(i, lastSlice) + output;
      lastSlice = i;

      if(i > 0)
        output = '.' + output;
    }
  }

  let remaining = input.slice(0, lastSlice);
  output = remaining + output;

  return output;
};

console.log(1, convertToDot(1));
console.log(10, convertToDot(10));
console.log(100, convertToDot(100));
console.log(1000, convertToDot(1000));
console.log(10000, convertToDot(10000));
console.log(100000, convertToDot(100000));