/**
 * Represents drag force, which reduces force value on each step by given
 * coefficient.
 *
 * @param {Object} options for the drag force
 * @param {Number=} options.coeff drag force coefficient. 0.1 by default
 */
module.exports = function (options) {
  if (!options) {
    options = {};
  }

  var currentOptions = {
    coeff : options.coeff || 0.01
  };

  return {
    update : function (body) {
      body.force.x -= currentOptions.coeff * body.velocity.x;
      body.force.y -= currentOptions.coeff * body.velocity.y;
    },
    options : function (newOptions) {
      if (newOptions) {
        if (typeof newOptions.coeff === 'number') { currentOptions.coeff = newOptions.coeff; }

        return this;
      }

      return currentOptions;
    }
  };
};
