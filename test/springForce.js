var test = require('tap').test,
    createSpringForce = require('../lib/springForce'),
    Body = require('ngraph.physics.primitives').Body,
    Spring = require('../lib/spring');


test('Initialized with default value', function (t) {
  var springForce = createSpringForce();
  var defaults = springForce.options();
  t.ok(defaults && typeof defaults.coeff === 'number' 
       && typeof defaults.length === 'number', 'Default value is present');

  t.end();
});

test('Check spring force direction', function (t) {
  var springForce = createSpringForce();

  t.test('Should contract two bodies when ideal length is smaler than actual', function (t) { 
    var body1 = new Body(-1, 0);
    var body2 = new Body(+1, 0);
    // length between two bodies is 2, while ideal length is 1. Each body
    // should start moving towards each other after force update
    var idealLength = 1;
    var spring = new Spring(body1, body2, idealLength);
    springForce.update(spring);

    t.ok(body1.force.x > 0, 'Body 1 should go right');
    t.ok(body2.force.x < 0, 'Body 2 should go left');
    t.end();
  });

  t.test('Should repel two bodies when ideal length is larger than actual', function (t) { 
    var body1 = new Body(-1, 0);
    var body2 = new Body(+1, 0);
    // length between two bodies is 2, while ideal length is 1. Each body
    // should start moving towards each other after force update
    var idealLength = 3;
    var spring = new Spring(body1, body2, idealLength);
    springForce.update(spring);

    t.ok(body1.force.x < 0, 'Body 1 should go left');
    t.ok(body2.force.x > 0, 'Body 2 should go right');
    t.end();
  });

  t.end();
});
