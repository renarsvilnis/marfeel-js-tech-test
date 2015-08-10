
let objectAssign = require('object-assign');

let ChartWidget = require('./PieChartWidget.js');

class Dashboard {
  
  constructor(parentNode, data) {
    this.parentNode = parentNode;
    this.data = data;

    this.base = document.createElement('div');
    this.base.classList.add('dashboard');

    this.parentNode.appendChild(this.base);

    this.renderDashboard();
  }

  renderDashboard() {
    for(let i = 0, l = this.data.length; i < l; i++) {
      let widgetData = this.data[i];

      switch(widgetData.name) {
        case 'revenue': 
          this.revenueFactory(widgetData);
          break;

        case 'impressions': 
          this.impressionsFactory(widgetData);
          break;

        case 'visits': 
          this.visitsFactory(widgetData);
          break;
      }
    }
  }

  revenueFactory(data) {

    data.valueSign = '€';
    data.title = 'REVENUE';

    let opts = {
      colors: {
        pie: Dashboard.COLORS.REVENUE
      }
    };

    this.widgetFactory(data, opts);
  }

  impressionsFactory(data) {

    data.title = 'IMPRESSIONS';

    let opts = {
      colors: {
        pie: Dashboard.COLORS.IMPRESSIONS
      }
    };

    this.widgetFactory(data, opts);
  }

  visitsFactory(data) {

    data.title = 'VISITS';

    let opts = {
      colors: {
        pie: Dashboard.COLORS.VISITS
      }
    };

    this.widgetFactory(data, opts);    
  }

  widgetFactory(data, opts) {
    new ChartWidget(this.base, data, opts);
  }

};

Dashboard.COLORS = {
  REVENUE: ['#005f00', '#51cf26'],
  IMPRESSIONS: ['#00475d', '#06c6e0'],
  VISITS: ['#ffbf00', '#d44d0d']
};

module.exports = Dashboard;
