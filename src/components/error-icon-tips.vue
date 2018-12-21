<template>
    <div class="c-error-icon-tips">
        <el-popover
                ref="popover2"
                :placement="placement"
                :title="title"
                :width="width"
                :trigger="trigger">
            <div style="padding:8px">
                <p class="red">{{content[0]}}</p>
                <p v-if="content[1]">{{content[1]}}</p>
            </div>
        </el-popover>
        <span class="error-icon" v-popover:popover2></span>
    </div>
</template>
<style lang="stylus">
    .c-error-icon-tips{
        .error-icon{
            position:absolute;
            top:7px;
            right:13px;
            width:16px;
            height:16px;
            background:url('../assets/error-icon2.png') no-repeat center center;
            background-size:cover;
            &:hover{
                box-shadow:0 0 10px rgba(105,105,105,1);
                border-radius:50%;
                transform:scale(1.1);
                -ms-transform:scale(1.1); 	/* IE 9 */
                -moz-transform:scale(1.1); 	/* Firefox */
                -webkit-transform:scale(1.1); /* Safari 和 Chrome */
                -o-transform:scale(1.1);
            }
        }
    }
</style>
<script>

    export default {
        data() {
            return {}
        },
        props:{
            title:{
                type:String,
                default(){
                    return '';
                },
            },
            trigger:{
                type:String,
                default(){
                    return 'click';
                },
            },
            content:{
                type:Array,
                default(){
                    return [];
                },
            },
            placement:{
                type:String,
                default(){
                    return "bottom"
                },
            },
            width:{
                type:String,
                default(){
                    return "200"
                },
            }
        },
        components: {}
    }
</script>