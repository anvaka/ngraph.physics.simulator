/**
 * Manages a simulation of physical forces acting on bodies and springs.
 */
module.exports = physicsSimulator;

function physicsSimulator() {
  var Spring = require('./lib/spring');
  var createQuadTree = require('ngraph.quadtreebh');
  var createDragForce = require('./lib/dragForce');
  var createSpringForce = require('./lib/springForce');
  var integrate = require('./lib/eulerIntegrator');

  var bodies = [], // Bodies in this simulation.
      springs = [], // Springs in this simulation.
      quadTree = createQuadTree(),
      springForce = createSpringForce(),
      dragForce = createDragForce();

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
    },

    /**
     * Adds a spring to this simulation.
     */
    addSpring: function (body1, body2, springLength, springWeight, springCoefficient) {
      if (!body1 || !body2) {
        throw new Error('Cannot add null spring to force simulator');
      }

      if (typeof springLength !== 'number') {
        throw new Error('Spring length should be a number');
      }
      springWeight = typeof springWeight === 'number' ? springWeight : 1;

      var spring = new Spring(body1, body2, springLength, springCoefficient >= 0 ? springCoefficient : -1, springWeight);
      springs.push(spring);

      // TODO: could mark simulator as dirty.
      return spring;
    },
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
      dragForce.update(body);
    }
    i = springs.length;
    while(i--) {
      springForce.update(springs[i]);
    }
  }
};
