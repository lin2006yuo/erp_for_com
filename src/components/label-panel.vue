<template>
    <div class="label-panel">
        <label v-if="label">{{label}}</label>
        <label v-else>
            <slot name="label"></slot>
        </label>
        <el-card class="label-panel-body" :style="bodyStyle">
            <slot></slot>
            <span class="panel-footer" v-if="$slots.footer">
                <slot name="footer"></slot>
            </span>
        </el-card>
    </div>
</template>
<style lang="stylus">
    .label-panel{
        box-sizing: border-box;
        width:100%;
        .label-panel-body{
            padding:15px;
        }
        >label{
            box-sizing: border-box;
            font-size:12px;
            display: block;
            width:100%;
            padding:20px;
            padding-bottom:10px;
            /*border-bottom:1px solid #666666;*/
        }
        >div{
            padding-top:15px;
            position: relative;
        }
        .panel-footer{
            text-align: center;
            width:200px;
            position: absolute;
            right:20px;
            bottom:2px;
        }
    }
</style>
<script>

    export default{
        data(){
            return{

            }
        },
        computed:{
            bodyStyle(){
                if(this.$slots.footer){
                    return Object.assign({
                        paddingBottom:`40px`
                    },this.padding);
                }else{
                    return this.padding;
                }
            }
        },
        props:{
            label:{
                type:String
            },
            padding:{
                type:Object
            }
        },
        components:{

        }
    }
</script>
