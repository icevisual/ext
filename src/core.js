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

	ws.createWebSocket("ws://127.0.0.1:38950/SmellPlayer");
	// 播放器 选择器
	var videoSeletor;
	// 附加 UI 容器 选择器
	var videoContainerSelector;

	var urlHost = window.location.host;
	// 先判断 爱奇艺
	if(urlHost.indexOf("iqiyi") > -1) {
		videoSeletor = "#flashbox video";
		videoContainerSelector = ".qy-player-side-head .head-title";
	} else {
		return;
	}
	// 获取 播放器 标签
	var $video = document.querySelector(videoSeletor);

	console.log("iqiyi video1=", $video);
	// 获取当前播放的视频名字
	var video_name = document.querySelector(".header-link").innerHTML;

	var i = 0;
	// 添加新 UI

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
					var ptime = parseInt($video.currentTime * 1000);
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
			ws.SendMessage(Proto.Cmd_PlayScript(parseInt($video.currentTime * 1000), script_id));
			script_start = true;
		}
	}
	// 定时读取 视频播放器 时间

	// 更改 定时 同步
	var _WaitVideoTimer = setInterval(function() {
		if($video) {
			if(!movie_start && $video.duration > 900) {
				movie_start = true;
				ws.SendMessage(Proto.Cmd_VideoInfo(window.location.href, video_name, parseInt($video.duration * 1000)));
				
				clearInterval(_WaitVideoTimer);
				return;
			}
			if(movie_start && script_start) {
				ws.SendMessage(Proto.Cmd_ScriptJump(parseInt($video.currentTime * 1000)));
			}
			//console.log("ws.readyState = " + ws.readyState);
			console.log("video pos=", video_name, $video.currentTime, "/", $video.duration);
		}
	}, 10000);
	// 每十次监测，强制加入 一次同步
	var checkLoopTime = 1;
	var _WatherTimer = setInterval(function() {
		if($video && movie_start && script_start) {
			var nowTime = parseInt($video.currentTime * 1000);
			if(checkLoopTime % 10 == 0 || Math.abs(nowTime - Watcher_loopInterval - Watcher_lastTime) > 100) {
				console.log("video Jump =", Watcher_lastTime, "/", parseInt($video.duration * 1000), "=>", nowTime, " / ", parseInt($video.duration * 1000));
				ws.SendMessage(Proto.Cmd_ScriptJump(nowTime));
			}
			checkLoopTime ++;
			Watcher_lastTime = nowTime;
		}
	}, Watcher_loopInterval);

	return {
		'ws': ws,
		'utils': Utils,
		'logger': Logger
	};
})