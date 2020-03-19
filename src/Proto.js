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
			var caller = arguments.callee.caller;
			var names = this.getParameterName(caller);
			var params = {};
			for(var i = 0 ;i < arguments.length; i ++)
			{
				params[names[i]] = arguments[i];
			}
			
			return this.AssembleProto(CMDConst.Cmd_ScriptJump, params);
		},
		Cmd_ScriptPause: function(url, name, length) {
			return this.AssembleProto(CMDConst.Cmd_ScriptPause, {
				'url': url,
				'name': name,
				'length': length
			});
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

	// 1. 读取 url 判断 网站
	// 2. 通过不同网站获取适配播放器，界面渲染位置
	// 3. 渲染界面
	// 4. 读取当前播放视频 url ，视频名称
	// 5. 获取 播放器 元素，获取当前播放信息
	// 6. 判断当前在播放 【气味视频】
	// 7. 连接 websocket 保持通讯
	// 8. 将视频信息发送给 客户端 以判断是否是气味视频？
	// 9. 定时器循环读取视频进度

	return proto;

})