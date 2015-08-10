
module.exports = {

  /**
   * Converts number to a string with dot seperation.
   * @param  {number} number
   * @return {string}
   *
   * @example
   * 1      => 1
   * 10     => 10
   * 100    => 100
   * 1000   => 1.000
   * 10000  => 10.000
   * 100000 => 100.000
   */
  convertToDot: function(number) {
    // convert input to string
    let input = number + '';

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
  }
};