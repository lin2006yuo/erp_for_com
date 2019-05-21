<template>
    <div class="c-move-title">
        <table class="template">
            <tr>
                <th width="30px">前</th>
                <td width="100px">
                    <input style="border:none;outline:none;font-size:1.1rem"
                           @blur="blur('newFront')"
                           @keyup.enter="add_word(newFront,'front')"
                           v-model="newFront"
                           @input="add_title(newFront,'front')"
                           placeholder="请输入,按Enter添加"/>
                    <ul class="message-front" v-show="messageFront" @mouseout="leave_input('front')" @mouseover="enter_input('front')">
                        <li v-for="(item,index) in options" :key="index" @click="check_item(item.value,'front',index)" :class="{'li-active':item.flag}" >
                            {{item.value}}
                            <span  v-show="item.flag" style="color:dodgerblue;" :class="{'li-active':item.flag}"><i class="el-icon-check"></i></span>
                        </li>
                    </ul>
                </td>
                <td class="t-left">
                    <draggable-tag v-model="sourceData.frontList"
                                   :styleProp="styleProp"
                                   :options="{group:'listOne'}"></draggable-tag>
                </td>
            </tr>
            <tr>
                <th width="30px">中</th>
                <td width="100px">
                    <input style="border:none;outline:none;font-size:1.1rem"
                           @blur="blur('newMiddle')"
                           @keyup.enter="add_word(newMiddle,'middle')"
                           v-model="newMiddle"
                           @input="add_title(newMiddle,'middle')"
                           placeholder="请输入,按Enter添加"/>
                    <ul class="message-middle" v-show="messageMiddle" @mouseout="leave_input('middle')" @mouseover="enter_input('middle')">
                        <li v-for="(item,index) in options" :key="index" @click="check_item(item.value,'middle',index)" :class="{'li-active':item.flag}" >
                            {{item.value}}
                            <span  v-show="item.flag" style="color:dodgerblue;" ><i class="el-icon-check"></i></span>
                        </li>
                    </ul>
                </td>
                <td class="t-left">
                    <draggable-tag v-model="sourceData.middleList"
                                   :styleProp="styleProp"
                                   :options="{group:'listOne'}"></draggable-tag>
                </td>
            </tr>
            <tr>
                <th width="30px">后</th>
                <td width="100px">
                    <input style="border:none;outline:none;font-size:1.1rem"
                           @blur="blur('newBack')"
                           @keyup.enter="add_word(newBack,'back')"
                           v-model="newBack"
                           @input="add_title(newBack,'back')"
                           placeholder="请输入,按Enter添加" />
                    <ul class="message-back" v-show="messageBack" @mouseout="leave_input('back')" @mouseover="enter_input('back')">
                        <li v-for="(item,index) in options" :key="index" @click="check_item(item.value,'back',index)"  :class="{'li-active':item.flag}" >
                            {{item.value}}
                            <span  v-show="item.flag" style="color:dodgerblue;" :class="{'li-active':item.flag}"><i class="el-icon-check"></i></span>
                        </li>
                    </ul>
                </td>
                <td class="t-left">
                    <draggable-tag v-model="sourceData.backList"
                                   :styleProp="styleProp"
                                   :options="{group:'listOne'}"></draggable-tag>
                </td>
            </tr>
        </table>
    </div>
</template>
<style lang="stylus">
    .c-move-title{
        .el-select{
            .el-input{
                input{
                    border:none;
                    outline:none;
                    font-size:1.1rem;
                    line-height:18px !important;
                    height:18px !important;
                    padding:1px 0px !important;
                    color:initial !important;
                }
            }
            .el-select__input {
                margin:0 !important;
                max-width:131px !important;
            }
        }
        .el-select-dropdown__empty{
            width:131px !important;
        }
        .el-select__tags{
            overflow:hidden;
            max-width:131px !important;
        }
        .message-front,.message-middle,.message-back{
            position:absolute;
            z-index:999;
            background-color:white;
            top:100%;
            left:0;
            list-style:none;
            width:142px;
            max-height:75px;
            overflow:auto;
            border:1px solid #ccc;
            li{
                display:flex;
                justify-content: space-between;
                align-items :center;
                padding:5px;
                text-align:left;
                cursor:pointer;
            }
            li:hover{
                background-color:rgb(248,248,248);
            }
        }
        td {
            position:relative;
        }
        .li-active {
            color:dodgerblue;
        }
    }
</style>
<script>
    import {api_batch_change_title} from '@/api/ebay-title-key';
    export default{
        data(){
            return{
                newMiddle:'',
                newFront:'',
                newBack:'',
                frontList:[
                    {name:'ceshi',id:1}
                ],
                middleList:[
                    {name:'中',id:1}
                ],
                backList:[],
                options:[],
                messageMiddle:false,
                messageFront:false,
                messageBack:false
            }
        },
        methods:{
            to_upper_case(x){
                x = x.toString();
                return x.substr(0,1).toUpperCase()+x.substr(1)
            },
            add_word(val,name){
                let value = val.split(' ').filter(row=>!!row).map(row=>{
                    return {
                        time:0,
                        name:this.to_upper_case(row.trim()),
                        isSign:false,
                    }
                });
                console.log(value);
                let value2=[];
                switch(name){
                    case 'front':
                        if(this.sourceData.frontList.length){
                            let length=0;
                            for(let i=0;i<value.length;i++){
                                for(let j=0;j<this.sourceData.frontList.length;j++){
                                    if(value[i].name!==this.sourceData.frontList[j].name){
                                        length++;
                                    }
                                }
                                if(length===this.sourceData.frontList.length){
                                    value2.push(value[i]);
                                }
                            }
                            this.sourceData.frontList = [...this.sourceData.frontList,...value2];
                            this.newFront='';
                        }else{
                            this.sourceData.frontList = [...this.sourceData.frontList,...value];
                            this.newFront='';
                        }
                        break;
                    case 'middle':
                        if(this.sourceData.middleList.length){
                            let length=0;
                            for(let i=0;i<value.length;i++){
                                for(let j=0;j<this.sourceData.middleList.length;j++){
                                    if(value[i].name!==this.sourceData.middleList[j].name){
                                        length++;
                                    }
                                }
                                if(length===this.sourceData.middleList.length){
                                    value2.push(value[i]);
                                }
                            }
                            this.sourceData.middleList = [...this.sourceData.middleList,...value2];
                            this.newMiddle='';
                        }else{
                            this.sourceData.middleList = [...this.sourceData.middleList,...value];
                            this.newMiddle='';
                        }
                        break;
                    case 'back':
                        if(this.sourceData.backList.length){
                            let length=0;
                            for(let i=0;i<value.length;i++){
                                for(let j=0;j<this.sourceData.backList.length;j++){
                                    if(value[i].name!==this.sourceData.backList[j].name){
                                        length++;
                                    }
                                }
                                if(length===this.sourceData.backList.length){
                                    value2.push(value[i]);
                                }
                            }
                            this.sourceData.backList = [...this.sourceData.backList,...value2];
                            this.newBack='';
                        }else{
                            this.sourceData.backList = [...this.sourceData.backList,...value];
                            this.newBack='';
                        }
                        break;
                }
            },
            add_title(val,type) {
                if (val) {
                    this.options=[];
                    this.$http(api_batch_change_title, {query:val})
                        .then(res => {
                            for(let i in res.data){
                                let obj={};
                                if(res.data.hasOwnProperty(i)){
                                    console.log(res.data[i]);
                                    obj.value=res.data[i];
                                    obj.flag=false;
                                    this.options.push(obj);
                                }
                            }
                            if(this.options.length){
                                switch(type){
                                    case 'front':
                                        this.messageFront=true;
                                        this.messageMiddle=false;
                                        this.messageBack=false;
                                        break;
                                    case 'middle':
                                        this.messageMiddle=true;
                                        this.messageFront=false;
                                        this.messageBack=false;
                                        break;
                                    case 'back':
                                        this.messageBack=true;
                                        this.messageMiddle=false;
                                        this.messageFront=false;
                                        break;
                                }
                            }
                        })
                        .catch(err => {
                            console.log(err.message+'出错了');
                        })
                }
            },
            focus(val){
                switch(val){
                    case 'front':
                        this.messageFront=true;
                        this.messageMiddle=false;
                        this.messageBack=false;
                        break;
                    case 'middle':
                        this.messageMiddle=true;
                        this.messageFront=false;
                        this.messageBack=false;
                        break;
                    case 'back':
                        this.messageBack=true;
                        this.messageMiddle=false;
                        this.messageFront=false;
                        break;
                }
            },
            blur(val){
                switch(val){
                    case 'newFront':
                        this.newFront='';
                        break;
                    case 'newMiddle':
                        this.newMiddle='';
                        break;
                    case 'newBack':
                        this.newBack='';
                        break;
                }
            },
            check_item(val,type,index){
                this.options[index].flag=!this.options[index].flag;
                if(this.options[index].flag) {
                    this.add_word(val,type);
                }
            },
            leave_input(val){
                switch(val){
                    case 'front':
                        this.messageFront=false;
                        break;
                    case 'middle':
                        this.messageMiddle=false;
                        break;
                    case 'back':
                        this.messageBack=false;
                        break;
                }
            },
            enter_input(val){
                switch(val){
                    case 'front':
                        this.messageFront=true;
                        this.messageMiddle=false;
                        this.messageBack=false;
                        break;
                    case 'middle':
                        this.messageMiddle=true;
                        this.messageFront=false;
                        this.messageBack=false;
                        break;
                    case 'back':
                        this.messageBack=true;
                        this.messageMiddle=false;
                        this.messageFront=false;
                        break;
                }
            }
        },
        props:{
            sourceData:{},
            styleProp:{
                default(){
                    return {
                        minHeight:'26px',
                        width:'100%',
                    }
                }

            }
        },
        components:{
            draggableTag:require('./draggable-tag.vue').default,
        }
    }
</script>
