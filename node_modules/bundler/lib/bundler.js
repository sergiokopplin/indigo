function get_bundling(config, args, main_generator, return_result) {
    main_generator = main_generator || 'mega';

	var DEBUG = config.DEBUG;
	var MAX_PAUSE = config.max_pause;

	var output = config.output;

	var pages = args.pages;

	var deps = {};
	pages.forEach(function(page) {
		deps[page[0]] = page[1].depsSets;
	});
	var sessions = config.sessions;

	var cost_data = {
		kb_cost:   config.kb_cost,
		file_cost: config.file_cost
	};

	var generators = require('./generators.js').get_generators({
		sessions: sessions,
		cost_data: cost_data,
		deps: deps,
		max_pause: MAX_PAUSE
	});

	function beautify_bundling(bundling) {
		var beautiful_bundling = {};
		var bundles = [];
		var raw_bundles = [];
		for (var page in bundling) {
			beautiful_bundling[page] = [];
			bundling[page].forEach(function(bundle) {
				var hash = bundle.join();
				var i = bundles.indexOf(hash);
				if (i == -1) {
					i = bundles.length;
					bundles.push(hash);
					raw_bundles.push(bundle);
				}
				beautiful_bundling[page].push(i);
			});
		}
		return {bundles: raw_bundles, pages: beautiful_bundling};
	}

	if (DEBUG) {
		for (var method in generators) {
			if (method != 'mega') {
				var bundling = generators[method]();
				console.log(method, bundling.cost);
			}
		}
		console.log();
	}

	var mega = generators[main_generator](DEBUG);
	if (return_result) {
		return {
			bundling: beautify_bundling(mega.bundling),
			cost: mega.cost
		};
	}
	else {
		if (DEBUG) {
			console.log();
			console.log('mega:');
			console.log(beautify_bundling(mega.bundling).pages);
			console.log(mega.cost);
		}
		else {
			var bundling = beautify_bundling(mega.bundling);
			output.write('exports.bundling = ' + JSON.stringify(bundling) + ';');
		}
	}
}

exports.get_bundling = get_bundling;

exports.COA = require('coa').Cmd()
	.name(process.argv[1])
	.title('Bundler. It is better for you to not know what it is.')
	.helpful()
	.opt()
		.name('file_cost')
		.title('file cost, default: 10')
		.def(10)
		.long('file-cost')
		.end()
	.opt()
		.name('kb_cost')
		.title('kb cost, default: 2')
		.def(2)
		.long('kb-cost')
		.end()
	.opt()
		.name('max_pause')
		.title('max pause in session (in seconds), default: one hour')
		.def(3600)
		.long('max-pause')
		.end()
	.opt()
		.name('DEBUG')
		.title('Use debug mode. Prints some useful information, and hides some useless')
		.flag()
		.def(false)
		.long('debug')
		.end()
	.opt()
		.name('sessions')
		.title('Sessions = access logs')
		.req()
		.long('sessions')
		.short('s')
		.val(function(sessions_file) {
			return require(require('path').resolve(sessions_file)).sessions;
		})
		.end()
	.opt()
		.name('output')
		.title('file to write output; \'-\' for using stdout; default stdout')
		.output()
		.long('output')
		.short('o')
		.end()
	.arg()
		.name('pages')
		.title('Names of files with pages (with path). Format of file names: [page-name].*, where page-name will be used in sessions')
		.arr()
		.val(function(page) {
			var path = require('path');
			return [path.basename(page).split('.')[0], require(path.resolve(page))];
		})
		.end()
	.act(get_bundling);
	//.parse(process.argv.slice(2));
