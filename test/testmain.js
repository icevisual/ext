require.config({
	paths: {
		'Utils': '../src/Utils',
		'WS': '../src/WS',
		'Logger': '../src/Logger',
		'SDK': '../src/Core',
		'Proto': '../src/Proto'
	},
	shim: {
		'jQuery': {
			exports: '$'
		},
	}
});

require(['WS'], function(ws) {
	ws.createWebSocket("ws://127.0.0.1:38950/SmellPlayer");

	console.log(ws);

})
