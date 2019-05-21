<template>
    <div class="c-panel-split">
        <div class="left" :style="leftStyle">
            <slot name="left"></slot>
            <div class="sider"></div>
        </div>
        <div v-if="$slots.right"
             class="right" :style="rightStyle">
            <slot name="right"></slot>
        </div>

    </div>
</template>
<style lang="stylus">
    .c-panel-split{
        clear: both;
        .left,.right,.sider{
            height:100%;
            display: inline-block;
            vertical-align: top;
        }
        .left{
            margin-right:-2px;
        }
        .sider{
            width:2px;
            background-color: #6699FF;
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
            leftStyle(){
                return {
                    width:'19%'
                }
            },
            rightStyle(){
                return {
                    width:'80%'
                }
            }
        },
        props:{
            left:{}
        },
        components:{

        }
    }
</script>