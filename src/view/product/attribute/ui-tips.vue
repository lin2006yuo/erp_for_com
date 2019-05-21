<template>
    <div class="p-ui-tips inline">
        <span v-if="isShow"  ref="content" class="textline">
            <span  v-for="item in content" style="padding-right: 10px;">{{item.value}}</span>
        </span>
        <el-tooltip placement="top" v-else>
            <div slot="content" style="width:1000px">
                <span v-for="item in content" style="padding-right: 10px;">{{item.value}}</span>
            </div>
            <div  class="under" :style="isHidden" >
                       <span  ref="content" class="textline">
                           <span v-for="item in content" style="padding-right: 10px;">{{item.value}}</span>
                       </span>

            </div>
        </el-tooltip>
    </div>
</template>
<style lang="stylus">
    .p-ui-tips{
        .under{
            height: 100%;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .textline{
            /*line-height:26px;*/
            white-space:nowrap;
        }
    }

</style>
<script>

    export default{
        data(){
            return{
                length:0
            }
        },
        mounted(){

        },
        computed:{
            isShow(){
                if(this.isTips){
                    return false
                }else {
                    this.getLength();
                    let flag
                    if(this.length>this.width){
                        flag=true
                    }else {
                        flag=false
                    }
                    return  !flag
                }
            },
            isHidden(){
                if(this.width){
                    return {
                        width:this.width+"px"
                    }
                }
            }
        },
        methods:{
            getLength(){
                this.$nextTick(()=>{
                    let el=this.$refs.content.getBoundingClientRect();
                    this.length=parseInt(el.width);
                })
            },

        },
        watch:{

        },
        props:{
            width:{
                type:Number,
                default(){
                    return 100;
                },
            },
            isTips:{
                type:Boolean,
                default(){
                    return  false;
                },
            }  ,
            content:{
                required:true,
            }
        },
        components:{

        }
    }
</script>