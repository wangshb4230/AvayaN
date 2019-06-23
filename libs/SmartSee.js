// window.onload = function () {
  // Class for SmartSee
//全局变量
//初始化高度
var initHeight;
//默认尺寸
var videoSize = 1280 / 720;


var localVideoInfoNode = null;
var remoteVideoInfoNode = null;


var smartsee = new SmartSee();
smartsee.connectSmartSee(false, 7023, onOpen, onClose, onStatus, onCallStatus, onMessageReceived, onMqMessageReceived, onVideoFrame);

//改变远程视频的尺寸
  function setVideo2Size(width, height) {
    console.log("进入setVideo2Size");
    console.log("width:"+width);
    console.log("height:"+height);
    $("#video2").find(".panel-body").css("height", height + "px");
    $("#video2").find(".panel-body").css("width", width + "px");
  }

//改变本地视频的尺寸
  function setVideo1Size(width, height) {
    console.log("进入setVideo1Size");
    console.log("width:"+width);
    console.log("height:"+height);
    $("#video1").find(".panel-body").css("height", height + "px");
    $("#video1").find(".panel-body").css("width", width + "px");
  }

//第一次初始化尺寸
  function initVideoSize(size) {
    //初始化视频尺寸
    //获取视频宽度
    console.log("进入initVideoSize");
    console.log("size:"+size);
    var width = $("#video1").css("width");
    var height = parseInt(width.replace("px", "")) / size;
    $("#video1").find(".panel-body").css("height", height + "px");
    $("#video2").find(".panel-body").css("height", height + "px");
    initHeight = height;
  }


  //smartsee.startSmartSee();


  //初始化视频尺寸
  initVideoSize(videoSize);
  $(window).resize(function () {
    initVideoSize(videoSize);
  });


  function onOpen() {
    console.log("进入onOpen");
    $("#wsStatus").val("Connected");
    console.log("onOpen");
  }

  function onClose(reason) {
    console.log("进入"+"onClose");
    $("#wsStatus").val("Disconnected");
    setTimeout(smartsee.connectSmartSee(false, 7023, onOpen, onClose, onStatus, onCallStatus, onMessageReceived, onMqMessageReceived, onVideoFrame), 3000);
    localRender.clearCanvas(244, 164, 96); //sandybrown
    remoteRender.clearCanvas(244, 164, 96); //sandybrown
    console.log(reason);
  }

  function onStatus(req_cmd, code, description) {
    console.log("进入"+"onStatus");
    $("#status").val(req_cmd + "," + code + "," + description);
    if (req_cmd == "rv") { //releaseVoIP
      console.log("进入"+"req_cmd == rv");
      localRender.clearCanvas(244, 164, 96); //sandybrown
      remoteRender.clearCanvas(244, 164, 96); //sandybrown
    } else if (req_cmd == "sv" || req_cmd == "sa") {
      console.log("进入"+"req_cmd == sv || req_cmd == sa");
      $("#filePath").val(description);
    }
    console.log(req_cmd, code, description);
  }

  function onCallStatus(callid, code, status, content) {
    console.log("进入"+"onCallStatus");
    $("#callStatus").val(callid + "," + code + "," + status + "," + content);
    if (code == 5) { //disconnected
      console.log("进入"+"code == 5");
      localRender.clearCanvas(244, 164, 96); //sandybrown
      remoteRender.clearCanvas(244, 164, 96); //sandybrown
    }
    console.log(callid, code, status);
  }

  function onMessageReceived(fromUser, message) {
    console.log("进入"+"onMessageReceived");
    $("#receivedMessage").val(fromUser + "," + message);
    console.log(fromUser, message);
  }

  function onMqMessageReceived(message) {
    console.log("进入"+"onMqMessageReceived");
    var msg = JSON.parse(message);
    var type = msg.Type;
    if (type == "sendfile") {
      console.log("进入"+"type == sendfile");
      var result = msg.Result; //success or error
      var resMsg = msg.Message;//OK or uninitialized,httpcode,wrongresponse,sendmq
      $("#upDownloadResult").val(result + ", " + resMsg);
    } else if ("进入"+type == "progress") {
      console.log("type == progress");
      var rate = msg.Result;
      $("#upDownProgress").val(rate + "%");
    } else if ("进入"+ type == "downloadfile") {
      console.log("进入"+"type == downloadfile");
      var result = msg.Result; //success or error
      var resMsg = msg.Message; //type|fromuser|filename
      $("#upDownloadResult").val(result + ", " + resMsg);
    }
    console.log(message);
  }

  function onVideoFrame(isLocal, width, height, videoData) {
    console.log("进入"+"onVideoFrame");
    console.log(isLocal, width, height);
    if (isLocal) {
      console.log("进入"+"onVideoFrame》isLocal");
      var fps = localRender.drawImage(videoData, width, height);
      if (fps > -1) {
        console.log("进入"+"isLocal》fps > -1");
        localVideoInfoNode.textContent = "FPS: " + fps + ", Resolution: " + width + "x" + height;
      }
    } else {
      console.log("进入"+"onVideoFrame》else");
      var fps = remoteRender.drawImage(videoData, width, height);
      if (fps > -1) {
        console.log("进入"+"fps > -1");
        remoteVideoInfoNode.textContent = "FPS: " + fps + ", Resolution: " + width + "x" + height;
      }
    }

    size = parseInt(width) / parseInt(height);
    if (!isNaN(size) && size != null && size != "") {
      videoSize = size;
    }
  }


  // $('.change').lobiPanel({
  //   sortable: true,
  //   minWidth: 300,
  //   minHeight: 300,
  //   maxWidth: 2000,
  //   maxHeight: 2000,
  //   unpin: {
  //     tooltip: '拖动'
  //   },
  //   reload: {
  //     tooltip: '重新加载'
  //   },
  //   minimize: {
  //     tooltip: '最小化'
  //   },
  //   close: {
  //     tooltip: '关闭'
  //   },
  //   editTitle: {
  //     tooltip: '编辑'
  //   },
  //   expand: {
  //     tooltip: '全屏'
  //   }
  // });

  //最大化时保持视频比例
  function keepSize(panelObj) {
    var bodyWidth = $(panelObj).find(".panel-body").width();
    var videoHeight = bodyWidth / videoSize;
    var bodyHeight = $(panelObj).find(".panel-body").height();

    if (bodyHeight > videoHeight) {
      $(panelObj).find("canvas").css("margin-left", "0px");
      $(panelObj).find("canvas").css("width", bodyWidth + "px");
      $(panelObj).find("canvas").css("height", videoHeight + "px");
      $(panelObj).find("canvas").css("margin-top", ((bodyHeight - videoHeight) / 2) + "px");
    } else {
      var videoWidth = bodyHeight * videoSize;
      var bodyWidth = $(panelObj).find(".panel-body").width();
      $(panelObj).find("canvas").css("margin-top", "0px");
      $(panelObj).find("canvas").css("height", bodyHeight + "px");
      $(panelObj).find("canvas").css("width", videoWidth + "px");
      $(panelObj).find("canvas").css("margin-left", ((bodyWidth - videoWidth) / 2) + "px");
    }
  }

  $('.lobipanel').on('onPin.lobiPanel', function (ev, lobiPanel) {
    $(this).find(".panel-body").height(initHeight);
  });

  var lastChangeWidth, lastChangeHeight, changeType;
  var changeCount = 0;
  $('.lobipanel').on('resizeStart.lobiPanel', function (ev, lobiPanel) {
    //改变窗口大小前
    $(window).unbind("resize");
    lastChangeWidth = $('.lobipanel').lobiPanel("getWidth");
    lastChangeHeight = $('.lobipanel').lobiPanel("getHeight");
  });

  $('.lobipanel').on('resizeStop.lobiPanel', function (ev, lobiPanel) {
    //改变窗口大小结束后，绑定浏览器窗口大小改变事件
    $(window).resize(function () {
      initVideoSize(videoSize);
    });

    //改变窗口大小结束后
    bodyWidth = $('.lobipanel').lobiPanel("getWidth");
    bodyHeight = $('.lobipanel').lobiPanel("getHeight");

    if (changeType == "width") {
      $(this).lobiPanel("setHeight", bodyWidth / videoSize);
      $(this).find("canvas").css("height", "100%");
      $(this).find("canvas").css("width", "100%");
    } else if (changeType == "height") {
      $(this).lobiPanel("setWidth", bodyHeight * videoSize);
      $(this).find("canvas").css("height", "100%");
      $(this).find("canvas").css("width", "100%");
    }

    changeCount = 0;
    changeType = "";
  });
  $('.lobipanel').on('onResize.lobiPanel', function (ev, lobiPanel) {
    bodyWidth = $('.lobipanel').lobiPanel("getWidth");
    bodyHeight = $('.lobipanel').lobiPanel("getHeight");

    if (changeCount == 0 || !changeType) {
      //第一次变更
      if (lastChangeWidth != bodyWidth && lastChangeHeight != bodyHeight) {
        //同时改变宽高
        changeType = "height&width";
      } else if (lastChangeWidth != bodyWidth) {
        //改变的是宽度
        changeType = "width";
      } else if (lastChangeHeight != bodyHeight) {
        //改变的是高度
        changeType = "height";
      }
    }
    changeCount++;

    if (changeCount % 7 === 0) {
      if (changeType == "width") {
        $(this).lobiPanel("setHeight", bodyWidth / videoSize);
        $(this).find("canvas").css("height", "100%");
        $(this).find("canvas").css("width", "100%");
      } else if (changeType == "height") {
        $(this).lobiPanel("setWidth", bodyHeight * videoSize);
        $(this).find("canvas").css("height", "100%");
        $(this).find("canvas").css("width", "100%");
      }
    }
  });


  $('.lobipanel').on('onFullScreen.lobiPanel', function (ev, lobiPanel) {
    keepSize(this);
  });

  floatFlag = 0;//浮动标记 0 未浮动  1 已浮动
  $('.lobipanel').on('onSmallSize.lobiPanel', function (ev, lobiPanel) {
    //最小化后
    if (!floatFlag) {
      //窗口未浮动 恢复最初大小
      initVideoSize(videoSize);
    }
    $(this).find("canvas").css("margin-top", "0px");
    $(this).find("canvas").css("margin-left", "0px");
    $(this).find("canvas").css("height", "100%");
    $(this).find("canvas").css("width", "100%");
  });

  $('.lobipanel').on('onPin.lobiPanel', function (ev, lobiPanel) {
    //面板被固定后
    $(this).find("canvas").css("margin-top", "0px");
    $(this).find("canvas").css("margin-left", "0px");
    $(this).find("canvas").css("height", "100%");
    $(this).find("canvas").css("width", "100%");
    floatFlag = 0;
  });

  $('.lobipanel').on('beforeUnpin.lobiPanel', function (ev, lobiPanel) {
    //面板浮动前
    floatFlag = 1;
  });


  $("#startSmartSee").bind("click", function () {
    window.location.href = "smartsee://voip";
    //window.open("smartsee://");
    return false;
  });

  $("#initVoIP").bind("click", function () {
    smartsee.setPopupWnd("0");
    alert("initvoip")
    var config = getConfig();
    alert(config)
    smartsee.initVoIP(config, 1);
    return false;
  });

  $("#makeCall").bind("click", function () {
    var remoteUri = $("#remoteUri").val();
    smartsee.makeCall(remoteUri);
    return false;
  });

  $("#answerCall").bind("click", function () {
    smartsee.answerCall();
    return false;
  });

  $("#endCall").bind("click", function () {
    smartsee.endCall();
    return false;
  });

  $("#startPreview").bind("click", function () {
    smartsee.startPreview();
    return false;
  });

  $("#stopPreview").bind("click", function () {
    smartsee.stopPreview();
    localRender.clearCanvas(244, 164, 96); //sandybrown
    return false;
  });

  $("#getCameraList").bind("click", function () {
    smartsee.getCameraList();
    return false;
  });

  $("#switchCamera").bind("click", function () {
    var cameraId = $("#cameraId").val();
    smartsee.switchCamera(cameraId);
    return false;
  });

  $("#muteMic").bind("click", function () {
    smartsee.muteDevice(1, 0);
    return false;
  });

  $("#unMuteMic").bind("click", function () {
    smartsee.muteDevice(0, 0);
    return false;
  });

  $("#muteSpeaker").bind("click", function () {
    smartsee.muteDevice(1, 1);
    return false;
  });

  $("#unMuteSpeaker").bind("click", function () {
    smartsee.muteDevice(0, 1);
    return false;
  });

  $("#muteVideoIn").bind("click", function () {
    smartsee.muteDevice(1, 2);
    return false;
  });

  $("#unMuteVideoIn").bind("click", function () {
    smartsee.muteDevice(0, 2);
    return false;
  });

  $("#releaseVoIP").bind("click", function () {
    smartsee.releaseVoIP();
    return false;
  });

  $("#sendMessage").bind("click", function () {
    var remoteUri = $("#toUser").val();
    var message = $("#msgContent").val();
    smartsee.sendMessage(0, remoteUri, message);
    return false;
  });

  $("#startShare").bind("click", function () {
    smartsee.shareScreen(1);
    return false;
  });

  $("#stopShare").bind("click", function () {
    smartsee.shareScreen(0);
    return false;
  });

  $("#sendFile").bind("click", function () {
    var toUser = $("#toUser").val();
    var filepath = $("#filePath").val();
    smartsee.sendFile(toUser, filepath);
    return false;
  });


  $("#getResolution").bind("click", function () {
    smartsee.getResolution();
    return false;
  });

  $("#captureRemoteCamera").bind("click", function () {
    var remoteUser = $("#toUser").val();
    smartsee.captureRemoteCamera(remoteUser);
    return false;
  });

  $("#captureRemoteSreen").bind("click", function () {
    var remoteUser = $("#toUser").val();
    smartsee.captureRemoteScreen(remoteUser);
    return false;
  });

  $("#recordRemoteSreen").bind("click", function () {
    var remoteUser = $("#toUser").val();
    smartsee.recordRemoteCamera(remoteUser);
    return false;
  });

  $("#startShortVideo").bind("click", function () {
    smartsee.shortVideo(1);
    return false;
  });

  $("#stopShortVideo").bind("click", function () {
    smartsee.shortVideo(0);
    return false;
  });

  $("#startShortAudio").bind("click", function () {
    smartsee.shortAudio(1);
    return false;
  });

  $("#stopShortAudio").bind("click", function () {
    smartsee.shortAudio(0);
    return false;
  });

  $("#inviteRemoteUser").bind("click", function () {
    var remoteUser = $("#toUser").val();
    var dialNumber = $("#dialNumber").val();
    smartsee.inviteRemoteUser(remoteUser, dialNumber);
    return false;
  });

  $("#dropRemoteUser").bind("click", function () {
    var remoteUser = $("#toUser").val();
    smartsee.dropRemoteUser(remoteUser);
    return false;
  });

  $("#snapShot").bind("click", function () {
    alert("snapShot");
    $.ajax({
      type: "get",    //请求方式
      async: false,    //是否异步
      url: "http://localhost:60000/operation/queryrecord?confid=71008",
      //dataType:"jsonp",    //跨域json请求一定是jsonp
      //jsonp: "callbackparam",    //跨域请求的参数名，默认是callback
      //jsonpCallback:"successCallback",    //自定义跨域参数值，回调函数名也是一样，默认为jQuery自动生成的字符串
      //data:{"query":"civilnews"},    //请求参数

      beforeSend: function () {
        //请求前的处理
      },

      success: function (data) {
        //请求成功处理，和本地回调完全一样
        alert(data.message);
        alert(data.code);
      },

      complete: function () {
        //请求完成的处理
      },

      error: function () {
        //请求出错处理
      }
    });
  });


  $(".init-icon").bind("click", function () {
    $(this).parent("div").hide();
    return false;
  })


  /*@param {Object} userid 注册用户名
    * @param {Object} psw 注册密码
    * @param {Object} aliasname 别名
    * @param {Object} localIp 本地ip
    * @param {Object} localPort 本地port，不填默认5249
    * @param {Object} sipserverIp sip服务器ip，如果不填，呼叫对方时，使用ip进行p2p呼叫
    * @param {Object} sipserverPortStr sip服务器端口号，如果不填，呼叫对方时，使用ip进行呼叫
    * @param {Object} greenscreen 是否启用绿屏抠图功能
    */
  function getConfig() {
    var userid = $("#userId").val();
    var psw = $("#password").val();
    var aliasname = $("#aliasName").val();
    var localIp = $("#localIp").val();
    var localPort = $("#localPort").val();
    var sipserverIp = $("#serverIp").val();
    var sipserverPortStr = $("#serverPort").val();
    var greenScreen = $("#greenScreen").prop("checked");
    var cameraId = $("#cameraId").val();
    var mqServerIp = $("#mqServerIp").val();
    var mqServerPort = $("#mqServerPort").val();
    var mqVHost = $("#mqVHost").val();
    var mqId = $("#mqId").val();
    var mqPassword = $("#mqPassword").val();
    var fileServerIp = $("#fileServerIp").val();
    var fileServerPort = $("#fileServerPort").val();
    var maxBitrate = 0;
    var maxResolution = 0;

    if (localPort == "")
      localPort = "5249";
    if (aliasname == "")
      aliasname = userid;
    if (cameraId == "")
      cameraId = "0";

    var strXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
    strXml += "<config>";
    strXml += "<DisplayName value = \"";
    strXml += aliasname;
    strXml += "\"/>";
    strXml += "<UserName value = \"";
    strXml += userid;
    strXml += "\"/>";
    strXml += "<AuthUser value = \"";
    strXml += userid;
    strXml += "\"/>";
    strXml += "<Password value = \"";
    strXml += psw;
    strXml += "\"/>";
    strXml += "<UserDomain value = \"";
    strXml += sipserverIp;
    strXml += "\"/>";
    strXml += "<ManagerSrv value = \"\"/>";
    strXml += "<RecordPath value = \".\\\"/>";
    strXml += "<RecordSrv value = \".\\\"/>";
    strXml += "<SystemSrv value = \"\"/>";
    strXml += "<ShareServer value = \"\"/>";
    strXml += "<LocalAddress value = \"";
    strXml += localIp;
    strXml += "\"/>";
    strXml += "<LocalPort value =\"";
    strXml += localPort;
    strXml += "\"/>";
    strXml += "<RegisterAddress value = \"";
    strXml += sipserverIp;
    strXml += "\"/>";
    strXml += "<RegisterPort value=\"";
    strXml += sipserverPortStr;
    strXml += "\"/>";
    strXml += "<OutboundProxy  value = \"\" />";
    strXml += "<TransportType value=\"0\"/>";
    strXml += "<TransferType value=\"0\"/>";
    strXml += "<Forward_UnConditional value=\"\"/>";
    strXml += "<Forward_Busy value=\"\"/>";
    strXml += "<Forward_NoAnswer value=\"\"/>";
    strXml += "<AutoAnswer value=\"0\"/>";
    strXml += "<CalloutTimeOut  value=\"30\"/>";
    strXml += "<AudioCodecs value=\"opus,pcma,pcmu\"/>";
    strXml += "<VideoCodecs value=\"h264,videofec\"/>";
    strXml += "<MaxVideoBitrate value=\"5\"/>"; //3:256000, 4:384000 5:512000
    strXml += "<MaxVideoResolution value=\"6\"/>"; //3: vga, 4: 4cif, 5:wvga 6:720p
    strXml += "<VideoFrameRate value=\"2\"/>";
    strXml += "<VideoIFrameInterval value=\"6\"/>";
    strXml += "<DataPresentationPrecent value=\"0\"/>";
    strXml += "<VideoFixed value=\"0\"/>";
    strXml += "<VideoSVC value=\"0\"/>";
    strXml += "<VideoMotionDection value=\"0\"/>";
    strXml += "<DefaultLoadVideo value=\"\"/>";
    strXml += "<Camera value=\"";
    strXml += cameraId;
    strXml += "\"/>";
    strXml += "<CameraFormat value=\"0\"/>"; //0: YV12, 1:RGB24, 2:MJPG, 3:YUY2
    strXml += "<H264ProfileLevel value=\"2\"/>";
    strXml += "<VideoWidthResolution value=\"1\"/>";
    strXml += "<VideoPacket value=\"0\"/>";
    strXml += "<VideoNetChecker value=\"0\"/>";
    strXml += "<ColorEnhance value=\"0\"/>";
    strXml += "<VideoQuality value=\"2\"/>";
    strXml += "<DataShareEnable value=\"0\"/>"; // 0: disable, 1: tcp bfcp 2: udp bfcp
    strXml += "<DataMaxVideoBitrate value=\""; //0: auto: default:384000, 1:128000, 2:256000, 3:384000, 4:512000, 5:1024000
    strXml += maxBitrate;
    strXml += "\"/>";
    strXml += "<DataMaxVideoResolution value=\""; //0:auto resolution 1280*768, 1:640*480, 2:704*576, 3:1280*720, 4:1280*768, 5:1920*1072
    strXml += maxResolution;
    strXml += "\"/>";
    strXml += "<P2P value=\"0\"/>"; //0: disable, 1: enable
    strXml += "<LogLevel value=\"NONE\"/>";// NONE, ERR, WARNING, INFO, DEBUG
    strXml += "<LogType value=\"FILE\"/>"; //COUT | FILE
    strXml += "<EnableEncrypt value=\"0\"/>"; //0: disable, 1: negotiation encrypt, 2: force encrypt
    strXml += "<MqIP value=\"";
    strXml += mqServerIp;
    strXml += "\"/>";
    strXml += "<MqPort value=\"";
    strXml += mqServerPort;
    strXml += "\"/>";
    strXml += "<MqVHost value = \"";
    strXml += mqVHost;
    strXml += "\"/>";
    strXml += "<MqExchange value=\"amq.direct\"/>";
    strXml += "<MqID value=\"";
    strXml += mqId;
    strXml += "\"/>";
    strXml += "<MqPassword value=\"";
    strXml += mqPassword;
    strXml += "\"/>";
    strXml += "<MqAutoDelete value=\"0\"/>";
    strXml += "<FileServerIp value=\"";
    strXml += fileServerIp;
    strXml += "\"/>";
    strXml += "<FileServerPort value=\"";
    strXml += fileServerPort;
    strXml += "\"/>";
    strXml += "<UseLocalFileServer value=\"1\"/>";
    strXml += "<EnableGreenScreen value=\"";
    strXml += greenScreen;
    strXml += "\"/>";
    strXml += "<BackgroundFile value=\"./background.jpg\"/>";
    strXml += "<LowHSV value=\"35,43,46\"/>";
    strXml += "<HighHSV value=\"77,255,255\"/>";
    strXml += "</config>";
    return strXml;
  }







  function SmartSee() {
    var canvas = document.createElement('Canvas');

    this.localVideo = null;
    this.localVideoLen = 0;
    this.localWidth = 0;
    this.localHeight = 0;
    this.remoteVideo = null;
    this.remoteVideoLen = 0;
    this.remoteWidth = 0;
    this.remoteHeight = 0;

    this.isInit = false;

    // Start and connect SmartSee backend
    this.connectSmartSee = function (isSecure,wsPort,onOpen, onClose, onStatus, onCallStatus, onMessageReceived, onMqMessageReceived, onVideoFrame) {
      //TODO, Start smartsee process

      // Connect to samrtsee process
      if(isSecure)
        this.ws = new WebSocket("wss://127.0.0.1:" + wsPort);
      else
        this.ws = new WebSocket("ws://127.0.0.1:" +  + wsPort);
      this.ws.onopen = function (event) {
        onOpen();
      }
      this.ws.onclose = function (event) {
        onClose(event.reason); //https://tools.ietf.org/html/rfc6455#section-11.7
      }
      this.ws.onmessage = this.onMessage.bind(this);
      this.onStatus = onStatus;
      this.onCallStatus = onCallStatus;
      this.onMessageReceived = onMessageReceived;
      this.onMqMessageReceived = onMqMessageReceived;
      this.onVideoFrame = onVideoFrame;
    }
    /*
          this.closeWebsocket = function(){
              if(this.ws.readyState == WebSocket.OPEN)
              this.ws.close();
          }
      */
    // Set Popup Windows for VoIP; 0: no pop; 1: pop; other error
    this.setPopupWnd = function (pop) {
      if (this.ws.readyState == WebSocket.OPEN) {
        var cmd = "po`" + pop;
        this.ws.send(cmd);
      } else {
        this.onStatus("po","-2", "wrong websocket state.")
      }
    }
    // Initialize VoIP, startCamera:0 or 1
    this.initVoIP = function (xml,startCamera) {
      if (this.ws.readyState == WebSocket.OPEN) {
        alert("进入initVoip      if")
        var cmd = "iv`" + xml + "`" + startCamera;
        this.ws.send(cmd);
      } else {
        this.onStatus("iv","-2", "wrong websocket state.")
      }
    }

    // Make call
    this.makeCall = function (remoteUri) {
      if (this.ws.readyState == WebSocket.OPEN) {
        var cmd = "mc`" + remoteUri;
        this.ws.send(cmd);
      } else {
        this.onStatus("mc","-2", "wrong websocket state.")
      }
    }

    // Answer call
    this.answerCall = function () {
      if (this.ws.readyState == WebSocket.OPEN) {
        var cmd = "ac`";
        this.ws.send(cmd);
      } else {
        this.onStatus("ac", "-2", "wrong websocket state.")
      }
    }

    // End call
    this.endCall = function () {
      if (this.ws.readyState == WebSocket.OPEN) {
        var cmd = "ec`";
        this.ws.send(cmd);
      } else {
        this.onStatus("ec", "-2", "wrong websocket state.")
      }
    }

    // Start preview
    this.startPreview = function () {
      if (this.ws.readyState == WebSocket.OPEN) {
        var cmd = "tp`";
        this.ws.send(cmd);
      } else {
        this.onStatus("tp", "-2", "wrong websocket state.")
      }
    }

    // Stop preview
    this.stopPreview = function () {
      if (this.ws.readyState == WebSocket.OPEN) {
        var cmd = "pp";
        this.ws.send(cmd);
      } else {
        this.onStatus("pp", "-2", "wrong websocket state.")
      }
    }

    // Get camera list
    this.getCameraList = function () {
      if (this.ws.readyState == WebSocket.OPEN) {
        var cmd = "gc";
        this.ws.send(cmd);
      } else {
        this.onStatus("gc", "-2", "wrong websocket state.")
      }
    }

    // Switch camera
    this.switchCamera = function (cameraId) {
      if (this.ws.readyState == WebSocket.OPEN) {
        var cmd = "sc`" + cameraId;
        this.ws.send(cmd);
      } else {
        this.onStatus("sc", "-2", "wrong websocket state.")
      }
    }

    // Mute/Unmute device
    this.muteDevice = function (mute,device) {
      if (this.ws.readyState == WebSocket.OPEN) {
        var cmd = "mt`" + mute + "`" + device;
        this.ws.send(cmd);
      } else {
        this.onStatus("sc", "-2", "wrong websocket state.")
      }
    }

    // Send message, type: 0-mq, 1-sip
    this.sendMessage = function (type, remoteUser, message) {
      if (this.ws.readyState == WebSocket.OPEN) {
        var content = message.replace(/`/g,"'");
        var cmd = "sm`" + type + "`" + remoteUser + "`" + content;
        this.ws.send(cmd);
      } else {
        this.onStatus("sc", "-2", "wrong websocket state.")
      }
    }

    // Share screen
    this.shareScreen = function (enabled) {
      if (this.ws.readyState == WebSocket.OPEN) {
        var cmd = "sn`" + enabled;
        this.ws.send(cmd);
      } else {
        this.onStatus("sc", "-2", "wrong websocket state.")
      }
    }

    // Share screen
    this.sendFile = function (remoteUser, filePath) {
      if (this.ws.readyState == WebSocket.OPEN) {
        var cmd = "sf`" + remoteUser + "`" + filePath;
        this.ws.send(cmd);
      } else {
        this.onStatus("sc", "-2", "wrong websocket state.")
      }
    }

    // Get resolution
    this.getResolution = function () {
      if (this.ws.readyState == WebSocket.OPEN) {
        var cmd = "gr";
        this.ws.send(cmd);
      } else {
        this.onStatus("gc", "-2", "wrong websocket state.")
      }
    }

    // Capture remote camera
    this.captureRemoteCamera = function (remoteUser) {
      if (this.ws.readyState == WebSocket.OPEN) {
        var cmd = "cc`" + remoteUser;
        this.ws.send(cmd);
      } else {
        this.onStatus("cc", "-2", "wrong websocket state.")
      }
    }

    // Capture remote screen
    this.captureRemoteScreen = function (remoteUser) {
      if (this.ws.readyState == WebSocket.OPEN) {
        var cmd = "cn`" + remoteUser;
        this.ws.send(cmd);
      } else {
        this.onStatus("cn", "-2", "wrong websocket state.")
      }
    }

    // Record  remote camera
    this.recordRemoteCamera = function (remoteUser) {
      if (this.ws.readyState == WebSocket.OPEN) {
        var cmd = "rc`" + remoteUser;
        this.ws.send(cmd);
      } else {
        this.onStatus("rc", "-2", "wrong websocket state.")
      }
    }

    // Start/Stop short video
    this.shortVideo = function (start) {
      if (this.ws.readyState == WebSocket.OPEN) {
        var cmd = "sv`" + start;
        this.ws.send(cmd);
      } else {
        this.onStatus("sv", "-2", "wrong websocket state.")
      }
    }

    // Start/Stop short audio
    this.shortAudio = function (start) {
      if (this.ws.readyState == WebSocket.OPEN) {
        var cmd = "sa`" + start;
        this.ws.send(cmd);
      } else {
        this.onStatus("sa", "-2", "wrong websocket state.")
      }
    }

    // Invite remote user
    this.inviteRemoteUser = function (remoteUser, dialNumber) {
      if (this.ws.readyState == WebSocket.OPEN) {
        var cmd = "ir`" + remoteUser + "`" + dialNumber;
        this.ws.send(cmd);
      } else {
        this.onStatus("ir", "-2", "wrong websocket state.")
      }
    }

    // Drop remote user
    this.dropRemoteUser = function (remoteUser) {
      if (this.ws.readyState == WebSocket.OPEN) {
        var cmd = "dr`" + remoteUser;
        this.ws.send(cmd);
      } else {
        this.onStatus("dr", "-2", "wrong websocket state.")
      }
    }

    // Release VoIP
    this.releaseVoIP = function () {
      if (this.ws.readyState == WebSocket.OPEN) {
        var cmd = "rv";
        this.ws.send(cmd);
      } else {
        this.onStatus("-2", "wrong websocket state.")
      }
      this.isInit = false;
    }

    this.parseMessage = function (message) {
      var cmd = message.substr(0, 2);
      if (cmd == "re") { // response
        var params = getParameters(message, 3);
        if (params.length == 0)
          this.onStatus("-1", "wrong response.")
        else {
          if (params[0] == "iv" && params[1] == 0)
            this.isInit = true;
          this.onStatus(params[0], params[1], params[2]);
        }
      } else if (cmd == "cs") { //call status
        var params = getParameters(message, 4);
        if (params.length == 0)
          this.onStatus("-3", "wrong call status.")
        else
          this.onCallStatus(params[0], params[1], params[2],params[3]);
      } else if (cmd == "mr") { //message received
        var params = getParameters(message, 2);
        if (params.length == 0)
          this.onStatus("-3", "wrong call status.")
        else
          this.onMessageReceived(params[0], params[1]);
      } else if (cmd == "mq") { //MQ message received
        var params = getParameters(message, 1);
        if (params.length == 0)
          this.onStatus("-3", "wrong call status.")
        else
          this.onMqMessageReceived(params[0]);
      } else if (cmd == "vd" && this.isInit) { // video frame data
        this.parseVideoFrame(message);
      }
    }

    this.parseVideoFrame = function (buffer) {
      var params = getParameters(buffer, 3)
      if (params.length > 0) {
        var isLocal = params[0] == "l";
        var width = parseInt(params[1]);
        var height = parseInt(params[2]);
        var nextIndex = parseInt(params[3]);
        var videoData = buffer.substr(nextIndex);
        if (isLocal) { //local video
          this.onVideoFrame(isLocal, width, height, videoData);
        } else { //remote video
          this.onVideoFrame(isLocal, width, height, videoData);
        }
      }
    }

    this.onMessage = function (event) {
      this.parseMessage(event.data);
    }
  }


// Class for rendering image to page
  function RenderCanvas(canvas) {
    this.webgl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    this.canvas = canvas;
    this.lastRenderTime = (new Date()).getTime();
    this.elapsedTime = 0;
    this.frameCount = 0;
    this.frameDuration = 0;
    this.image = new Image();

    if(this.webgl){
      initWebGL(this.webgl);
    }else{
      this.ctx = this.canvas.getContext("2d");
    }

    this.drawImage = function (data, width, height) {
      now = (new Date()).getTime();
      deltaTime = now - this.lastRenderTime;
      this.lastRenderTime = now;
      this.elapsedTime += deltaTime;
      this.frameDuration += deltaTime;
      this.frameCount++;
      var fps = -1;
      if (this.frameCount >= 10) {
        fps = parseInt(1000.0 * this.frameCount / this.frameDuration);
        if (!(isNaN(fps) == false && fps < 1000)) {
          fps = -1;
        }
        this.frameCount = 0;
        this.frameDuration = 0;
      }

      this.canvas.width=width;
      this.canvas.height = height;

      if(this.webgl){
        this.webgl.viewport(0, 0,this.webgl.drawingBufferWidth, this.webgl.drawingBufferHeight);
        //设置纹素格式，jpg格式对应gl.RGB
        this.webgl.texImage2D(this.webgl.TEXTURE_2D, 0, this.webgl.RGB, this.webgl.RGB, this.webgl.UNSIGNED_BYTE, this.image);
        this.webgl.uniform1i(this.u_Sampler, 0);//纹理缓冲区单元TEXTURE0中的颜色数据传入片元着色器
        this.webgl.drawArrays(this.webgl.TRIANGLE_STRIP, 0, 4);
      }else{
        //draw last frame first, then load new frame, otherwize flash
        this.ctx.drawImage(this.image, 0, 0);
      }
      this.image.src = data;
      return fps;
    }

    this.clearCanvas = function (red, green, blue) {
      if(this.webgl){
        this.webgl.clearColor(red/255.0, green/255.0, blue/255.0, 1.0);
        this.webgl.clear(this.webgl.COLOR_BUFFER_BIT);
      }else{
        this.ctx.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  function initWebGL(gl){
    //顶点着色器源码
    var vertexShaderSource = '' +
        'attribute vec4 a_Position;' +//顶点位置坐标
        'attribute vec2 a_TexCoord;' +//纹理坐标
        'varying vec2 v_TexCoord;' +//插值后纹理坐标
        'void main(){' +
        'gl_Position = a_Position;' +//逐顶点处理
        'v_TexCoord = a_TexCoord;' +//纹理坐标插值计算
        '}';
    //片元着色器源码
    var fragShaderSource = '' +
        'precision highp float;' +//所有float类型数据的精度是lowp
        'varying vec2 v_TexCoord;' +//接收插值后的纹理坐标
        'uniform sampler2D u_Sampler;' +//纹理图片像素数据
        'void main(){' +
        //采集纹素，逐片元赋值像素值
        'gl_FragColor = texture2D(u_Sampler,v_TexCoord);' +
        '}';
    //初始化着色器
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertexShader,vertexShaderSource);
    gl.shaderSource(fragmentShader,fragShaderSource);
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);
    var program = gl.createProgram();
    gl.attachShader(program,vertexShader);
    gl.attachShader(program,fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    /**
     * 从program对象获取相关的变量
     * attribute变量声明的方法使用getAttribLocation()方法
     * uniform变量声明的方法使用getAttribLocation()方法
     **/
    this.a_Position = gl.getAttribLocation(program, 'a_Position');
    this.a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
    this.u_Sampler = gl.getUniformLocation(program, 'u_Sampler');
    /**
     * 四个顶点坐标数据data，z轴为零
     * 定义纹理贴图在WebGL坐标系中位置
     **/
    var data = new Float32Array([
      -1.0, 1.0,//左上角——v0
      -1.0, -1.0,//左下角——v1
      1.0, 1.0,//右上角——v2
      1.0, -1.0 //右下角——v3
    ]);
    /**
     * 创建UV纹理坐标数据textureData
     **/
    var textureData = new Float32Array([
      0, 1,//左上角——uv0
      0, 0,//左下角——uv1
      1, 1,//右上角——uv2
      1, 0 //右下角——uv3
    ]);
    /**
     创建缓冲区buffer，向顶点着色器传入顶点位置数据data
     **/
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(this.a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.a_Position);
    /**
     创建缓冲区textureBuffer，向顶点着色器传入顶点纹理坐标数据textureData
     **/
    var textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, textureData, gl.STATIC_DRAW);
    gl.vertexAttribPointer(this.a_TexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.a_TexCoord);

    var texture = gl.createTexture();//创建纹理图像缓冲区
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); //纹理图片上下反转
    gl.activeTexture(gl.TEXTURE0);//激活0号纹理单元TEXTURE0
    gl.bindTexture(gl.TEXTURE_2D, texture);//绑定纹理缓冲区
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //设置纹理贴图填充方式(纹理贴图像素尺寸大于顶点绘制区域像素尺寸)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //设置纹理贴图填充方式(纹理贴图像素尺寸小于顶点绘制区域像素尺寸)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  }

//return: param array
  function getParameters(buffer, paramCount) {
    var params = new Array();
    var startIndex = 3;
    var endIndex = 3;
    while (true) {
      endIndex = buffer.indexOf("`", startIndex);
      if (endIndex > startIndex) {
        params.push(buffer.substring(startIndex, endIndex));
        if (params.length == paramCount) {
          params.push(endIndex + 1);
          break;
        }
        startIndex = endIndex + 1;
      } else if (endIndex == -1) {
        params.push(buffer.substring(startIndex));
        if (params.length == paramCount)
          params.push(-1);
        else
          params = [];
        break;
      } else {
        params = [];
        break;
      }
    }
    return params;
  }

  function stringToUint8Array(str) {
    var buf = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
      buf[i] = str.charCodeAt(i);
    }
    return buf;
  }

  if (!Uint8Array.prototype.indexOf) {
    Uint8Array.prototype.indexOf = function (obj, start) {
      for (var i = (start || 0), j = this.length; i < j; i++) {
        if (this[i] === obj) { return i; }
      }
      return -1;
    }
  }





// }
