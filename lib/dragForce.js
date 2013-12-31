/**
 * Represents drag force, which reduces force value on each step by given
 * coefficient.
 *
 * @param {Object} options for the drag force
 * @param {Number=} options.dragCoeff drag force coefficient. 0.1 by default
 */
module.exports = function (options) {
  var merge = require('ngraph.merge');

  options = merge(options, {
    dragCoeff: 0.02
  });

  return {
    update : function (body) {
      body.force.x -= options.dragCoeff * body.velocity.x;
      body.force.y -= options.dragCoeff * body.velocity.y;
    },

    dragCoeff: function (value) {
      if (value !== undefined) {
        options.dragCoeff = value;
        return this;
      }
      return options.dragCoeff;
    }
  };
};
