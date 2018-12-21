<template>
    <el-button :type="type" size="mini" @click.native.stop.prevent="click" :loading="!canClick" :disabled="disabled">
        <slot v-if="canClick"></slot>
        <template v-else>{{loadingText}}</template>
    </el-button>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';
    export default {
        name: "request-button",
        data(){
            return {
                minWait:false,
                timeoutStatus:false,
            }
        },
        created(){
        },
        methods:{
            ...mapActions({
                setReqKey__:'request-api-state/setReqKey'
            }),
            setReqKey(bool){
                this.setReqKey__({key:this.rkey, val:bool});
            },
            click(){
                if(this.canClick){
                    this.setReqKey(true);
                    if(this.request){
                        let  res=this.request();
                        if(res !== undefined){
                            switch(res.constructor.name){
                                case 'Promise':
                                    res.then(res =>{
                                        this.setReqKey(false);
                                    }).catch(fail =>{
                                        this.setReqKey(false);
                                    });
                                    break;
                                default:
                                    console.error(`request-button :request not result Promise`);
                                    console.error(res)
                            }
                        }else{
                            console.warn(`request-button :request return undefined`);
                            this.setReqKey(false);
                        }
                    }else{
                        this.$emit('click');
                    }
                }
            },
            clearTime(){
                if(this.timeout__){
                    clearTimeout(this.timeout__);
                    this.timeout__ = null;
                }
                if(this.minTimeout__){
                    clearTimeout(this.minTimeout__);
                    this.minTimeout__ = null;
                }
            }
        },
        computed:{
            ...mapGetters({
                getReqKey__:'request-api-state/getReqKey'
            }),
            getReqKey(){
                return this.getReqKey__(this.rkey);
            },
            rkey(){
                return this.reqKey || this._uid;
            },
            canClick(){
                return !this.minWait && (!this.getReqKey || this.timeoutStatus);
            }
        },
        watch:{
            value(val){
                this.setReqKey(val);
            },
            getReqKey(val){
                this.$emit('input', val);
                if(val){
                    if(this.mintime){
                        this.minWait = true;
                        this.minTimeout__ = setTimeout(()=>{
                            this.minTimeout__ = null
                            this.minWait = false;
                        },this.mintime)
                    }
                    if(this.timeout){
                        this.timeoutStatus = false;
                        this.timeout__ = setTimeout(() =>{
                            this.timeoutStatus = true;
                            this.timeout__ = null;
                        }, this.timeout);
                    }
                }
            }
        },
        beforeDestroy(){
            this.clearTime();
        },
        props:{
            //el-button type
            type:{
                default(){
                    return 'primary';
                }
            },
            //可以不写
            value:{},
            //点击请求的回调函数，函数返回Promse
            request:{
                type:Function
            },
            //api请求时的按钮text
            loadingText:{
                default(){
                    return '请求中...'
                }
            },
            disabled:{
                type:Boolean,
                default(){
                    return false;
                }
            },
            reqKey:{
                type:String
            },
            mintime:{
                type:Number
            },
            timeout:{
                type:Number,
                default(){
                    return 3000;
                }
            }
        }
    }
</script>

<style scoped>

</style>
