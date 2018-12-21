/**
 * Created by RondaFul on 2017/8/14.
 */

const  childs=[
    {name:'resizeL',param:[true, false, false, true]},
    {name:'resizeT',param:[false, true, true, false]},
    {name:'resizeR',param:[false, false, false, true]},
    {name:'resizeB',param:[false, false, true, false]},
    {name:'resizeLT',param:[true, true, false, false]},
    {name:'resizeTR',param:[false, true, false, false]},
    {name:'resizeBR',param:[false, false, false, false]},
    {name:'resizeLB',param:[true, false, false, false]},
];
// const  childs=[
//     {name:'resizeL',type:[0,3],length:4,action(item,el,els,move){
//     }},
//     {name:'resizeT',type:[1,2],length:4,action(item,el,els,move){
//
//     }},
//     {name:'resizeR',type:[3],length:4,action(item,el,els,move){
//
//     }},
//     {name:'resizeB',type:[2],length:4,action(item,el,els,move){
//
//     }},
//     {name:'resizeLT',type:[0,1],length:4,action(item,el,els,move){
//
//     }},
//     {name:'resizeTR',type:[1],length:4,action(item,el,els,move){
//
//     }},
//     {name:'resizeBR',type:[],length:4,action(item,el,els,move){
//
//     }},
//     {name:'resizeLB',type:[0],length:4,action(item,el,els,move){
//
//     }},
// ];
export  default  function(Vue){
    Vue.directive('change', {
        bind(el, bind, vnode){
            let style={
                left:0,top:0,
                position:'absolute',
                minWidth:'10px',minHeight:'10px'
            }
            Object.assign(el.style,style,bind.value||{})
            let move=document.createElement('div');
            let obj={
                width:parseInt(el.style.width)-10+'px',
                height:parseInt(el.style.height)-10+'px',
                minWidth:'20px',minHeight:'10px',
                opacity:0,
                margin:'5px',
                position:"absolute",
                left:'0',top:'0',cursor:'move'
            };
            Object.assign(move.style,obj);
            let first=el.firstChild;
            if(!first){
                el.appendChild(move);
                drag(el,move);
            }else {
                el.insertBefore(move,first)
                drag(el,move);
            }
            bind.def.resize=resize;
            bind.def.drag=drag;
            childs.forEach(row=>{
                let els=document.createElement('div')
                els.className=row.name;
                el.appendChild(els);
                // row.action.call(row,row,el,els,move)
                resize(el,els,row.param[0],row.param[1],row.param[2],row.param[3],move)
            })
        },
        update(el, bind, vnode){
            let data={
                fontFamily:bind.value.fontFamily,
                fontSize:bind.value.fontSize,
                textAlign:bind.value.textAlign,
                fontWeight:bind.value.fontWeight,
                fontStyle:bind.value.fontStyle,
                textDecoration:bind.value.textDecoration,
                '-webkit-transform':bind.value['-webkit-transform']
            };
            Object.assign(el.style,data||{})
        },
        removesize(handle){
            handle.onmousedown=null;
        },
        unbind(el, bind){
            let first=el.firstChild;
            bind.def.removesize(first);
            el.removeChild(first);
            childs.forEach(row=>{
                let els= el.querySelector(`.${row.name}`)
                bind.def.removesize(els);
                el.removeChild(els);
            })
        }
    })}
function drag(oDrag, handle) {
    var disX = 0,disY = 0;
    handle = handle || oDrag;
    handle.style.cursor = "move";
    handle.onmousedown = function (event) {
        var event = event || window.event;
        disX = event.clientX - oDrag.offsetLeft;
        disY = event.clientY - oDrag.offsetTop;
        document.onmousemove =debounce(0, function (event) {
            var event = event || window.event;
            var iL = event.clientX - disX;
            var iT = event.clientY - disY;
            var maxL = oDrag.parentNode.offsetWidth - oDrag.offsetWidth;
            var maxT = oDrag.parentNode.offsetHeight - oDrag.offsetHeight;
            iL <= 0 && (iL = 0);
            iT <= 0 && (iT = 0);
            iL >= maxL && (iL = maxL);
            iT >= maxT && (iT = maxT);
            oDrag.style.left = iL-2+ "px";
            oDrag.style.top = iT-2 + "px";
            return false
        });
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            this.releaseCapture && this.releaseCapture()
        };
        this.setCapture && this.setCapture();
        return false
    };
}
function resize(oParent, handle, isLeft, isTop, lockX, lockY,child){
    var dragMinWidth = parseInt(oParent.style.minWidth);
    var dragMinHeight = parseInt(oParent.style.minHeight);
    handle.onmousedown = function (event) {
        var event = event || window.event;
        var disX = event.clientX - handle.offsetLeft;
        var disY = event.clientY - handle.offsetTop;
        var iParentTop = oParent.offsetTop;
        var iParentLeft = oParent.offsetLeft;
        var iParentWidth = oParent.offsetWidth;
        var iParentHeight = oParent.offsetHeight;
        document.onmousemove =debounce(0,function (event) {
            var event = event || window.event;
            var iL = event.clientX - disX;
            var iT = event.clientY - disY;
            var maxW = oParent.parentNode.offsetWidth-2;
            var maxH = oParent.parentNode.offsetHeight-2;
            var iW = isLeft ? iParentWidth - iL : handle.offsetWidth + iL;
            var iH = isTop ? iParentHeight - iT : handle.offsetHeight + iT;
            isLeft && (oParent.style.left = iParentLeft + iL + "px");
            isTop && (oParent.style.top = iParentTop + iT + "px");
            iW < dragMinWidth && (iW = dragMinWidth);
            iW > maxW && (iW = maxW);
            lockX || (oParent.style.width = iW + "px")&&(child.style.width=(iW-10)*0.8+'px');
            iH < dragMinHeight && (iH = dragMinHeight);
            iH > maxH && (iH = maxH);
            lockY || (oParent.style.height = iH + "px")&&(child.style.height=(iH-10)*0.8+'px');
            if((isLeft && iW == dragMinWidth) || (isTop && iH == dragMinHeight)) document.onmousemove = null;
            return false;
        })
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;};
        return false;
    }
};
