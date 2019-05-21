/**
 * Created by RondaFul on 2017/7/24.
 */
export default function(Vue){
    Vue.directive('table', {
        bind(el, bind, vnode){
            var dragColumns  = el.rows[0].cells;
            if (!dragColumns) return;
            var dragColumnNo;
            var dragX;
            var saveOnmouseup;
            var saveOnmousemove;
            var saveBodyCursor;
           let  changeColumnWidth=(no, w)=>{
               if (!dragColumns) return false;
               if (no < 0) return false;
               if (dragColumns.length < no) return false;
               if (parseInt(dragColumns[no].style.width) <= -w) return false;
               if (dragColumns[no+1] && parseInt(dragColumns[no+1].style.width) <= w) return false;
               dragColumns[no].style.width = parseInt(dragColumns[no].style.width) + w +'px';
               if (dragColumns[no+1])
                   dragColumns[no+1].style.width = parseInt(dragColumns[no+1].style.width) - w + 'px';
               return true;
           };
           bind.def.changeColumnWidth=changeColumnWidth;
            let columnDrag=(e)=>{
                var e = e || window.event;
                var X = e.clientX || e.pageX;
                if (!bind.def.changeColumnWidth(dragColumnNo, X-dragX)) {
                    bind.def.stopColumnDrag(e);
                }
                dragX = X;
                bind.def.preventEvent(e);
                return false;
            }
            bind.def.columnDrag=columnDrag;
          let   stopColumnDrag =(e)=>{
              var e = e || window.event;
              if (!dragColumns) return;
              document.onmouseup  = saveOnmouseup;
              document.onmousemove = saveOnmousemove;
              document.body.style.cursor = saveBodyCursor;
              var colWidth = '';
              var separator = '';
              for (var i=0; i<dragColumns.length; i++) {
                  colWidth += separator + parseInt( bind.def.getWidth(dragColumns[i]) );
                  separator = '+';
              }
              bind.def.preventEvent(e);
          }
            bind.def.stopColumnDrag=stopColumnDrag;
            let startColumnDrag=(e)=>{
                var e = e || window.event;
                dragColumnNo = (e.target || e.srcElement).parentNode.parentNode.cellIndex;
                dragX = e.clientX || e.pageX;
                var colWidth = new Array();
                for (var i=0; i<dragColumns.length; i++)
                    colWidth[i] = parseInt( bind.def.getWidth(dragColumns[i]) );
                for (var i=0; i<dragColumns.length; i++) {
                    dragColumns[i].width = "";
                    dragColumns[i].style.width = colWidth[i] + "px";
                }
                saveOnmouseup       = document.onmouseup;
                document.onmouseup  = bind.def.stopColumnDrag;
                saveBodyCursor             = document.body.style.cursor;
                document.body.style.cursor = 'w-resize';
                saveOnmousemove      = document.onmousemove;
                document.onmousemove = bind.def.columnDrag;
                bind.def.preventEvent(e);
                }
            bind.def.startColumnDrag=startColumnDrag;
            for (var i=0; i<dragColumns.length; i++) {
                dragColumns[i].innerHTML = "<div style='position:relative;height:100%;width:100%'>"+
                    "<div style='"+
                    "position:absolute;height:100%;width:5px;margin-right:-5px;"+
                    "left:100%;top:0px;cursor:w-resize;z-index:10;'>"+
                    "</div>"+
                    dragColumns[i].innerHTML+
                    "</div>";
                console.log(dragColumns[i].firstChild.firstChild);
                dragColumns[i].firstChild.firstChild.addEventListener('mousedown',bind.def.startColumnDrag)
            }
        },
        unbind(el, bind){
            var dragColumns  = el.rows[0].cells;
            for (var i=0; i<dragColumns.length; i++) {
                dragColumns[i].firstChild.firstChild.removeEventListener('mousedown',bind.def.startColumnDrag)
            }
        },
        preventEvent(e){
            var ev = e || window.event;
            if (ev.preventDefault) ev.preventDefault();
            else ev.returnValue = false;
            if (ev.stopPropagation)
                ev.stopPropagation();
            return false;
        },
        getWidth(x){
            if (x.currentStyle)
                var y = x.clientWidth - parseInt(x.currentStyle["paddingLeft"]) - parseInt(x.currentStyle["paddingRight"]);

            else if (window.getComputedStyle)
                var y = document.defaultView.getComputedStyle(x,null).getPropertyValue("width");
            return y || 0;
        },
    })
};