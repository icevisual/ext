

// 1. 读取 url 判断 网站
// 2. 通过不同网站获取适配播放器，界面渲染位置
// 3. 渲染界面
// 4. 读取当前播放视频 url ，视频名称
// 5. 获取 播放器 元素，获取当前播放信息
// 6. 判断当前在播放 【气味视频】
// 7. 连接 websocket 保持通讯
// 8. 将视频信息发送给 客户端 以判断是否是气味视频？
// 9. 定时器循环读取视频进度



require(['SDK'],function(SDK){
	console.log(SDK);
	SDK.ws.createWebSocket("ws://127.0.0.1:38950/SmellPlayer");
});




var videoSeletor;
var videoContainerSelector;

var urlHost = window.location.host;

if (urlHost.indexOf("youku") > -1) {
    videoSeletor = "#ykPlayer video";
    videoContainerSelector = "#ykPlayer .youku-film-player";
} else if (urlHost.indexOf("iqiyi") > -1) {
    videoSeletor = "#flashbox video";
    videoContainerSelector = ".qy-player-side-head .head-title";
}
console.log("video0=", $(videoSeletor));
var $video = document.querySelector(videoSeletor);
// var $video = document.querySelector('#flashbox video');
console.log("video1=", $video);
var container = document.createElement("DIV");
container.style.position = "absolute";
container.style.top = 0;
container.style.right = 0;
container.style.opacity = 0.7;
container.style.zIndex = 99999;
container.className = "ynk-playback-control";
// <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">

function addMeta(name,content){//手动添加mate标签
    let meta = document.createElement('meta');
    meta.content=content;
    meta.httpEquiv=name;
    document.getElementsByTagName('head')[0].appendChild(meta);
}

addMeta("Content-Security-Policy" ,"upgrade-insecure-requests");

var downBtn = document.createElement("BUTTON");
downBtn.appendChild(document.createTextNode("<<"));
downBtn.addEventListener("click", function () {
    $video.playbackRate -= 0.25;
    updateRate();
})

var rateBtn = document.createElement("BUTTON");
rateBtn.style.width = "40px";
rateBtn.appendChild(document.createTextNode("Rate"));
rateBtn.addEventListener("click", function () {
    $video.playbackRate = 1;
    updateRate();
})

var upBtn = document.createElement("BUTTON");
upBtn.appendChild(document.createTextNode(">>"));
upBtn.addEventListener("click", function () {
    $video.playbackRate += 0.25;
    updateRate();
})

var fullScreenBtn = document.createElement("BUTTON");
fullScreenBtn.appendChild(document.createTextNode("[ ]"));
fullScreenBtn.addEventListener("click", function () {
    if(document.webkitIsFullScreen){
        document.webkitExitFullscreen();
    }else{
        $video.parentElement.webkitRequestFullScreen();
    }
})


function updateRate() {
    rateBtn.innerHTML = $video.playbackRate;
}

container.appendChild(downBtn);
container.appendChild(rateBtn);
container.appendChild(upBtn);
container.appendChild(fullScreenBtn);

function youkuVideoElementInserted(e) {
    console.log(e.target.nodeName);
    if (e.target.nodeName === "VIDEO") {
        document.body.querySelector(videoContainerSelector).appendChild(container);
        updateRate();
        document.querySelector("#ykPlayer").removeEventListener("DOMNodeInserted", youkuVideoElementInserted)
    }
}
var i = 0;
function avav()
{
    console.log("videoContainerSelector0",i,document.body.querySelector(videoContainerSelector));
    if (document.body.querySelector(videoContainerSelector)) {
        console.log(container);
        document.body.querySelector(videoContainerSelector).appendChild(container);
        console.log("videoContainerSelector1",document.body.querySelector(videoContainerSelector));

        updateRate();
    } else {
        $("#ykPlayer").on("DOMNodeInserted", function (e) {
            if (e.target.nodeName === "VIDEO") {
                $video = document.querySelector(videoSeletor);
                document.body.querySelector(videoContainerSelector).appendChild(container);
                updateRate();
            }
        })
    }
    i ++;
}
//
//
//var ws = new WebSocket("ws://127.0.0.1:38950/SmellPlayer");
//ws.onopen = function() {
//   console.log("opend");
//};
//ws.onmessage = function(e) {
//console.log("client：接收到服务端的消息 " + e.data);
//
//};
//ws.onclose = function(params) {
//console.log("client：关闭连接");
//};
//console.log("ws.readyState = " + ws.readyState);
//var ScritpChangePosition = function(start)
//{
//  start = parseInt(start * 1000);
//  if(ws.readyState == ws.OPEN)
//  {
//      ws.send("{'cmd':'ScriptJump','params':{'start':"+start+"}}");
//  } 
//  else{
//      console.log("WS Not Ready " + ws.readyState);
//  }
//}
//
//var SendStartScript = function(script_id, start)
//{
//  start = parseInt(start * 1000);
//  if(ws.readyState ==ws.OPEN)
//  {
//      ws.send("{'cmd':'PlayScript','params':{'start':"+start+",'script_id':"+script_id+"}}");
//  } 
//  else{
//      console.log("WS Not Ready " + ws.readyState);
//  }
//}


var movie_start = false;
// name
// document.querySelector(".header-link").innerHTML
// link = window.location.href
// 
var video_name = document.querySelector(".header-link").innerHTML;
setInterval(function(){
    if($video)
    {
        if (!movie_start && $video.duration > 3600)
        {
            //movie_start = true;
            //SendStartScript(1,$video.currentTime);
            return;
        }
        if(movie_start) {
            //ScritpChangePosition($video.currentTime);
        }
        //console.log("ws.readyState = " + ws.readyState);
        console.log("video pos=",video_name, $video.currentTime,"/",$video.duration);
    }
    if(!document.querySelector('.ynk-playback-control'))
    {
        avav();
    }


},5000);


                   


