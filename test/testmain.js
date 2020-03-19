require.config({
	paths: {
		'ws': '/ext/ws',
		'jQuery': '/ext/jquery.min',
	},
	shim: {
		'jQuery': {
			exports: '$'
		},
	}
});

require(['ws'], function(ws) {
	ws.createWebSocket("ws://127.0.0.1:38950/SmellPlayer");

	console.log(ws);

})