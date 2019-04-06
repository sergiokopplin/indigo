exports.config = {
	sessions: [
		['u1', 'p1', 0],
		['u1', 'p2', 1],
		['u2', 'p3', 0],
		['u2', 'p1', 5],
		['u1', 'p3', 2],
		['u2', 'p2', 2]
	],
	file_cost: 10,
	kb_cost: 2,
	max_pause: 3600
};
exports.pages = [
	[
		'p1', {
			'depsSets': {
				'c1': {'deps': [], 'size': 1},
				'c2': {'deps': [], 'size': 2},
				'c3': {'deps': [], 'size': 3}
			}
		}
	],
	[
		'p2', {
			'depsSets': {
				'c1': {'deps': [], 'size': 1},
				'c4': {'deps': [], 'size': 4},
				'c3': {'deps': [], 'size': 3}
			}
		}
	],
	[
		'p3', {
			'depsSets': {
				'c1': {'deps': [], 'size': 1},
				'c5': {'deps': [], 'size': 5},
				'c3': {'deps': [], 'size': 3}
			}
		}
	]
];
