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

// var  client = new Paho.MQTT.Client(
//         '127.0.0.1',
//         1803, 1 );

// var hdls = new Handlers(this);

// // set callback handlers

// client.onConnectionLost = hdls.onConnectionLost;
// client.onMessageArrived = hdls.onMessageArrived;
// client.onMessageDelivered = hdls.onMessageDelivered;

// client.connect({
//     onSuccess : hdls.onConnect,
//     onFailure : connectFailCallback,
//     userName : mqttConfig.accessKey,
//     password : Utils.SecretEncrpt(mqttConfig.accessKey,
//             mqttConfig.accessSecret),
// });


    require(['SDK'],function(SDK){
        console.log('SDK ',SDK)
    });


// Create a client instance
var client = new Paho.MQTT.Client('127.0.0.1', 8083, "clientId");

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect});


// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe("World");

 //  var payloadArray = new Uint8Array([0xf5,0x55]);
  var message = new Paho.MQTT.Message('payloadArray');
    message.destinationName = "World";
    message.qos = 1;

  client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
    var payloadArray = new Uint8Array(message.payloadString);
  console.log("onMessageArrived:",payloadArray);
}

// localstorage 可用单只针对当前网站，可以考虑  起一个服务器网页 存储 cookie ，允许跨域，在不通网页之间 传递信息
//localStorage.setItem('env',"envvvvvvv");
                            
        // "mqttws31.js",
        // "require.js",
        // "OpenSDK.min.js",