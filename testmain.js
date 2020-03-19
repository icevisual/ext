	console.log("www222");
	require.config({
	    paths : {
	        'ws' : '/ext/ws',
	        'jQuery' : '/ext/jquery.min',
	    },
	    shim : {
	        'jQuery' : {
	            exports : '$'
	        },
	    }
	});
	console.log("www222");
	require(['ws'],function(ws){
		
			console.log("www");

		ws.createWebSocket("ws://127.0.0.1:38950/SmellPlayer");
		
		console.log(ws);
		


		
	})
	