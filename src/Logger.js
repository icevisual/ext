define(['Utils'],function(Utils) {
	return {
		logLevel : 'log',
		setLevel : function(level){
			this.logLevel = level;
		},
		debug : function() {
			this.logData('debug', arguments);
		},
		info : function() {
			this.logData('info', arguments);
		},
		notice : function() {
			this.logData('notice', arguments);
		},
		warning : function() {
			this.logData('warning', arguments);
		},
		error : function() {
			this.logData('error', arguments);
		},
		log : function() {
			this.logData('log', arguments);
		},
		levelCompare : function(maxLevel, nowLevel) {
			var level = {
				'log' : 1,
				'debug' : 2,
				'info' : 3,
				'notice' : 4,
				'warning' : 5,
				'error' : 6,
			};
			if (!level[nowLevel] || !level[maxLevel]) {
				return false;
			}
			return level[nowLevel] >= level[maxLevel];
		},
		logData : function(level, data) {
			if (data.length > 0
					& this.levelCompare(this.logLevel, level)) {
				
				var levelColor = {
					'log' : 'black',
					'debug' : 'grey',
					'info' : 'green',
					'notice' : 'blue',
					'warning' : 'orange',
					'error' : 'red',
				};
				
				var dateStr = "%c[" + Utils.now() + "] " + level + ":";
				var output;
//				if (typeof data[0] == "string") {
//					data[0] = (dateStr += data[0]);
//					output = data;
//				} else {
					output = new Array();
					output.push(dateStr);
					output.push("font-weight:bold;color: " + levelColor[level]);
					for ( var i in data) {
						output.push(data[i]);
					}
//				}
				return console.log.apply(console, output);
			}
		}
	};
});
