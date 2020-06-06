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
		},
		IsValidVideo: function() {
			// return this.Ready() && this.Duration() > 900000;
			return this.Ready() && this.Duration() > 0;
		},
		Paused: function () {
			return this.obj.paused;
		},
		Ended: function () {
			return this.obj.ended;
		},
		Buffered: function () {
			return this.obj.buffered.length > 0;
		},
		Played: function () {
			return this.obj.played.length > 0;
		},
		NeedSyncScript: function () {
			return this.Buffered() && this.Played() && !this.Ended() && !this.Paused()
		}
	}
	var logger = Logger;

	var MainWorker = {
		// 视频标签选择器
		videoSeletor: "",
		// 标题选择器
		titleSelector: "",
		// 底盘对象封装
		videoObj: videoObj,
		// 当前执行函数下标
		Index: 0,
		// 函数栈，实现链式调用
		Stack: [],
		// 添加调用函数
		AddCall: function(fn) {
			this.Stack.push(fn);
		},
		// 执行下一个函数
		NextStep: function() {
			if(this.Index < this.Stack.length) {

				var fn = this.Stack[this.Index];
				this.Index++;
				if(typeof fn === 'function') {
					fn();
				}
			}

		},
		// 执行函数栈
		Run: function() {
			this.NextStep();
		},
		// 循环监测时间：上一次播放器时间
		Watcher_lastTime: 0,
		// 循环监测时间：监测间隔
		Watcher_loopInterval: 2000,
		// 第一步：分析网站类型，获取不通的选择器
		Step_01_AnalyseWebSite: function() {
			var self = this;
			self.AddCall(function() {
				var urlHost = window.location.host;
				// 先判断 爱奇艺
				if(urlHost.indexOf("iqiyi") > -1) {
					self.videoSeletor = "#flashbox #youku-film-player video";
					self.titleSelector = ".header-link";
					self.videoObj.tag = 'iqiyi';
					self.NextStep();
				} else if(urlHost.indexOf("youku") > -1) {
					self.videoSeletor = '#ykPlayer video';
					self.videoObj.tag = 'youku';
					self.titleSelector = "#left-title-content-wrap .subtitle";
					self.NextStep();
				} else {}

			})
			return this;
		},
		// 第二步：获取页面上的视频元素和名称
		Step_02_GetVideoElemenet: function() {
			var self = this;
			self.AddCall(function() {
				var videoSeletor = self.videoSeletor;
				var titleSelector = self.titleSelector;
				// 获取 播放器 标签
				var $video = document.querySelector(videoSeletor);
				var videoObj = self.videoObj;

				if(!$video) {
					// 优酷延时载入视频
					// 载入时未找到视频标签
					var GetVideoTimer = setInterval(function() {
						$video = document.querySelector(videoSeletor);
						var video_name = document.querySelector(titleSelector).innerHTML;
						logger.log("GET_VIDEO F",videoObj.tag, video_name, "video=", $video);
						if($video) {
							videoObj.obj = $video;
							videoObj.name = video_name;
							clearInterval(GetVideoTimer)
							self.NextStep();
						}
					}, 2000);
				} else {
					videoObj.obj = $video;
					videoObj.name = document.querySelector(titleSelector).innerHTML;
					logger.log("GET_VIDEO D",videoObj.tag, videoObj.name, "video=", videoObj.obj);
					self.NextStep();
				}
			})
			return this;

		},
		// 第三部：获取合法的视频信息（过滤广告）
		Step_03_GetValidVideoInfo: function() {
			var self = this;
			self.AddCall(function() {
				var videoObj = self.videoObj;
				var movie_start = false;
				if(videoObj.Ready() && !movie_start && videoObj.IsValidVideo()) {
					logger.log("GET_POS F", videoObj.name, videoObj.CurrentTime(), "/", videoObj.Duration());
					movie_start = true;
					self.NextStep();
				} else {
					// 更改 定时 同步
					var _WaitVideoTimer = setInterval(function() {
						if(videoObj.Ready() && !movie_start && videoObj.IsValidVideo()) {
							logger.log("GET_POS D", videoObj.name, videoObj.CurrentTime(), "/", videoObj.Duration());
							movie_start = true;
							clearInterval(_WaitVideoTimer);
							self.NextStep();
						}
					}, 2000);
				}
			})
			return this;
		},
		// 第四步：询问 客户端，该视频是否有脚本
		Step_04_AskClientForScript: function() {
			var self = this;
			self.AddCall(function() {
				var videoObj = self.videoObj;
				var script_id = 0;
				logger.log("CONNECT_SERVER");
				ws.createWebSocket("ws://127.0.0.1:38950/SmellPlayer");
				ws.OnMessage = function(data) {
					logger.log("OnMessage Data", data);
					data = JSON.parse(data)
					var lowerCmd = data['cmd'].toString().toLowerCase();
					if(lowerCmd == 'scriptjump') {

						//		Success = 0,
						//      CtlNotConnected = 1,
						//      ParamsValidateFailed = 2,
						//      JsonDecodeError = 3,
						//      CmdNotSupported = 4,
						//
						//      NotScripting = 102,
						//      ScriptSyntaxError = 103,
						//      ScriptNotFound = 104,
						//      StartTimeLargerThanMaxTime = 105,
						//      AlreadyPaused = 106,
						//      NotPaused = 107,
						//      Unknown = 108,
						//      None,
						//      

						if(data['code'] == 102) {
							if(script_id) {
								var ptime = videoObj.CurrentTime();
								self.Watcher_lastTime = ptime;
								ws.SendMessage(Proto.Cmd_PlayScript(ptime, script_id));
							} else {
								logger.log("Jump Failed", "Script Not Played");
							}
						}
					}
					if(data && data['code'] == 0 && data['cmd'] && lowerCmd == 'videoinfo') {
						logger.log("Get Script And Play");
						script_id = parseInt(data['data']['script_id']);
						var script_length_ms = parseInt(data['data']['script_length_ms']);
						logger.log("script_id script_length_ms", script_id, script_length_ms);
						ws.SendMessage(Proto.Cmd_PlayScript(videoObj.CurrentTime(), script_id));

						if(self.videoObj.Paused())
						{
							self.VideoState.state = "pause";
							ws.SendMessage(Proto.Cmd_ScriptPause());
						}

						self.NextStep();
					}
				}
				ws.AddOpenHandlerOnece(function() {
					ws.SendMessage(Proto.Cmd_VideoInfo(window.location.href, videoObj.name, videoObj.Duration()));
				});
			})
			return this;
		},
		// 第五步：播放脚本
		Step_05_PlayScript: function() {
			var self = this;
			self.AddCall(function() {
				self.NextStep();
			})
			return this;
		},
		// 视频播放状态机
		VideoState: {
			state: 'play',
			play: function() {
				switch(this.state) {
					case 'standby':
						break;
					case 'play':
						break;
					case 'pause':
						ws.SendMessage(Proto.Cmd_ScriptContinue());
						break;
					case 'ended':
						ws.SendMessage(Proto.Cmd_ScriptContinue());
						break;
				}
				this.state = 'play';
			},
			pause: function() {
				switch(this.state) {
					case 'standby':
						ws.SendMessage(Proto.Cmd_ScriptPause());
						break;
					case 'play':
						ws.SendMessage(Proto.Cmd_ScriptPause());
						break;
					case 'pause':
						break;
					case 'ended':
						break;
				}
				this.state = 'pause';
			},
			ended: function() {
				switch(this.state) {
					case 'standby':
						ws.SendMessage(Proto.Cmd_ScriptPause());
						break;
					case 'play':
						ws.SendMessage(Proto.Cmd_ScriptPause());
						break;
					case 'pause':
						break;
					case 'ended':
						break;
				}
				this.state = 'ended';
			},
		},
		// 第五步：添加播放器事件
		Step_06_ListenVideoEvent: function() {
			var self = this;
			self.AddCall(function() {
				var videoObj = self.videoObj;

				var VideoState = self.VideoState;

				videoObj.obj.onplay = function() {
					logger.log("onplay");
					VideoState.play();
				}
				videoObj.obj.onpause = function() {
					logger.log("onpause");
					VideoState.pause();
				}
				videoObj.obj.onended = function() {
					logger.log("onended");
					VideoState.ended();
				}
				self.NextStep();
			})
			return this;
		},
		// 第七步：循环定时同步播放时间
		Step_07_SyncScriptPosition: function() {
			var self = this;
			self.AddCall(function() {
				// 每十次监测，强制加入 一次同步

				var checkLoopTime = 1;
				var videoObj = self.videoObj;
				var _WatherTimer = setInterval(function() {


					logger.log("VIDEO_OBJ =>", 
						videoObj.obj.paused, videoObj.obj.buffered, 
						videoObj.obj.played, videoObj.obj.ended);

					if(self.VideoState.state != 'play')
						return;

					if(!videoObj.NeedSyncScript())
						return;

					var nowTime = videoObj.CurrentTime();

					// logger.log("_WatherTimer", self.Watcher_lastTime,nowTime,checkLoopTime);

					if(checkLoopTime % 20 == 0 || Math.abs(nowTime - self.Watcher_loopInterval - self.Watcher_lastTime) > 100) {
						logger.log("video Jump =>", nowTime, " / ", videoObj.Duration());
						ws.SendMessage(Proto.Cmd_ScriptJump(nowTime));
					}
					checkLoopTime++;
					self.Watcher_lastTime = nowTime;
				}, self.Watcher_loopInterval);
			})
			return this;
		}
	};

	MainWorker
		.Step_01_AnalyseWebSite()
		.Step_02_GetVideoElemenet()
		.Step_03_GetValidVideoInfo()
		.Step_04_AskClientForScript()
		.Step_05_PlayScript()
		.Step_06_ListenVideoEvent()
		.Step_07_SyncScriptPosition()
		.Run();

	return {
		'ws': ws,
		'utils': Utils,
		'logger': Logger
	};
})