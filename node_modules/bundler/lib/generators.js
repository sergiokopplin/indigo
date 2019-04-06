function Bundler(data) {
	var calc_hash = {
		bundles_cost: {},
		bundles_size: {}
	};
	var all_bundles = {};
	var bundles_by_id = {};
	var bundles_count = 0;

	var pages;
	var file_size;
	var sessions;
	var deps;

	var page_names;
	var file_names;

	var cost_data = data.cost_data;
	var raw_deps = data.deps;

	var logs = {
		file_size: {},
		pages: {},
		sessions: []
	};

	function hash_file_group(file_group) {
		return file_group.sort().join();
	}

	function get_bundle_hash(file_group) {
		var hash = hash_file_group(file_group);
		if (!all_bundles.hasOwnProperty(hash)) {
			var new_bundle = all_bundles[hash] = bundles_by_id[bundles_count] = {
				file_group: {},
				size: false,
				plus_neighbors: {},
				minus_neighbors: {},
				hash: hash,
				size : 0,
				pages_intersect: {},
				id: bundles_count++,
				file_count: file_group.length,
				intersects: {},
				diffs: {},
				unions: {}
			};
			file_group.forEach(function(file) {
				new_bundle.file_group[file] = true;
				new_bundle.size += file_size[file];
			});
			for (var page in pages) {
				for (var file in pages[page]) {
					if (new_bundle.file_group.hasOwnProperty(pages[page][file])) {
						new_bundle.pages_intersect[page] = true;
						break;
					}
				}
			}
		}
		return all_bundles[hash];
	}

	function hash_bundling(bundling) {
		var result = '';
		for (var page in bundling) {
			result += page + ':';
			result += bundling[page].map(function(bundle) {return bundle.id;}).join();
			result += ';';
		}
		return result;
	}

	function get_bundle_plus_neighbor(bundle, file) {
		if (!bundle.plus_neighbors.hasOwnProperty(file)) {
			if (bundle.file_group.hasOwnProperty(file)) {
				return bundle.plus_neighbors[file] = bundle;
			}
			var file_group = Object.keys(bundle.file_group).concat([file]);
			var neighbor = get_bundle_hash(file_group);
			neighbor.minus_neighbors[file] = bundle;
			bundle.plus_neighbors[file]= neighbor;
		}
		return bundle.plus_neighbors[file];
	}

	function get_bundle_minus_neighbor(bundle, file) {
		if (!bundle.minus_neighbors.hasOwnProperty(file)) {
			if (!bundle.file_group.hasOwnProperty(file)) {
				return bundle.minus_neighbors[file] = bundle;
			}
			delete bundle.file_group[file];
			var file_group = Object.keys(bundle.file_group).concat();
			bundle.file_group[file] = true;
			var neighbor = get_bundle_hash(file_group);
			neighbor.plus_neighbors[file] = bundle;
			bundle.minus_neighbors[file] = neighbor;
		}
		return bundle.plus_neighbors[file];
	}

	function get_bundle_intersect(bundle1, bundle2) {
		if (!bundle1.intersects.hasOwnProperty(bundle2.id)) {
			var file_group = {};
			if (bundle1.file_count > bundle2.file_count) {
				var tmp = bundle1;
				bundle1 = bundle2;
				bundle2 = tmp;
			}
			for (var file in bundle1.file_group) {
				if (bundle2.file_group.hasOwnProperty(file)) {
					file_group[file] = true;
				}
			}
			bundle1.intersects[bundle2.id] = bundle2.intersects[bundle1.id] = get_bundle_hash(Object.keys(file_group));
		}
		return bundle1.intersects[bundle2.id];
	}

	function get_bundle_diff(bundle1, bundle2) {
		if (!bundle1.diffs.hasOwnProperty(bundle2.id)) {
			var file_group = {};
			for (var file in bundle1.file_group) {
				if (!bundle2.file_group.hasOwnProperty(file)) {
					file_group[file] = true;
				}
			}
			bundle1.diffs[bundle2.id] = get_bundle_hash(Object.keys(file_group));
		}
		return bundle1.diffs[bundle2.id];
	}

	function get_bundle_union(bundle1, bundle2) {
		if (!bundle1.unions.hasOwnProperty(bundle2.id)) {
			var file_group = [];
			for (var file in bundle1.file_group) {
				file_group[file] = true;
			}
			for (var file in bundle2.file_group) {
				file_group[file] = true;
			}
			bundle1.unions[bundle2.id] = bundle2.unions[bundle1.id] = get_bundle_hash(Object.keys(file_group));
		}
		return bundle1.unions[bundle2.id];
	}

	function int_cmp(a, b) {
		return a-b;
	}

	function good_cmp(a, b) {
		return (a > b) ? 1 : ((a == b) ? 0 : -1);
	}

	function empty(x) {
		return (x == undefined) || ((x instanceof Array) && (x.length == 0));
	}

	function array_unique(arr, _cmp) {
		var tmp = [];
		for (var i in arr) {
			if (!tmp.length || _cmp(tmp[tmp.length-1], arr[i])) {
				if (!empty(arr[i])) {
					tmp.push(arr[i]);
				}
			}
		}
		return tmp;
	}

	function recursive_copy(target) {
		if (!(target instanceof Object)) {
			return target;
		}
		var result = new target.constructor;
		for (var i in target) {
			result[i] = recursive_copy(target[i]);
		}
		return result;
	}

	function gen_bundle_all() {
		var all_file = {};
		for (var page in pages) {
			pages[page].forEach(function(file) {
				all_file[file] = true;
			});
		}
		var bundle = get_bundle_hash(Object.keys(all_file));
		var bundling = {};
		for (var page in pages) {
			bundling[page] = [bundle];
		}
		return {
			bundling: restore_names_in_bundling(bundling),
			cost:     get_bundling_avg_cost(bundling)
		};
	}

	function gen_bundle_every_page() {
		var bundling = {};
		for (var page in pages) {
			bundling[page] = [get_bundle_hash(pages[page])];
		}
		return {
			bundling: restore_names_in_bundling(bundling),
			cost:     get_bundling_avg_cost(bundling)
		};
	}

	function gen_bundle_none() {
		var bundling = {};
		for (var page in pages) {
			bundling[page] = [];
			pages[page].forEach(function (file) {
				bundling[page].push(get_bundle_hash([file]));
			});
		}
		return {
			bundling: restore_names_in_bundling(bundling),
			cost:     get_bundling_avg_cost(bundling)
		};
	}

	function get_files_sequence_cost(files_sequence, cost_data) {
		var cost = 0;
		files_sequence.forEach(function(page) {
			var cur_time = 0;
			for (var file_size in page) {
				cur_time += (cost_data.file_cost + file_size*cost_data.kb_cost)*page[file_size];
			}
			cost += cur_time;
		});
		return cost;
	}

	function get_bundling_session_cost(bundling, session, file_size, cost_data) {
		var files_sequence = [];
		files_sequence.length = session.pages.length;
		var files = {};
		var l = session.pages.length;
		for (var i = 0; i < l; ++i) {
			var current_part = {};
			bundling[session.pages[i]].forEach(function(bundle) {
				var hash = bundle.id;
				if (!files.hasOwnProperty(hash)) {
					files[hash] = true;
					if (!current_part.hasOwnProperty(bundle.size)) {
						current_part[bundle.size] = 1;
					}
					else {
						++current_part[bundle.size];
					}
				}
			});
			files_sequence[i] = current_part;
		}
		return get_files_sequence_cost(files_sequence, cost_data) * session.weight;
	}

	function get_bundling_avg_cost(bundling, hash_hint) {
		var cost = 0;
		if (hash_hint === undefined) {
			hash_hint = hash_bundling(bundling);
		}
		if (!calc_hash.bundles_cost.hasOwnProperty(hash_hint)) {
			for (var session in sessions) {
				cost += get_bundling_session_cost(bundling, sessions[session], file_size, cost_data);
			}
			return calc_hash.bundles_cost[hash_hint] = cost / sessions.length;
		}
		return calc_hash.bundles_cost[hash_hint];
	}

	function get_bundles_order(file_dependences, bundles) {
		function bundle_depend(file_dependences, bundle1, bundle2) {
			for (var file1_i in bundle1) {
				for (var file2_i in bundle2) {
					if (file_dependences.hasOwnProperty(bundle1[file1_i]) && file_dependences[bundle1[file1_i]].indexOf(bundle2[file2_i]) != -1) {
						return true;
					}
				}
			}
			return false;
		}

		function get_bundles_dependences(file_dependences, bundles) {
			var bundles_dependences = {};
			bundles.forEach(function(bundle, index) {
				var cur_dependences = [];
				bundles.forEach(function(bundle2, index2) {
					if ((bundle != bundle2) && bundle_depend(file_dependences, bundle, bundle2)) {
						cur_dependences.push(index2);
					}
				});
				bundles_dependences[index] = cur_dependences;
			});
			return bundles_dependences;
		}

		var order = [];
		var bundles_count = bundles.length;
		var bundles_dependences = get_bundles_dependences(file_dependences, bundles);
		while (order.length != bundles_count) {
			var ok = false;
			for (var _bundle in bundles) {
				var bundle = _bundle - 0;
				if (order.indexOf(bundle) == -1 && !bundles_dependences[bundle].length) {
					ok = true;
					order.push(bundle);
					for (var bundle2 in bundles_dependences) {
						var i = bundles_dependences[bundle2].indexOf(bundle);
						if (i != -1) {
							bundles_dependences[bundle2].splice(i, 1);
						}
					}
					break;
				}
			}
			if (!ok) {
				throw 'Bundles are not consistent';
			}
		}
		return order;
	}

	function rand_int(low, top) {
		return Math.floor((low - top) * Math.random()) + top;
	}

	function random_key(a) {
		var keys = Object.keys(a);
		return keys[rand_int(0, keys.length)];
	}

	function gen_bundle_mega1(DEBUG) {
		var variants = [];
		var POPULATION_SIZE = 30;
		var CHILDS = 5;
		var MAX_GENERATIONS = 1000;
		var MAX_GENERATIONS_SIMPLE = 5;
		var MAX_GEN_SIZE = 0;
		var pages_data = {};

		var all_file = {};
		for (var page in pages) {
			MAX_GEN_SIZE += pages[page].length;
			pages[page].forEach(function(file) {
				if (!all_file.hasOwnProperty[file]) {
					all_file[file] = get_bundle_hash([file]);
				}
			});
			pages_data[page] = get_bundle_hash(pages[page]);
		}
		var all_file_array = Object.keys(all_file);

		function gen_random_bundle(p) {
			var file_group = [];
			if (p == undefined) {
				p = 0.5;
			}
			for (var file in all_file) {
				if (Math.random() < p) {
					file_group.push(file);
				}
			}
			return get_bundle_hash(file_group);
		};
		function normalize_gen(gen) {
			gen = gen.filter(function(a) {return a[0].size});
			gen.sort(function(a,b) {return int_cmp(a[0].id, b[0].id) || int_cmp(a[1], b[1])});
			gen = array_unique(gen, function(a,b) {return int_cmp(a[0].id, b[0].id)});
			gen.sort(function(a,b) {return int_cmp(b[1], a[1]);});
			return gen;
		};
		function get_best_bundle(possible_bundles, need_file) {
			var best_quality = Infinity;
			var best_quality_bundle = -1;
			for (var bundle in possible_bundles) {
				var cur_intersection = get_bundle_intersect(need_file, possible_bundles[bundle][0]);
				if (cur_intersection.file_count) {
					var cur_quality = possible_bundles[bundle][1] / cur_intersection.file_count;
					//var cur_quality = -cur_intersection.file_count;
					if (cur_quality < best_quality) {
						best_quality = cur_quality;
						best_quality_bundle = bundle;
					}
				}
				else {
					delete possible_bundles[bundle];
				}
			}
			return best_quality_bundle;
		};
		function gen_to_bundling(gen) {
			gen = normalize_gen(gen);
			var possible_page_bundles = {};
			for (var page in pages) {
				possible_page_bundles[page] = {};
			}
			var total_sum = 0;
			gen.forEach(function(bundle) {
				total_sum += bundle[1];
				for (var page in bundle[0].pages_intersect) {
					possible_page_bundles[page][bundle[0].id] = bundle;//.push(bundle);
				}
			});
			for (var page in pages) {
				pages[page].forEach(function(file) {
					var bundle = all_file[file];
					possible_page_bundles[page][bundle.id] = [bundle, total_sum+1];
				});
			}
			var bundling = {};
			var cur_best_cost;
			for (var page in pages) {
				var page_bundles = [];
				var need_file = pages_data[page];
				var possible_bundles = possible_page_bundles[page];
				while (need_file.file_count) {
					var best_quality_bundle = get_best_bundle(possible_bundles, need_file);
					page_bundles.push(possible_bundles[best_quality_bundle][0]);
					need_file = get_bundle_diff(need_file, possible_bundles[best_quality_bundle][0]);
					delete possible_bundles[best_quality_bundle];
				}
				bundling[page] = page_bundles;
			}
			return bundling;
		};
		function mutate_change_bundle(gen, type) {
			if (gen.length > 1) {
				var l = gen.length;
				var bundle1 = rand_int(0, l);
				var bundle2 = rand_int(0, l-1);
				if (bundle2 >= bundle1) {
					++bundle2;
				}
				switch (type) {
					case 'union':
						var new_bundle = get_bundle_union(gen[bundle1][0], gen[bundle2][0]);
						var weight = Math.max(gen[bundle1][1], gen[bundle2][1]);
						gen[bundle1] = [new_bundle, weight];
						gen.splice(bundle2, 1);
						break;
					case 'diff':
						var new_bundle = get_bundle_diff(gen[bundle1][0], gen[bundle2][0]);
						gen[bundle1][0] = new_bundle;
						break;
					case 'intersect':
						var new_bundle = get_bundle_intersect(gen[bundle1][0], gen[bundle2][0]);
						gen[bundle1][0] = new_bundle;
						break;
				}
			}
			return gen;
		}
		function mutate_change_bundle_union(gen) {
			return mutate_change_bundle(gen, 'union');
		}
		function mutate_change_bundle_diff(gen) {
			return mutate_change_bundle(gen, 'diff');
		}
		function mutate_change_bundle_intersect(gen) {
			return mutate_change_bundle(gen, 'intersect');
		}
		function mutate_change_weight(gen) {
			if (gen.length > 0) {
				var bundle = gen[rand_int(0, gen.length)];
				bundle[1] *= 0.5+1.5*Math.random();
				bundle[1] = Math.min(Math.round(bundle[1]), 100);
			}
			return gen;
		};
		function mutate_del_bundle(gen) {
			gen[rand_int(0, gen.length)] = gen[gen.length - 1];
			--gen.length;
			return gen;
		}
		var mutations = [
			[mutate_change_bundle_union, 0.2],
			[mutate_change_bundle_diff, 0.2],
			[mutate_change_bundle_intersect, 0.2],
			[mutate_change_weight, 0.2],
			[mutate_del_bundle, 0.2]
			/*[mutate_change_bundle_union, 0.314],
			[mutate_change_bundle_diff, 0.223],
			[mutate_change_bundle_intersect, 0.223],
			[mutate_change_weight, 0.02],
			[mutate_del_bundle, 0.22],*/
		];
		var mutation_names = ['union', 'diff', 'intersect', 'weight', 'bundle'];
		function mutate(_gen) {
			var gen = [];
			gen.length = _gen.length;
			for (var i = _gen.length; --i >= 0;) {
				gen[i] = [_gen[i][0], _gen[i][1]];
			}
			var r = Math.random();
			for (var i in mutations) {
				r -= mutations[i][1];
				if (r < 0) {
					return [mutations[i][0](gen), i];
				}
			}
			return [gen, mutations.length];
		};
		function cost_function(bundling, use_len_mul, hash_hint) {
			var len_mul = 1;
			if ((use_len_mul !== false) && (gen.length > MAX_GEN_SIZE)) {
				len_cost = gen.length / MAX_GEN_SIZE;
			}
			var result = get_bundling_avg_cost(bundling, hash_hint) * len_mul;
			return result;
		};
		function pair_gen(gen1, gen2) {
			var gen = [];
			gen1.forEach(function(b) {
				if (Math.random() < 0.5) {
					gen.push([b[0], b[1]]);
				}
			});
			gen2.forEach(function(b) {
				if (Math.random() < 0.5) {
					gen.push([b[0], b[1]]);
				}
			});
			return normalize_gen(gen);
		};
		function check_bundling(bundling) {
			bundling = restore_names_in_bundling(bundling);
			try {
				for (var page in bundling) {
					get_bundles_order(deps[page], bundling[page]);
				}
			}
			catch(e) {
				if (e == 'Bundles are not consistency') {
					return false;
				}
				throw e;
			}
			return true;
		}

		for (var i = 0; i < POPULATION_SIZE; ++i) {
			var gen = [];
			for (var page in pages) {
				gen.push([get_bundle_hash(pages[page]), 50]);
			}
			variants.push(gen);
		}
		variants.sort(function (v1, v2) {return cost_function(gen_to_bundling(v1), true) - cost_function(gen_to_bundling(v2), true);});
		var prev_best = cost_function(gen_to_bundling(variants[0]), true);
		var generations_simple = 0;
		good_mutations = [];
		diff_mutations = [];
		for (var i in mutations) {
			good_mutations[i] = 0;
			diff_mutations[i] = 0;
		}
		childs_better_two = 0;
		childs_better_one = 0;
		function hash_gen(gen) {
			var hash = '';
			gen.forEach(function(bundle) {
				hash += String(bundle[0].id) + ':' + String(bundle[1]) + '|';
			});
			return hash;
		}
		if (DEBUG) {
			var gen_history = {};
			variants.forEach(function(gen) {
				gen_history[hash_gen(gen)] = {
					gen: gen,
					ways: [
						{way: 'initial'}
					]
				};
			});
			function print_gen_genealogy(hash, tabs) {
				console.log(tabs + '[' + hash + ']');
				var bundling = gen_to_bundling(gen_history[hash].gen);
				var better_bundling = {};
				for (var page in bundling) {
					better_bundling[page] = bundling[page].map(function(bundle) {
						return bundle.hash;
					});
				}
				console.log(tabs + '\t' + cost_function(bundling, true));
				//console.log(tabs + '\t' + JSON.stringify(better_bundling), '');
				//console.log(tabs + '\t' + gen_history[hash].ways.map(function(way) {return way.way;}).join());
				var way = gen_history[hash].ways[0];
				switch (way.way) {
					case 'initial':
						console.log(tabs + '\tinitial');
						break;
					case 'pair':
						console.log(tabs + '\tpair');
						print_gen_genealogy(way.parents[0], tabs + '\t');
						print_gen_genealogy(way.parents[1], tabs + '\t');
						break;
					case 'mutation':
						console.log(tabs + '\tmutation ' + mutation_names[way.type]);
						print_gen_genealogy(way.old, tabs + '\t');
						break;
				}
				console.log(tabs + '[/' + hash + ']');
			}
		}
		if (DEBUG) {
			var total_bundles = 0, bad_bundles = 0, bad_bundles_costs = [];
		}
		for (var generation = 0; generation < MAX_GENERATIONS && generations_simple < MAX_GENERATIONS_SIMPLE; ++generation) {
			var vars_length = variants.length;
			for (var i = 0; i < vars_length; ++i) {
				for (var j = i+1; j < vars_length; ++j) {
					var new_gen = pair_gen(variants[i], variants[j]);
					if (new_gen.length) {
						variants.push(new_gen);
						if (DEBUG) {
							var hash = hash_gen(new_gen);
							if (!gen_history.hasOwnProperty(hash)) {
								gen_history[hash] = {
									gen: new_gen,
									ways: []
								};
								gen_history[hash].ways.push({
									way: 'pair',
									parents: [hash_gen(variants[i]), hash_gen(variants[j])]
								});
							}
						}
					}
				}
			}
			for (var i = Math.min(POPULATION_SIZE, variants.length); --i >= 0;) {
				var cost = cost_function(gen_to_bundling(variants[i]), true);
				for (var j = CHILDS; --j >= 0;) {
					var mutation = mutate(variants[i]);
					if (DEBUG) {
						if (cost_function(gen_to_bundling(mutation[0])) < cost) {
							++good_mutations[mutation[1]];
						}
						if (mutation[1] < mutations.length) {
							++diff_mutations[mutation[1]];
						}
					}
					variants.push(mutation[0]);
					if (DEBUG) {
						var hash = hash_gen(mutation[0]);
						if (!gen_history.hasOwnProperty(hash)) {
							gen_history[hash] = {
								gen: mutation[0],
								ways: []
							};
						};
						gen_history[hash].ways.push({
							way: 'mutation',
							type: String(mutation[1]),
							old: hash_gen(variants[i])
						});
					}
				}
			}
			var bundlings = [];
			variants.forEach(function(variant) {
				var cur_bundling = gen_to_bundling(variant);
				var hash = hash_bundling(cur_bundling);
				bundlings.push({hash: hash, bundling: cur_bundling});
				/*if (DEBUG) {
					++total_bundles;
					if (!check_bundling(cur_bundling)) {
						++bad_bundles;
						for (var page in cur_bundling) {
							var s = page + ': ';
							cur_bundling[page].forEach(function(bundle) {
								s += '[' + bundle.hash + '], ';
							});
							console.log(s);
						}
						console.log('\n');
						bad_bundles_costs.push(cost_function(cur_bundling, hash));
					}
				}*/
			});

			//Грязный хак для производительности
			//Если что, я этого не писал - mihaild
			var permutation = [];
			permutation.length = variants.length;
			for (var i = variants.length; --i >= 0;) {
				permutation[i] = i;
			}
			function cmp_variants_hash(v1, v2) {
				return good_cmp(bundlings[v1].hash, bundlings[v2].hash)
			}
			permutation.sort(cmp_variants_hash);
			permutation = array_unique(permutation, cmp_variants_hash);
			var costs = [];
			permutation.forEach(function(i) {
				bundlings[i].cost = cost_function(bundlings[i].bundling, bundlings[i].hash);
				costs.push(Math.round(bundlings[i].cost * 100) / 100);
			});
			costs.sort(int_cmp);
			permutation.sort(function(v1, v2) {return bundlings[v1].cost - bundlings[v2].cost});
			var new_variants = [];
			new_variants.length = Math.min(POPULATION_SIZE, permutation.length);
			for (var i = new_variants.length; --i >= 0;) {
				new_variants[i] = variants[permutation[i]];
			}
			variants = new_variants;
			delete new_variants;
			var cur_best = bundlings[permutation[0]].cost;
			if (cur_best == prev_best) {
				++generations_simple;
			}
			else {
				generations_simple = 0;
				prev_best = cur_best;
			}
			if (DEBUG) {
				console.log('Generation: ', generation, cur_best, bundlings[permutation[5]].cost, bundlings[permutation[15]].cost);
			}
		}
		if (DEBUG) {
			console.log("Generations: ", generation);
		}
		var bundling = gen_to_bundling(variants[0]);
		if (DEBUG) {
			var hash = hash_gen(variants[0]);
			//print_gen_genealogy(hash, '');
		}
		if (DEBUG) {
			console.log('Total bundles: ', total_bundles, ', bad bundles: ', bad_bundles);
			console.log(JSON.stringify(bad_bundles_costs));
		}
		if (DEBUG) {
			var good_mutations_count = 0;
			var total_mutations_count = 0;
			console.log();
			good_mutations.forEach(function(v) {good_mutations_count += v;});
			diff_mutations.forEach(function(v) {total_mutations_count += v;});
			for (var i in good_mutations) {
				console.log(i, good_mutations[i] / good_mutations_count);
			}
			console.log(good_mutations_count/total_mutations_count);
		}
		var answer_bundling = restore_names_in_bundling(bundling);
		for (var page in answer_bundling) {
			answer_bundling[page] = get_bundles_order(deps[page], answer_bundling[page]).map(function(i) {
				return answer_bundling[page][i]
			});
		}
		return {
			bundling: answer_bundling,
			cost:     cost_function(bundling, false)
		};
	}

	function heuristic_log_change(log) {
		var new_log = {
			file_size: [],
			pages: [],
			sessions: []
		};
		var page_count = 0;
		var page_numbers = {};
		var page_names = [];
		for (var page in log.pages) {
			page_numbers[page] = page_count++;
			page_names.push(page);
		}
		//console.log(page_numbers);
		var file_pages = {};
		for (var file in log.file_size) {
			file_pages[file] = [];
			for (var page in log.pages) {
				file_pages[file][page_numbers[page]] = 0;
			}
		}
		for (var page in log.pages) {
			log.pages[page].forEach(function(file) {
				file_pages[file][page_numbers[page]] = 1;
			});
		}
		var new_file_sizes = {};
		var new_file_count = 0;
		var new_file_numbers = {};
		var file_names = [];
		function bundle_force(file_pages) {
			var pages = [0, 0];
			file_pages.forEach(function(val) {
				++pages[val];
			});
			return !(pages[0] && (pages[1] > 1));
		}
		var variants = {};
		for (var file in file_pages) {
			var s = file_pages[file].join('');
			//if (1 || bundle_force(file_pages[file])) {
			if (1 || bundle_force(file_pages[file])) {
				if (!new_file_sizes.hasOwnProperty(s)) {
					new_file_sizes[s] = 0;
					new_file_numbers[s] = new_file_count++;
					variants[s] = 0;
				}
				++variants[s];
				new_file_sizes[s] += log.file_size[file];
			}
			else {
				s += '_' + String(new_file_count);
				new_file_numbers[s] = new_file_count++;
				new_file_sizes[s] = log.file_size[file];
			}
			if (!file_names.hasOwnProperty(new_file_numbers[s])) {
				file_names[new_file_numbers[s]] = [];
			}
			file_names[new_file_numbers[s]].push(file);
		}
		//console.log(variants);
		//console.log(Object.keys(file_pages).length);
		for (var file in new_file_sizes) {
			new_log.file_size[new_file_numbers[file]] = new_file_sizes[file];
		}
		for (var page = 0; page < page_count; ++page) {
			new_log.pages[page] = [];
			for (var file in new_file_sizes) {
				if (file[page] == '1') {
					new_log.pages[page].push(new_file_numbers[file]);
				}
			}
		}
		//console.log(new_log.pages);
		log.sessions.forEach(function(session) {
			var cur_session = {
				pages: [],
				weight: session.weight
			};
			session.pages.forEach(function(page) {
				cur_session.pages.push(page_numbers[page]);
			});
			new_log.sessions.push(cur_session);
		});
		return {
			log:        new_log,
			page_names: page_names,
			file_names:  file_names
		};
	}

	function restore_names_in_bundling(bundling) {
		var new_bundling = {};
		for (var page in bundling) {
			var page_name = page_names[page];
			new_bundling[page_name] = [];
			bundling[page].forEach(function(bundle) {
				var new_bundle = [];
				for (var file in bundle.file_group) {
					//new_bundle.push(file_names[file]);
					file_names[file].forEach(function(old_file) {
						new_bundle.push(old_file);
					});
				}
				new_bundle.sort();
				new_bundling[page_name].push(new_bundle);
			});
		}
		return new_bundling;
	}

	function normalize_sessions(sessions, max_pause) {
		var user_sessions = {};
		sessions.forEach(function(hit) {
			if (!user_sessions.hasOwnProperty(hit[0])) {
				user_sessions[hit[0]] = [];
			}
			user_sessions[hit[0]].push(hit);
		});
		function hash_session(session) {
			return session.join();
		}
		var sessions = {};
		function add_session(session) {
			var hash = hash_session(session);
			if (!sessions.hasOwnProperty(hash)) {
				sessions[hash] = {
					pages: session,
			   		weight: 1
				};
			}
			else {
				sessions[hash].weight += 1;
			}
		}
		for (var user in user_sessions) {
			user_sessions[user].sort(function(a, b) {return a[2] - b[2]});
			var prev_time = -Infinity;
			var cur_session = [];
			user_sessions[user].forEach(function(hit) {
				if ((hit[2] - prev_time > max_pause) && (cur_session.length)) {
					add_session(cur_session);
					cur_session = [];
				}
				cur_session.push(hit[1]);
				prev_time = hit[2];
			});
			if (cur_session.length) {
				add_session(cur_session);
			}
		}
		var session_array = [];
		for (var hash in sessions) {
			session_array.push(sessions[hash]);
		}
		return session_array;
	}

	for (var page in raw_deps) {
		var page_file = raw_deps[page];
		logs.pages[page] = [];
		for (var file in page_file) {
			if (page_file[file].size) {
				logs.file_size[file] = (page_file[file].size || 0) / 1000;
				logs.pages[page].push(file);
			}
		}
	}

	deps = {};
	for (var page in raw_deps) {
		deps[page] = {};
		for (var file in raw_deps[page]) {
			if (logs.file_size.hasOwnProperty(file)) {
				deps[page][file] = [];
				var cur_file_deps = {};
				var cur_file_deps_length = raw_deps[page][file].deps.length;
				raw_deps[page][file].deps.forEach(function(file) {
					cur_file_deps[file] = true;
				});
				var worked_files = {};
				while (cur_file_deps_length) {
					for (var i in cur_file_deps) {
						if (!worked_files.hasOwnProperty(i)) {
							if (raw_deps[page][i].size) {
								deps[page][file].push(i);
							}
							raw_deps[page][i].deps.forEach(function(file) {
								if (!worked_files.hasOwnProperty(file)) {
									cur_file_deps[file] = true;
									++cur_file_deps_length;
								}
							});
						}
						worked_files[i] = true;
						delete cur_file_deps[i];
						--cur_file_deps_length;
					}
				}
			}
		}
	}

	logs.sessions = normalize_sessions(data.sessions, data.max_pause);

	logs = heuristic_log_change(logs);
	pages = logs.log.pages;
	file_size = logs.log.file_size;
	sessions = logs.log.sessions;
	page_names = logs.page_names;
	file_names = logs.file_names;

	this.generators = {
		'all':    gen_bundle_all,
		'none':   gen_bundle_none,
		'every':  gen_bundle_every_page,
		'mega':   gen_bundle_mega1
	};
}

exports.get_generators = function(data) {
	var bundler = new Bundler(data);
	return bundler.generators;
};
