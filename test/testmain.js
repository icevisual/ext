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
var proto;
var ws ;
require(['WS', 'Proto'], function(iws, Proto) {
	iws.createWebSocket("ws://127.0.0.1:38950/SmellPlayer");
	ws = iws;
	console.log(ws);
	proto = Proto;
})