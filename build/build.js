({
	baseUrl: "../lib",
	optimize: 'none',
	paths: {
		'Utils': '../src/Utils',
		'WS': '../src/WS',
		'Logger': '../src/Logger',
		'SDK': '../src/Core',
		'Proto': '../src/Proto',
	},
	out: "sdk.min.js",
	name: '../build/SDK-compress'
})