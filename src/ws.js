define([], function() {

	var ws = {
		options: {
			reconnectInterval: 2000,
		},
		lockReconnect: false,
		wsObj: null,
		wsUrl: "",
		reconnect: function(url) {
			if(this.lockReconnect) return;
			this.lockReconnect = true;
			var self = this;
			setTimeout(function() { //没连接上会一直重连，设置延迟避免请求过多
				self.createWebSocket(url);
				self.lockReconnect = false;
			}, this.options.reconnectInterval);
		},
		log: function(msg) {
			console.log(msg);
		},
		createWebSocket: function(url) {
			console.log("createWebSocket");
			this.wsUrl = url;
			try {
				if('WebSocket' in window) {
					this.wsObj = new WebSocket(url);
				} else if('MozWebSocket' in window) {
					this.wsObj = new MozWebSocket(url);
				} else {
					this.log("当前浏览器不支持websocket协议,建议使用现代浏览器")
				}
				this.initEventHandle();
			} catch(e) {
				this.reconnect(url);
			}
		},
		initEventHandle: function() {
			self = this;
			this.wsObj.onclose = function() {
				self.log("onclose");
				self.reconnect(self.wsUrl);
			};
			this.wsObj.onerror = function(err) {
				self.log("onerror");
				self.reconnect(self.wsUrl);
			};
			this.wsObj.onopen = function() {
				self.log("onopen");
				self.heartCheck.start();
			};
			this.wsObj.onmessage = function(event) {
				console.log("onmessage", event.Data);
				self.heartCheck.reset();
			}
		},
		heartCheck: {
			timeout: 10000, //60s
			timeoutObj: null,
			serverTimeoutObj: null,
			reset: function() {
				clearTimeout(this.timeoutObj);
				clearTimeout(this.serverTimeoutObj);　　　　
				this.start();
			},
			start: function() {
				var self = this;
				this.timeoutObj = setTimeout(function() {
					ws.wsObj.send("{'cmd':'Ping'}");
					self.serverTimeoutObj = setTimeout(function() {
						ws.wsObj.close();
						//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
					}, self.timeout)
				}, this.timeout)
			},
		}
	}

	return ws;
})