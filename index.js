/**
 * Manages a simulation of physical forces acting on bodies and springs.
 */
module.exports = function () {
  var integrate = require('./lib/eulerIntegrator');

  var bodies = [], // Bodies in this simulation.
      springs = []; // Springs in this simulation.

  return {
    /**
     * Performs one step of force simulation.
     * @param {Number} timeStep - integration step
     *
     * @returns {Number} total distance traveled by bodies/total # of bodies
     */
    step: function (timeStep) {
      accumulateForces();
      return integrate(bodies, timeStep);
    },

    addBody: function (body) {
      if (!body) {
        throw new Error('Body is required');
      }
      bodies.push(body);

      return body;
    }
  };

  function accumulateForces() {

  }
};
