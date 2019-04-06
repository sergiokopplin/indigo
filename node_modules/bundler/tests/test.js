var vows = require('vows');
var assert = require('assert');
var get_bundling = require('../lib/bundler.js').get_bundling;

var mega_is_best = vows.describe('Our algorithm gives results not worse than naive');

mega_is_best.addBatch({
	'simple test when bundle all is best solution': {
		topic: function() {
			var data = require('./data_for_bundle_all_1.js');
			var args = {pages: data.pages};

			var bundlings_costs = {
				all: get_bundling(data.config, args, 'all', true).cost,
				none: get_bundling(data.config, args, 'none', true).cost,
				every: get_bundling(data.config, args, 'every', true).cost,
				mega: get_bundling(data.config, args, 'mega', true).cost
			};
			return bundlings_costs;
		},
		'bundle all is the same as our solution': function(bundlings_costs) {
			assert.equal(bundlings_costs.mega, bundlings_costs.all);
		},
		'bundle all is better than bundle none': function(bundlings_costs) {
			assert.ok(bundlings_costs.all < bundlings_costs.none);
		},
		'bundle all is better than bundle every page': function(bundlings_costs) {
			assert.ok(bundlings_costs.all < bundlings_costs.every);
		}
	}
});

mega_is_best.run();
