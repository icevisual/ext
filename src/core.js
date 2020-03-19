define(['WS', 'Utils', 'Logger'], function(WS, Utils, Logger) {

	// 1. 读取 url 判断 网站
	// 2. 通过不同网站获取适配播放器，界面渲染位置
	// 3. 渲染界面
	// 4. 读取当前播放视频 url ，视频名称
	// 5. 获取 播放器 元素，获取当前播放信息
	// 6. 判断当前在播放 【气味视频】
	// 7. 连接 websocket 保持通讯
	// 8. 将视频信息发送给 客户端 以判断是否是气味视频？
	// 9. 定时器循环读取视频进度

	return {
		'ws': WS,
		'utils': Utils,
		'logger': Logger
	};
})