var test = require('tap').test,
    createSpringForce = require('../lib/springForce'),
    physics = require('ngraph.physics.primitives');


test('Initialized with default value', function (t) {
  var springForce = createSpringForce();
  var defaults = springForce.options();
  t.ok(defaults && typeof defaults.coeff === 'number' 
       && typeof defaults.length === 'number', 'Default value is present');

  t.end();
});

// TODO this needs more test
