define(['Utils'],function(Utils) {
	return {
		logLevel : 'debug',
		setLevel : function(level){
			this.logLevel = level;
		},
		debug : function() {
			this.log('debug', arguments);
		},
		info : function() {
			this.log('info', arguments);
		},
		notice : function() {
			this.log('notice', arguments);
		},
		warning : function() {
			this.log('warning', arguments);
		},
		error : function() {
			this.log('error', arguments);
		},
		levelCompare : function(maxLevel, nowLevel) {
			var level = {
				'debug' : 1,
				'info' : 2,
				'notice' : 3,
				'warning' : 4,
				'error' : 5,
			};
			if (!level[nowLevel] || !level[maxLevel]) {
				return false;
			}
			return level[nowLevel] >= level[maxLevel];
		},
		log : function(level, data) {
			if (data.length > 0
					& this.levelCompare(this.logLevel, level)) {
				
				var levelColor = {
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
