<template>
    <page-dialog :title="spuId" v-model="show" size="large" @open="open" @close="cloce" :close-on-cilck-modal="false" ref="page">
      <div  class="ml-sm mb-sm">
          <div class="title ml-sm mb-sm mt-lg">
              <span>SPU标题：</span>
              <div >{{originTitle}}</div>
          </div>
          <div class="title-show" ref="asd" >
              <div class="tit">{{tit}}</div> <span>{{leng}}/75</span>
          </div>
          <div class="subBox">
              <button class="sub el-tag el-tag--success" v-for="(item,index) in titBtns"
                      :key="index" ref="dom"
                      @mousedown="subStart($event,item,index)">{{item}}</button>
          </div>
          <div class="before ml-sm ">
              <div class="titleBox">
                  <div class="title">
                      前
                  </div>
                  <input style="border:none;outline:none;width:140px"
                         @keyup.enter="add_s"
                         v-model="bf"
                         placeholder="请输入,按Enter添加"/>
              </div>
              <div class="targetBox" ref="targetBox1">
                  <Tag :tags="beforeTag" ref="mid" type="primary" :min-height="38" @click="click"></Tag>
              </div>
          </div>
          <div class="mid ml-sm ">
              <div class="mid-tit-box">
                  <div class="mid-tit">
                      中
                  </div>
                  <input style="border:none;outline:none;width:140px"
                         @keyup.enter="add_m"
                         v-model="mid"
                         placeholder="请输入,按Enter添加"/>
              </div>
              <div class="mid-targetBox" ref="targetBox2">
                  <Tag :tags="titleList" ref="mid" type="primary" :min-height="38" @click="click"></Tag>
              </div>
          </div>
          <div class="before border1 ml-sm ">
              <div class="titleBox">
                  <div class="title">
                      后
                  </div>
                  <input style="border:none;outline:none;width:140px"
                         @keyup.enter="add_e"
                         v-model="bh"
                         placeholder="请输入,按Enter添加"/>
              </div>
              <div class="targetBox" ref="targetBox3">
                  <!--<el-tag type="success" closable v-for="(item,index) in behideTag" :key="index" :class="{ml:index!==0}" @close="close_e(index,item)">-->
                      <!--{{item}}-->
                  <!--</el-tag>-->
                  <Tag :tags="behideTag" ref="mid" type="primary" :min-height="38" @click="click"></Tag>
                  <!--<el-button type="primary" size="mini" class="inline ml-mini" v-if="behideTag.length!==0" @click="behideTag=[]">-->
                      <!--清除所有-->
                  <!--</el-button>-->
              </div>
          </div>
      </div>
        <div slot="footer">
            <el-button type="primary" size="mini" class="inline" @click="submit" :disabled="leng>75">确定</el-button>
            <el-button  size="mini" class="inline" @click="show=false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style scoped>
    .succ{
        background-color: rgba(18,206,102,.1) !important;
        border-color: rgba(18,206,102,.2) !important;
        color: #13ce66 !important;
    }
    .subBox{
        width:974px;
        height:60px;
        margin:2px 0 0 52px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
    }
    .sub{
        margin-left:10px;
    }
    .sub:hover{
        background-color: rgba(103,194,58,.1);
        border-color: rgba(103,194,58,.2);
        color: #67c23a
    }
.ml{
    margin-left: 4px;
}
.title{
    display: flex;
    align-items: center;
}
.tag{
    width: 990px;
}
.before{
    display: flex;
    width: 940px;
    margin-left: 65px;
}
.border1{
    border-bottom: 1px dotted
}
.mid{
    display: flex;
    width: 940px;
    margin-left: 65px;
}
.targetBox{
    width:798px;
    height:40px;
    border:6px;
    border-left: 1px dotted #777;
    border-right: 1px dotted #777;
    border-top: 1px dotted #777;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.mid-targetBox{
    width:798px;
    height:68px;
    min-height: 68px;
    overflow: auto;
    border:6px;
    border-left: 1px dotted #777;
    border-right: 1px dotted #777;
    border-top: 1px dotted #777;
    display: flex;
    justify-content: flex-start;
}
.titleBox{
    width: 180px;
    height: 40px;
    border-left: 1px dotted #777;
    border-top: 1px dotted #777;
    display: flex;
    min-height: 40px;
    overflow: auto;
}
.mid-tit-box{
    width: 172px;
    height: 68px;
    border-left: 1px dotted #777;
    border-top: 1px dotted #777;
    display: flex;
}
.title-show{
    margin-left: 68px;
    width: 920px;
    display: flex;
    align-items: center;
}
.tit{
    width: 880px;
    min-height: 34px;
    height: 34px;
    border: 1px solid #ddd;
    line-height: 34px;
}
.titleBox .title{
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background:rgb(239,242,247)
}
    .mid-tit{
        width: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        background:rgb(239,242,247)
    }
    .targetBoxActive{
        box-shadow: 0 0 6px rgba(13, 210, 40, 0.87);
    }
    .def{
        display: inline-block;
        padding: 0 10px;
        height: 32px;
        line-height: 30px;
        font-size: 12px;
        border-radius: 4px;
        box-sizing: border-box;
        white-space: nowrap;
    }
</style>
<script>
    import {api_save_ebay_titles} from   '../../../../api/ebay-title-key'
    export default {
        data() {
            return {
                allTag:[],
                top:0,
                tag:'',
                bf:'',
                mid:'',
                bh:'',
                colorStatus:true,
                status:false,
                index:0,
                leng:0,
                originTitle:'',
                titBtns:[],
                titleList:[],
                show: this.value,
                showCloneSub:false,
                tagTitle:'',
                behideTag:[],
                beforeTag:[],
                empty:null
            }
        },
        methods: {
            //处理以字母开头的大写
            toUP(x){
                x = x.toString();
                return x.substr(0,1).toUpperCase()+x.substr(1)
            },
            add_s(e){
                let value = e.target.value.split(',');
               value = value.map(this.toUP);
                let clone = value.map(row=>{
                    return {name:row}
                });
                let midArr = this.titleList.map(row=>{
                    return row.name
                });
                let topArr = this.beforeTag.map(row=>row.name);
                let endArr = this.behideTag.map(row=>row.name);
                let all = [...topArr,...midArr,...endArr,...clone];
                if(all.includes(value.join(' '))){
                    this.$message({
                        message:'该标签已存在' ,
                        type:'warning'
                    });
                    return
                }else {
                    this.beforeTag = [...this.beforeTag,...clone];
                    this.bf = ''
                }
            },
            add_m(e){
                let value = e.target.value.split(',');
                value = value.map(this.toUP);
                let clone = value.map(row=>{
                    return {name:row}
                });
                let midArr = this.titleList.map(row=>{
                    return row.name
                });
                let topArr = this.beforeTag.map(row=>row.name);
                let endArr = this.behideTag.map(row=>row.name);
                let all = [...topArr,...midArr,...endArr,...clone];
                if(all.includes(value.join(' '))){
                    this.$message({
                        message:'该标签已存在' ,
                        type:'warning'
                    });
                    return
                }else {
                    this.titleList = [...this.titleList,...clone];
                    this.mid = ''
                }
            },
            add_e(e){
                let value = e.target.value.split(',');
                value = value.map(this.toUP);
                let clone = value.map(row=>{
                    return {name:row}
                });
                let midArr = this.titleList.map(row=>{
                    return row.name
                });
                let topArr = this.beforeTag.map(row=>row.name);
                let endArr = this.behideTag.map(row=>row.name);
                let all = [...topArr,...midArr,...endArr,...clone];
                if(all.includes(value.join(' '))){
                    this.$message({
                        message:'该标签已存在' ,
                        type:'warning'
                    });
                    return
                }else {
                    this.behideTag = [...this.behideTag,...clone];
                    this.bh = ''
                }
            },
            submit(){
                let midArr = this.titleList.map(row=>{
                    return row.name
                });
                let topArr = this.beforeTag.map(row=>{
                    return row.name
                });
                let endArr = this.behideTag.map(row=>{
                    return row.name
                })
                let data = {
                  en:{
                      front:topArr,
                      middle:midArr,
                      back:endArr
                  }
                };
                let params = {
                    titles:data
                };
                if(this.einfo.id){
                    this.$set(params,'id',this.einfo.id)
                }
                this.$http(api_save_ebay_titles,this.einfo.goods_id,params).then(res=>{
                    this.$message({
                        message:res.message,
                        type:'success',
                        duration:1500
                    });
                    setTimeout(()=>{
                        this.show = false;
                    },1500);
                    setTimeout(()=>{
                        this.$emit('search');
                    },1700)
                }).catch(code=>{
                    console.log(code);
                    this.$message({
                        message:code.message||code,
                        type:'error'
                    })
                })
            },
            //去重
            del(arr) {
                let temp = [];
                for(let i=0;i<arr.length;i++){
                    if(temp.indexOf(arr[i])==-1){
                        temp.push(arr[i])
                    }
                }
                return temp
            },
            open(option) {
                console.log(option,'page');
                setTimeout(()=>{
                    this.top =Number(option.top.replace('px',''))
                },200);
                this.bf = '';
                this.mid = '';
                this.bh = '';
                let val = this.einfo;
                this.originTitle = val.titles.en.originTitle;
                if(!!val.titles.en.originTitle){
                    let btns =this.originTitle.split(' ').map(this.toUP);
                    this.titBtns = this.del(btns);
                }else {
                    this.titBtns = []
                }
                if(!!Object.keys(val.titles.en.titleStore).length){
                    this.empty =true;
                    this.titleList = val.titles.en.titleStore.middle.filter((row,index,arr)=>{
                        return arr.indexOf(row)===index
                    }).map(this.toUP).map(row=>{
                        return {
                            name:row
                        }
                    });
                    this.beforeTag = val.titles.en.titleStore.front.map(this.toUP).map(row=>{
                        return {
                            name:row
                        }
                    });
                    this.behideTag = val.titles.en.titleStore.back.map(this.toUP).map(row=>{
                        return {
                            name:row
                        }
                    });
                }else {
                    this.empty = false;
                     let s= this.originTitle.split(' ');
                    let i = this.del(s);
                    if(!!val.titles.en.originTitle){
                        this.titleList = i.map(row=>{
                            return {name:row}
                        });
                    }else {
                        this.titleList =[]
                    }
                    this.beforeTag = [];
                    this.behideTag = [];
                }
            },
            cloce(){

            },
            click(index,item){
                this.colorStatus = false;
                let tagIndex = this.titBtns.indexOf(item.name);
                this.$nextTick(()=>{
                    this.$refs.dom[tagIndex].classList.add('succ');
                })
            },
            //处理添加 和重复删掉
            filter_tag(beforeTag,titleList,behideTag,type){
                let _beforeTag = beforeTag.some(row=>row.name===this.tagTitle);
                let _titleList = titleList.some(row=>row.name===this.tagTitle);
                let _behideTag = behideTag.some(row=>row.name===this.tagTitle);
                if(_beforeTag){
                    let $index = beforeTag.findIndex(row=>row.name===this.tagTitle)
                    beforeTag.splice($index,1)
                }else if(_titleList){
                    let $index = titleList.findIndex(row=>row.name===this.tagTitle)
                    titleList.splice($index,1)
                    console.log('delete结果',titleList)
                }else if(_behideTag){
                    let $index = behideTag.findIndex(row=>row.name===this.tagTitle)
                    behideTag.splice($index,1)
                }
                console.log(type,!_beforeTag&&type==='beforeTag',!_titleList&&type==='titleList',!_behideTag&&type==='behideTag')
                if(!_beforeTag&&type==='beforeTag'){
                    beforeTag.splice(beforeTag.length,1,{name:this.tagTitle})
                }else if(!_titleList&&type==='titleList'){
                    titleList.splice(titleList.length,1,{name:this.tagTitle})
                }else if(!_behideTag&&type==='behideTag'){
                    behideTag.splice(behideTag.length,1,{name:this.tagTitle})
                }


                console.log(type,_beforeTag,_titleList,_behideTag);
            },
            subStart(event,item,index){
                this.index=index;
                //获取被移动元素
                let position_top = this.top+95;
                console.log(position_top,'nice');
                let target=event.target;
                this.tagTitle = target.innerText;
                const cTarget = target.cloneNode(target,true);
                document.body.appendChild(cTarget);
                cTarget.style.position = 'absolute';
                cTarget.style.zIndex = '999999';
                cTarget.style.left = 0+'px';
                cTarget.style.top = 0+'px';
                let before = this.$refs.targetBox1;
                let mid = this.$refs.targetBox2;
                let behide = this.$refs.targetBox3;
                let beforeTopMin=before.offsetTop;
                let beforeTopMax=before.offsetTop+before.offsetHeight;
                let beforeleftMin=before.offsetLeft;
                let beforeleftMax=before.offsetLeft+before.offsetWidth;
                let midTopMin=mid.offsetTop;
                let midTopMax=mid.offsetTop+mid.offsetHeight;
                let midleftMin=mid.offsetLeft;
                let midleftMax=mid.offsetLeft+mid.offsetWidth;
                let bhTopMin=behide.offsetTop;
                let bhTopMax=behide.offsetTop+behide.offsetHeight;
                let bhleftMin=behide.offsetLeft;
                let bhleftMax=behide.offsetLeft+behide.offsetWidth;
                //记录鼠标按下的起点坐标
                //克隆被移动元素的信息
                function handlder(e){
                    let x = e.clientX;
                    let y = e.clientY;
                    // console.log(cTarget.style.left);
                    // console.log(cTarget.style.top);
                    // console.log(before.offsetTop);
                    // console.log(before.offsetLeft);
                    console.log(position_top,'top')
                    let subLeftMin=cTarget.offsetLeft;
                    let subLeftMax=cTarget.offsetLeft+cTarget.offsetWidth;
                    let subTopMin=cTarget.offsetTop;
                    let subTopMax=cTarget.offsetTop+cTarget.offsetHeight;
                    cTarget.style.left = x - (target.clientWidth / 2) + 'px';
                    cTarget.style.top = y - (target.clientHeight / 2) + 'px';
                    if((!(subLeftMax<beforeleftMin+500 || subLeftMin>beforeleftMax+500 || subTopMax<beforeTopMin+position_top || subTopMin>beforeTopMax+position_top))){
                        before.classList.add('targetBoxActive');
                    }else {
                        before.classList.remove('targetBoxActive');
                    }
                    if(!(subLeftMax<midleftMin+500 || subLeftMin>midleftMax+500 || subTopMax<midTopMin+position_top || subTopMin>midTopMax+position_top)){
                        mid.classList.add('targetBoxActive')
                    }else {
                        mid.classList.remove('targetBoxActive');
                    }
                    if(!(subLeftMax<bhleftMin+500 || subLeftMin>bhleftMax+500 || subTopMax<bhTopMin+position_top || subTopMin>bhTopMax+position_top)){
                        behide.classList.add('targetBoxActive')
                    }else {
                        behide.classList.remove('targetBoxActive');
                    }
                };
                const handlerUp=()=>{
                    target.classList.remove('succ');
                    target.style.background = 'hsla(220,4%,58%,.1)';
                    target.style.color = '#909399';
                    target.style.borderColor ='hsla(220,4%,58%,2)';
                    let subLeftMin=cTarget.offsetLeft;
                    let subLeftMax=cTarget.offsetLeft+cTarget.offsetWidth;
                    let subTopMin=cTarget.offsetTop;
                    let subTopMax=cTarget.offsetTop+cTarget.offsetHeight;
                    document.removeEventListener('mousemove',handlder);
                    document.removeEventListener('mouseup',handlerUp);
                    cTarget.remove();
                    before.classList.remove('targetBoxActive');
                    mid.classList.remove('targetBoxActive');
                    behide.classList.remove('targetBoxActive');
                    if(this.onBoxState){
                        this.beforeTag.push(this.tagTitle)
                    }
                    if(!(subLeftMax<beforeleftMin+500 || subLeftMin>beforeleftMax+500 || subTopMax<beforeTopMin+position_top || subTopMin>beforeTopMax+position_top)){
                        // 如果目标框内已经有重复的元素，则不添加
                        this.filter_tag(this.beforeTag,this.titleList,this.behideTag,'beforeTag');
                    }
                    if(!(subLeftMax<midleftMin+500 || subLeftMin>midleftMax+500 || subTopMax<midTopMin+position_top || subTopMin>midTopMax+position_top)){
                        this.filter_tag(this.beforeTag,this.titleList,this.behideTag,'titleList');
                    }
                    if(!(subLeftMax<bhleftMin+500 || subLeftMin>bhleftMax+500 || subTopMax<bhTopMin+position_top || subTopMin>bhTopMax+position_top)){
                        this.filter_tag(this.beforeTag,this.titleList,this.behideTag,'behideTag');
                    }
                };
                document.addEventListener('mousemove',handlder);
                document.addEventListener('mouseup',handlerUp)
            }
        },
        computed:{
            tit(){
                this.status = false;
                let title;
                if(this.beforeTag.length!==0 ||this.behideTag.length!==0 ||this.titleList.length!==0){
                    let topArr = [];
                    this.beforeTag.forEach(row=>{
                        topArr.push(row.name)
                    });
                    let endArr =[];
                    this.behideTag.forEach(row=>{
                        endArr.push(row.name)
                    });
                    let midArr =[];
                    this.titleList.forEach(row=>{
                        midArr.push(row.name)
                    });
                    let mid = midArr.join(' ');
                    let top =topArr.join(' ');
                    let end = endArr.join(' ');
                     title = `${top} ${mid} ${end}`;
                    this.leng = title.trim().length;
                    if(title.trim().length>75  &&this.empty){
                         this.status = true;
                         this.$message({
                             message:'标题字符个数超出75',
                             type:'warning',
                         });
                         return this.originTitle
                    }else if(title.trim().length>75) {
                        this.status = true;
                        this.$message({
                            message:'标题字符个数超出75',
                            type:'warning',
                        });
                        return this.originTitle
                    }else {
                        return title
                    }
                }else {
                    this.leng = this.originTitle.length;
                    return this.originTitle
                }
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            },
        },
        props:{
            value:{},
            title:{},
            einfo:{},
            spuId:{}
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
            Tag:require("./tag").default,
        }
    }
</script>

