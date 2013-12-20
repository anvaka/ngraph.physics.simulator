/**
 * Represents spring force, which updates forces acting on two bodies, conntected
 * by a spring.
 *
 * @param {Object} options for the spring force
 * @param {Number=} options.coeff spring force coefficient.
 * @param {Number=} options.lenght desired length of a spring at rest.
 */
module.exports = function (options) {
  if (!options) {
    options = {};
  }

  var random = require('ngraph.random').random(42);
  var currentOptions = {
    coeff : options.coeff || 0.00022,
    length: options.length || 50
  };

  return {
    /**
     * Upsates forces acting on a spring
     */
    update : function (spring) {
      var body1 = spring.body1,
          body2 = spring.body2,
          length = spring.length < 0 ? currentOptions.length : spring.length,
          dx = body2.pos.x - body1.pos.x,
          dy = body2.pos.y - body1.pos.y,
          r = Math.sqrt(dx * dx + dy * dy);

      if (r === 0) {
          dx = (random.nextDouble() - 0.5) / 50;
          dy = (random.nextDouble() - 0.5) / 50;
          r = Math.sqrt(dx * dx + dy * dy);
      }

      var d = r - length;
      var coeff = ((!spring.coeff || spring.coeff < 0) ? currentOptions.coeff : spring.coeff) * d / r * spring.weight;

      body1.force.x += coeff * dx;
      body1.force.y += coeff * dy;

      body2.force.x -= coeff * dx;
      body2.force.y -= coeff * dy;
    },

    options : function (newOptions) {
      if (newOptions) {
        if (typeof newOptions.length === 'number') { currentOptions.length = newOptions.length; }
        if (typeof newOptions.coeff === 'number') { currentOptions.coeff = newOptions.coeff; }

        return this;
      }
      return currentOptions;
    }
  };
}
