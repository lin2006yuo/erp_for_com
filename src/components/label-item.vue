<template>
    <div class="c-label-item">
        <label v-if="label" :style="labelStyle">{{label}}</label>
        <template v-if="$slots.label">
            <slot name="label"></slot>
        </template>
        <slot></slot>
    </div>
</template>
<style lang="stylus">
    .c-label-item{
        vertical-align: middle;
        display: inline-block;
        font-size:0;
        >*{
            display: inline-block !important;
            vertical-align: middle;
            /*height:100%;*/
        }
        .el-input{
            width:auto;
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
            labelStyle(){
                let style = {
                    textAlign: this.labelAlign || 'right'
                };
                if(this.labelWidth){
                    style.width = `${this.labelWidth}px`
                }
                return style;
            }
        },
        props:{
            label:{
                type:String
            },
            labelWidth:{
            },
            labelAlign:{}
        },
        components:{

        }
    }
</script>
