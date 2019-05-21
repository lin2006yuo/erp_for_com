


//参数    1.插入文本   2.插入标签    //判断是否在富文本中  （富文本编辑器的class名）
function focusText(text,tag,parent){
    function getSeletion(){
        if(document.getSelection){
            return document.getSelection();
        }else{
            return document.selection
        }
    }
    function getRange(selection){
        if(selection.getRangeAt){
            if(selection.rangeCount >= 1){
                return selection.getRangeAt(0)
            }else{
                return false;
            }
        }else{
            return selection.createRange();
        }
    }
    let sel = getSeletion();
    let range = getRange(sel);
    if(!range){
        return;
    }
    if(range.startContainer){ // DOM下
        sel.removeAllRanges(); // 删除Selection中的所有Range
        range.deleteContents(); // 清除Range中的内容
        // 获得Range中的第一个html结点
        let container = range.startContainer;

        // 判断是否在富文本中
        let flag=true;
        parent&&(container.nodeType === 3)&&(flag=is_in_edit(container.parentNode,parent));
        parent&&(container.nodeType !== 3)&&(flag=is_in_edit(container,parent));
       if(!flag){
           return ;
       }
        // 获得Range起点的位移
        let pos = range.startOffset;
        // 建一个空Range
        range = document.createRange();
        // 插入内容
        let cons  = document.createTextNode(text);
        if(container.nodeType === 3){ // 如是一个TextNode
            if(tag){ //插入标签
                let p=document.createElement('p');
                p.innerHTML=tag;
                let pres=container.wholeText.substring(0,pos);
                let presHtml=document.createElement('p');
                presHtml.innerHTML=pres;
                let afters=container.wholeText.substring(pos);
                let aftersHtml=document.createElement('p');
                aftersHtml.innerHTML=afters;
               let parants=container.parentNode;
                parants.innerText='';
                parants.appendChild(presHtml)
                parants.appendChild(p)
                parants.appendChild(aftersHtml)
                range.setEnd(aftersHtml, 0);
                range.setStart(aftersHtml,0);
            }else {
                container.insertData(pos, cons.nodeValue);
                // 改变光标位置
                range.setEnd(container, pos + cons.nodeValue.length);
                range.setStart(container, pos + cons.nodeValue.length);
            }
        }else {// 如果是一个HTML Node
            if(tag){ //插入标签
                let span=document.createElement('span');
                span.innerHTML=tag;
                let ref = container.childNodes[pos];
                container.insertBefore(span, ref);
                range.setEnd(span, 0);
                range.setStart(span, 0);
            }else {
                let afternode = container.childNodes[pos];
                container.insertBefore(cons, afternode);
                range.setEnd(cons, cons.nodeValue.length);
                range.setStart(cons, cons.nodeValue.length);
            }
        }
        sel.addRange(range);
    }else{// IE下
        let cnode = range.parentElement();
        while(cnode.tagName.toLowerCase() !== 'body'){
            cnodecnode = cnode.parentNode;
        }
        if(cnode.id && cnode.id=='rich_txt_editor'){
            range.pasteHTML(text);
        }
    }
    window.focus();
}
export default focusText;

//判断 是否在富文本中插入
 function is_in_edit(current,parent) {
     if(current.tagName.toLowerCase()==='body'){
         return false
     }
     if(current === parent){
         return true;
     }
     let nodes = parent.childNodes;
     let keys = nodes.keys();
     for(let key in keys){
         if(keys.hasOwnProperty(key)){
             if(current === nodes.item(kesvny)){
                 return true;
             }
         }
     }
     return is_in_edit(current.parentNode, parent);
 }

