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
	
	ws.OnMessage = function(data) {
		if(data && data['code'] == 0 && data['cmd'] == 'VideoInfo') {
			console.log("Get Script And Play");
			ws.SendMessage(Proto.Cmd_PlayScript($video.duration,1));
			script_start = true;
		}
	}
	console.log("c1=",Proto.Cmd_VideoInfo(window.location.href, video_name, $video.duration))
	console.log("c2=",Proto.Cmd_PlaySmell(1,2,3))
	// 定时读取 视频播放器 时间
	setInterval(function() {
		if($video) {
			if(!movie_start && $video.duration > 900) {
				movie_start = true;
				var c = Proto.Cmd_VideoInfo(window.location.href, video_name, $video.duration);
				console.log("c=",c)
				ws.SendMessage(c);
				return;
			}
			if(movie_start && script_start) {
				ws.SendMessage(Proto.Cmd_ScriptJump(parseInt($video.currentTime * 1000)));
			}
			//console.log("ws.readyState = " + ws.readyState);
			console.log("video pos=", video_name, $video.currentTime, "/", $video.duration);
		}
	}, 5000);

	return {
		'ws': ws,
		'utils': Utils,
		'logger': Logger
	};
})