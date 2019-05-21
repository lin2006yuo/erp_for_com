console.log(`lib/screen`);
window.getDPI = function () {
    if (window.screen.deviceXDPI !== undefined) {
        return {x:window.screen.deviceXDPI, y:window.screen.deviceYDPI};
    }
    else {
        let tmpNode = document.createElement("DIV");
        tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
        document.body.appendChild(tmpNode);
        window.screen.deviceXDPI = parseInt(tmpNode.offsetWidth);
        window.screen.deviceYDPI = parseInt(tmpNode.offsetHeight);
        tmpNode.parentNode.removeChild(tmpNode);
        return getDPI();
    }
};

window.px2pt = function(px, decimal = 4){
    let dpi=getDPI();
    let num=parseInt(px);
    return (num*(72/dpi.y)).toFixed(decimal)
};