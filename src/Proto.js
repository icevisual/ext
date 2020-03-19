define([], function() {

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
			if(params && paramNames && params.length > 0 && paramNames.length > 0) {
				result['params'] = {};
				for(var i = 0; i < params.length; i++) {
					result['params'][paramNames[i]] = params[i];
				}
			}
			return JSON.stringify(result);
		},
		Cmd_VideoInfo: function(url, name, length) {
			return this.AssembleProtoAuto(CMDConst.Cmd_VideoInfo, this.getParameterName(arguments.callee), arguments);
		},

		Cmd_PlaySmell: function(smell, duration, channel) {
			return this.AssembleProtoAuto(CMDConst.Cmd_PlaySmell, this.getParameterName(arguments.callee), arguments);
		},
		Cmd_StopPlay: function(channel) {
			return this.AssembleProtoAuto(CMDConst.Cmd_StopPlay, this.getParameterName(arguments.callee), arguments);
		},
		Cmd_PlayScript: function(start, script_id) {
			return this.AssembleProtoAuto(CMDConst.Cmd_PlayScript, this.getParameterName(arguments.callee), arguments);
		},
		Cmd_ScriptJump: function(start) {
			return this.AssembleProtoAuto(CMDConst.Cmd_ScriptJump, this.getParameterName(arguments.callee), arguments);
		},
		Cmd_ScriptPause: function() {
			return this.AssembleProtoAuto(CMDConst.Cmd_ScriptPause, this.getParameterName(arguments.callee), arguments);
		},
		Cmd_ScriptContinue: function() {
			return this.AssembleProtoAuto(CMDConst.Cmd_ScriptContinue, this.getParameterName(arguments.callee), arguments);
		},
		Cmd_ScriptStop: function() {
			return this.AssembleProtoAuto(CMDConst.Cmd_ScriptStop, this.getParameterName(arguments.callee), arguments);
		},
	};

	return proto;

})