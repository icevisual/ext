require.config({
	paths: {
		'Utils': '../src/Utils',
		'WS': '../src/WS',
		'Logger': '../src/Logger',
		'SDK': '../src/Core'
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

var CMDConst = {

	Cmd_VideoInfo: 'VideoInfo',
	Cmd_PlaySmell: 'PlaySmell',
	Cmd_StopPlay: 'StopPlay',
	Cmd_PlayScript: 'PlayScript',
	Cmd_ScriptJump: 'ScriptJump',
	Cmd_ScriptPause: 'ScriptStop',
	Cmd_ScriptContinue: 'ScriptContinue',
	Cmd_ScriptStop: 'ScriptStop',
};

var proto = {
	getParameterName: function(fn) {
		if(typeof fn !== 'object' && typeof fn !== 'function') return;
		const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
		const DEFAULT_PARAMS = /=[^,)]+/mg;
		const FAT_ARROWS = /=>.*$/mg;
		let code = fn.prototype ? fn.prototype.constructor.toString() : fn.toString();
		code = code
			.replace(COMMENTS, '')
			.replace(FAT_ARROWS, '')
			.replace(DEFAULT_PARAMS, '');
		let result = code.slice(code.indexOf('(') + 1, code.indexOf(')')).match(/([^\s,]+)/g);
		return result === null ? [] : result;
	},
	AssembleProto: function(cmd, params) {
		var result = {
			cmd: cmd,
		};
		if(params) {
			result['params'] = params;
		}
		return JSON.stringify(result);
	},
	AssembleProtoAuto: function(cmd, paramNames, params) {
		var result = {
			cmd: cmd,
		};
		if(params) {
			result['params'] = {};
			for(var i = 0; i < params.length; i++) {
				result['params'][paramNames[i]] = params[i];
			}
		}
		return JSON.stringify(result);
	},
	Cmd_VideoInfo: function(url, name, length) {
		return this.AssembleProto(CMDConst.Cmd_VideoInfo, {
			'url': url,
			'name': name,
			'length': length
		});
	},

	Cmd_PlaySmell: function(smell, duration, channel) {
		return this.AssembleProto(CMDConst.Cmd_PlaySmell, {
			'smell': smell,
			'duration': duration,
			'channel': channel
		});
	},
	Cmd_StopPlay: function(channel) {
		return this.AssembleProto(CMDConst.Cmd_StopPlay, {
			'channel': channel
		});
	},
	Cmd_PlayScript: function(start, script_id) {

		return this.AssembleProto(CMDConst.Cmd_PlayScript, {
			'url': url,
			'name': name,
			'length': length
		});
	},
	Cmd_ScriptJump: function(url, name, length) {
		var caller = arguments.callee;
		var names = this.getParameterName(caller);
		var params = {};
		for(var i = 0; i < arguments.length; i++) {
			params[names[i]] = arguments[i];
		}

		return this.AssembleProto(CMDConst.Cmd_ScriptJump, params);
	},
	Cmd_ScriptPause: function(url, name, length) {
		return this.AssembleProtoAuto(CMDConst.Cmd_ScriptJump, this.getParameterName(arguments.callee),arguments);
	},
	Cmd_ScriptContinue: function(url, name, length) {
		return this.AssembleProto(CMDConst.Cmd_ScriptContinue, {
			'url': url,
			'name': name,
			'length': length
		});
	},
	Cmd_ScriptStop: function(url, name, length) {
		return this.AssembleProto(CMDConst.Cmd_ScriptStop, {
			'url': url,
			'name': name,
			'length': length
		});
	},
};