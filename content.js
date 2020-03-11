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

var $video = document.querySelector(videoSeletor);
// var $video = document.querySelector('#flashbox video');
console.log("video=", $video);
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



// name
// document.querySelector(".header-link").innerHTML
// link = window.location.href
// 
var video_name = document.querySelector(".header-link").innerHTML;
setInterval(function(){
    if($video)
        console.log("video pos=",video_name, $video.currentTime,"/",$video.duration);
    if(!document.querySelector('.ynk-playback-control'))
    {
        avav();
    }

    // $.ajax({
    //     //请求方式
    //     type : "GET",
    //     //请求的媒体类型
    //     contentType: "application/json;charset=UTF-8",
    //     //请求地址
    //     url : "http://192.168.1.8:19999/api/login",
    //     //请求成功
    //     success : function(result) {
    //         console.log(result);
    //     },
    //     //请求失败，包含具体的错误信息
    //     error : function(e){
    //         console.log(e.status);
    //         console.log(e.responseText);
    //     }
    // });
},5000);

