/**
 * Manages a simulation of physical forces acting on bodies and springs.
 */
module.exports = function () {
  var integrate = require('./lib/eulerIntegrator');
  var createQuadTree = require('ngraph.quadtreebh');

  var bodies = [], // Bodies in this simulation.
      springs = [], // Springs in this simulation.
      quadTree = createQuadTree();

  return {
    /**
     * Array of bodies, registered with current simulator
     *
     * Note: To add new body, use addBody() method. This property is only
     * exposed for testing/performance purposes.
     */
    bodies: bodies,

    /**
     * Performs one step of force simulation.
     * @param {Number} timeStep - integration step
     *
     * @returns {Number} Total movement of the system. Calculated as:
     *   (total distance traveled by bodies)^2/(total # of bodies)
     */
    step: function (timeStep) {
      // I'm reluctant to check timeStep here, since this method is going to be
      // super hot, I don't want to add more complexity to it
      if (bodies.length) {
        accumulateForces();
        return integrate(bodies, timeStep);
      }
      return 0;
    },

    /**
     * Adds body to the system
     *
     * @param {ngraph.physics.primitives.Body} body physical body
     *
     * @returns {ngraph.physics.primitives.Body} added body
     */
    addBody: function (body) {
      if (!body) {
        throw new Error('Body is required');
      }
      bodies.push(body);

      return body;
    }
  };

  function accumulateForces() {
    quadTree.insertBodies(bodies); // performance: O(n * log n)
    // Accumulate forces acting on bodies.
    var body,
        i = bodies.length;
    while (i--) {
      body = bodies[i];
      body.force.x = 0;
      body.force.y = 0;

      quadTree.updateBodyForce(body);
      // todo: drag force
    }
    // todo: springs
  }
};
