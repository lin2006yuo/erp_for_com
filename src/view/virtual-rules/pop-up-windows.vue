<template>
    <div :class="`footer-pop-up-windows ${isShow?'show':''}`">
        <div class="pop-up-message-box">
            <div class="message-header">
                <span class="title">{{lookTitle}}</span>
                <i class="el-message__close el-icon el-icon-close close" @click="close"></i>
            </div>
            <div class="message__body">
                <el-row class="title-center-align">
                    <div style="font-size: 20px;font-weight: bold;">{{message.title}}</div>
                </el-row>
                <el-row class="message-body-content">
                    <el-col v-if="message.imgPath" :span="7">
                        <img style="width: 100px;" :src="message.imgPath">
                    </el-col>
                    <el-col :span="message.imgPath?17:24">
                        <div class="m-content-box" v-html="message.content"></div>
                    </el-col>
                </el-row>
            </div>
            <el-row>
                <div class="dialog__footer">
                    <!--<el-button class="inline" size="mini" type="primary" @click="look">查看</el-button>-->
                    <permission class="ml-sm inline"
                                tag="request-button"
                                req-key="url_get_internal_letters_view_letter"
                                :mintime="200"
                                :route="apis.url_get_internal_letters_view_letter"
                                @click="look">查看
                    </permission>
                    <permission class="ml-sm inline"
                                tag="request-button"
                                req-key="url_put_internal_letters_read"
                                :mintime="200"
                                :route="apis.url_get_internal_letters_all_read"
                                @click="allRead">全部已读
                    </permission>
                </div>
            </el-row>
        </div>
        <look-e-maill
            v-model="lookVisibility"
            :type-list="typeList"
            :look-data="lookData"
            :look-prev="lookPrev"
            :look-next="lookNext"
            :look-title="lookTitle"
            :is-inbox-open="true"
            @look="look"></look-e-maill>
    </div>
</template>

<style lang="stylus">
    .footer-pop-up-windows{
        position fixed;
        right 10px;
        bottom -210px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        box-sizing border-box;
        border 1px solid #e0e6ed;
        background-color: #FFF;
        width 400px;
        height 200px;
        transition all 1s;
        z-index 5000
        .pop-up-message-box {
            position relative;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            box-sizing border-box;
            overflow: hidden;
            padding-bottom:45px;
            .message-header {
                box-sizing: border-box;
                padding: 0 15px;
                height: 30px;
                line-height: 30px;
                margin-bottom: 5px;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0px 0px 6px 0px rgba(0, 0, 0, .04);
                i.close {
                    box-sizing: border-box;
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    width: 26px;
                    height: 26px;
                    padding-left: 7px;
                    line-height 27px;
                    background-color: rgba(255, 255, 255, 1);
                    background-size: contain;
                    transition: all 0.2s;
                    &:hover {
                        background-size: contain;
                        background-color: rgba(0, 0, 0, .1);
                        border-radius: 3px;
                    }
                }
                i.close-icon {
                    background: url('../../assets/close-icon-default.png') no-repeat center center;
                    &:hover {
                        background: url('../../assets/close-icon-active.png') no-repeat center center;
                    }
                }
                i.close-text {
                    color: #8c8c8c;
                    font-weight: 900;
                    line-height: 18px;
                    text-align: center;
                    border: 2px solid #CCCCCC;
                    border-radius: 50%;
                }
            }
            .title {
                line-height: 1;
                font-size: 14px;
                font-weight: 500;
                color: #1f2d3d;
            }
            .close {
                float: right;
                line-height: 36px;
            }
            .message__body{
                padding 0 15px;
                .title-center-align{
                    text-align center;
                }
                .message-body-content{
                    height 100px;
                    overflow hidden;
                    .m-content-box{
                        height 100px;
                        overflow hidden;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 3;
                    }
                }
            }
        }
        .dialog__footer {
            position: absolute;
            bottom:-25px;
            right:20px;
        }
    }
    .show{
        bottom 40px
    }
</style>
<script>

    import {
        api_get_internal_letters_notification,
        api_get_internal_letter_get_all_type,
        api_get_internal_letters_all_read,
        url_get_internal_letters_all_read,
        url_get_internal_letters_view_letter
    } from '@/api/system-notice-inbox'
    export default {
        page: {},
        permission:{
            url_get_internal_letters_all_read,
            url_get_internal_letters_view_letter
        },
        data() {
            return {
                isShow:false,
                message:{},
                lookTitle:'查看站内信',
                lookVisibility:false,
                timeList:[
                    120000,
                    240000,
                    480000
                ],
                timeIndex:0,
                interval:null,
                messageList:[],
                lookIndex:0,
                typeList:[]
            }
        },
        mounted(){
            this.get_mes_type();
            this.init_http();
            this.init_interval();
        },
        methods: {
            init_interval(){
                setTimeout(()=>{
                    this.timeIndex += 1;
                    if(this.timeIndex>2){
                        this.timeIndex = 0;
                    }
                    this.init_http();
                },this.timeout);
            },
            init_http(){
                this.$http(api_get_internal_letters_notification).then(res=>{
                    sessionStorage.setItem('messageCount',res.count);
                    if(res.data&&res.data.length>0){
                        this.messageList = res.data;
                        this.messageList.forEach(message=>{
                            let attachment = message.attachment;
                            if(!!attachment){
                                let file_name = attachment.slice(attachment.lastIndexOf('/')+1);
                                this.$set(message,'file_name',file_name);
                                this.$set(message,'imgPath',(/\.(png$|PNG$|jpg$|JPG$|JPEG$)/.test(file_name))?window.config.apiHost+attachment.replace('./',''):'')
                            }
                        });
                        this.message = this.messageList[0];//
                        this.isShow = true;
                        if(this.timeIndex===2){
                            this.init_interval();
                        }else{
                            this.timeIndex = 2;
                        }
                    }
                }).catch(code=>{
                    console.log(code);
                });
            },
            get_mes_type(){
                this.$http(api_get_internal_letter_get_all_type).then(res=>{
                    this.typeList = res;
                }).catch(code=>{
                    console.log(code);
                });
            },
            look(data){
                if(data&&data.letter_text_id){
                    this.lookIndex = this.messageList.findIndex(row=>row.letter_text_id===data.letter_text_id);
                }else{
                    this.isShow = false;
                    this.lookVisibility = true;
                    this.$reqKey('url_get_internal_letters_view_letter',false);
                }
            },
            allRead(){
                this.$http(api_get_internal_letters_all_read).then(res=>{
                    sessionStorage.setItem('messageCount',0);
                    this.$message({type:'success',message:res.message||res});
                    this.messageList.forEach(row=>{
                        row.read = 1;
                    });
                    this.isShow = false;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_put_internal_letters_read',false);
                    },200);
                });
            },
            close(){
                this.isShow = false;
            },
        },
        computed:{
            timeout(){
                return this.timeList[this.timeIndex]
            },
            lookData(){
                return this.messageList[this.lookIndex]||{}
            },
            lookNext(){
                return this.messageList[this.lookIndex+1]||{}
            },
            lookPrev(){
                return this.messageList[this.lookIndex-1]||{}
            }
        },
        watch:{
            timeIndex(val){
                if(val!==''){
                    this.init_interval();
                }
            },
            isShow(val){
                if(val){
                    this.interval = setTimeout(()=>{
                        this.isShow = false;
                    },180000);
                }else{
                    if(this.interval){
                        clearTimeout(this.interval);
                        this.interval = null;
                    }
                }
            }
        },
        components:{
            lookEMaill:require('../system-notice/look-e-maill').default
        }
    }
</script>

