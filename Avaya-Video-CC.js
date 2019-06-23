angular.module('9691fbc7-c2c8-4585-8dc8-51e8557c65cb', [
    'core.services.WidgetAPI'
]).directive('avayaVideoCc', widgetComponent);

//初始化高度

function widgetComponent(WidgetAPI) {

    function widgetContainer(scope, element, params) {
        // Create a new instance of the Widget API
        var api = new WidgetAPI(params);

        // Insert your widget code here

        scope.initVideo = function () {
            console.log("initVideo");
            alert("initvideo");
            var localCanvas = document.getElementById("local");
            var remoteCanvas = document.getElementById("remote");
            localRender = new RenderCanvas(localCanvas);
            remoteRender = new RenderCanvas(remoteCanvas);
            localVideoInfoNode = document.getElementById("localVideoInfo");
            remoteVideoInfoNode = document.getElementById("remoteVideoInfo");
            smartsee.setPopupWnd("0");
            var config = getConfig();
            console.log(config);
            smartsee.initVoIP(config, 1);
            return false;
        }
        //----------------------------------------------------
        scope.releaseVideo = function () {
            smartsee.releaseVoIP();
            return false;
        };
        //初始化视频尺寸
        initVideoSize(videoSize);
        $(window).resize(function() {
            initVideoSize(videoSize);
        });

    }

    /////////////////////////////
    return {
        scope: {},
        replace: true,
        template: template,
        link: widgetContainer
    };
}