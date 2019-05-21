<template>
    <page-dialog nottitle @open="$emit('show')" @close="$emit('hidden')" v-model="show" :close-on-click-modal="false">
        <el-row>
            <el-col :span="18" style="font-size: 48px; color: #F00;">
                {{text}}
            </el-col>
            <el-col :span="6" style="font-size: 32px; color: #F00;">
                <div class="loading"><span>{{timeout__}}</span></div>
            </el-col>
        </el-row>
        <input hidden ref="input">
    </page-dialog>
</template>

<script>
    export default {
        name: "alert-message",
        data(){
            return {
                show:false,
                timeout__:this.timeout,
            }
        },
        methods:{
            startTimer(){
                this.timer = setTimeout(() =>{
                    this.timeout__ -=1;
                    if(this.timeout__){
                        this.startTimer();
                    }else{
                        this.show = false;
                    }
                }, 1000)
            }
        },
        watch:{
            value(val){
                if(val){
                    this.timeout__ = this.timeout;
                    this.startTimer();
                    this.$nextTick(_=>{
                        this.$refs.input.focus();
                    })
                }
                this.show = val;
            },
            show(val){
                this.$emit('input', val);
            }
        },
        props:{
            value:{},
            text:{},
            timeout:{}
        },
        components:{
            pageDialog:require('./page-dialog').default
        }
    }
</script>

<style lang="stylus" scoped>
    .loading{
        border: 3px solid #CCCCCC;
        border-radius: 50%;
        width: 68px;
        height: 68px;
        line-height: 68px;
        text-align: center;
        >span{
            font-size:4.2rem;
        }
    }
</style>