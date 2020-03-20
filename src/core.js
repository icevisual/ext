define(['WS', 'Utils', 'Logger', 'Proto'], function(ws, Utils, Logger, Proto) {

	// 1. 读取 url 判断 网站
	// 2. 通过不同网站获取适配播放器，界面渲染位置
	// 3. 渲染界面
	// 4. 读取当前播放视频 url ，视频名称
	// 5. 获取 播放器 元素，获取当前播放信息
	// 6. 判断当前在播放 【气味视频】
	// 7. 连接 websocket 保持通讯
	// 8. 将视频信息发送给 客户端 以判断是否是气味视频？
	// 9. 定时器循环读取视频进度

	var MainWorker = {
		videoSeletor: "",
		titleSelector: "",
		Step_01_AnalyseWebSite: function() {

			return this;
		},
		Step_02_GetVideoElemenet: function() {
			return this;
		},
		Step_03_GetValidVideoInfo: function() {
			return this;
		},
		Step_04_AskClientForScript: function() {
			return this;
		},
		Step_05_PlayScript: function() {
			return this;
		},
		Step_06_ListenVideoEvent: function() {
			return this;
		},
		Step_07_SyncScriptPosition: function() {
			return this;
		}
	};

	// 播放器 选择器
	var videoSeletor;
	// 附加 UI 容器 选择器
	var videoContainerSelector;

	var titleSelector;

	var videoObj = {
		obj: null,
		tag: "",
		Ready: function() {
			return this.obj ? true : false;
		},
		CurrentTime: function() {

			return parseInt(this.obj.currentTime * 1000);
		},
		Duration: function() {

			return parseInt(this.obj.duration * 1000);
		}
	}

	var urlHost = window.location.host;
	// 先判断 爱奇艺
	if(urlHost.indexOf("iqiyi") > -1) {
		videoSeletor = "#flashbox video";
		videoContainerSelector = ".qy-player-side-head .head-title";
		titleSelector = ".header-link";
		videoObj.tag = 'iqiyi';
	} else if(urlHost.indexOf("youku") > -1) {
		videoSeletor = '#ykPlayer video';
		videoObj.tag = 'youku';
		titleSelector = "#left-title-content-wrap .subtitle";
	} else {
		return;
	}

	ws.createWebSocket("ws://127.0.0.1:38950/SmellPlayer");

	// 获取 播放器 标签
	var $video = document.querySelector(videoSeletor);

	if(!$video) {
		// 载入时未找到视频标签

		var GetVideoTimer = setInterval(function() {

			$video = document.querySelector(videoSeletor);
			console.log(videoObj.tag, video_name, "video=", $video);
			if($video) {
				videoObj.obj = $video;
				clearInterval(GetVideoTimer)
			}
		}, 2000);

	} else {

		videoObj.obj = $video;

	}

	// 获取当前播放的视频名字
	var video_name = document.querySelector(titleSelector).innerHTML;
	console.log(videoObj.tag, video_name, "video=", $video);
	var movie_start = false;
	var script_start = false;
	var script_id = 0;
	// 循环 监测 视频是否跳转
	var Watcher_lastTime = 0;
	var Watcher_loopInterval = 2000;

	ws.OnMessage = function(data) {
		console.log("data", data);
		data = JSON.parse(data)

		if(data['cmd'].toString().toLowerCase() == 'scriptjump') {
			if(data['code'] == 102) {
				if(script_id) {
					var ptime = videoObj.CurrentTime();
					Watcher_lastTime = ptime;
					ws.SendMessage(Proto.Cmd_PlayScript(ptime, script_id));
					script_start = true;
				} else {
					console.log("Jump Failed", "Script Not Played");
					script_start = false;
				}
			}

		}

		if(data && data['code'] == 0 && data['cmd'] && data['cmd'].toString().toLowerCase() == 'videoinfo') {
			console.log("Get Script And Play");
			script_id = parseInt(data['msg']);
			ws.SendMessage(Proto.Cmd_PlayScript(videoObj.Duration(), script_id));
			script_start = true;
		}
	}
	// 定时读取 视频播放器 时间 

	// 更改 定时 同步
	var _WaitVideoTimer = setInterval(function() {
		if(videoObj.Ready()) {
			if(!movie_start && $video.duration > 900) {
				movie_start = true;
				ws.SendMessage(Proto.Cmd_VideoInfo(window.location.href, video_name, videoObj.Duration()));

				clearInterval(_WaitVideoTimer);
				return;
			}
			if(movie_start && script_start) {
				ws.SendMessage(Proto.Cmd_ScriptJump(videoObj.CurrentTime()));
			}
			//console.log("ws.readyState = " + ws.readyState);
			console.log("video pos=", video_name, videoObj.CurrentTime(), "/", videoObj.Duration());
		}
	}, 10000);
	// 每十次监测，强制加入 一次同步
	var checkLoopTime = 1;
	var _WatherTimer = setInterval(function() {
		if(videoObj.Ready() && movie_start && script_start) {
			var nowTime = parseInt($video.currentTime * 1000);
			if(checkLoopTime % 10 == 0 || Math.abs(nowTime - Watcher_loopInterval - Watcher_lastTime) > 100) {
				console.log("video Jump =", Watcher_lastTime, "/", videoObj.Duration(), "=>", nowTime, " / ", videoObj.Duration());
				ws.SendMessage(Proto.Cmd_ScriptJump(nowTime));
			}
			checkLoopTime++;
			Watcher_lastTime = nowTime;
		}
	}, Watcher_loopInterval);

	return {
		'ws': ws,
		'utils': Utils,
		'logger': Logger
	};
})