<template>
    <div class="c-item-page">
        <div>{{label}}<i  v-if="canShrink" @click="show_it">{{showButton}}</i></div>
        <transition name="tran-item-page">
            <div v-if="show">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>
<style lang="stylus">
    .c-item-page{
        border: 1px solid gainsboro;
        >div:first-child{
            padding-left: 10px;
            font-size: 24px;
            line-height: 24px;
            background-color: #aaa3a0;
            i{
                display: block;
                height:24px;
                width:24px;
                text-align: center;
                float: right;
                margin-right:20px;
                cursor: pointer;
                border:1px solid gainsboro;
            }
        }
    }
    .tran-item-page-leave{
        animation: page-leave .5s;
    }
    @keyframes page-leave {
        0%{
            height:90%;
        }
        50%{
            height:25%;
        }
        100%{
            height:0%;
        }
    }
</style>
<script>

    export default{
        data(){
            return{
                show:true,
            }
        },
        props:{
            label:{
            },
            canShrink:{
                type:Boolean,
                default:function () {
                    return false;
                }
            }
        },
        methods:{
            show_it(){
                this.show = !this.show;
            }
        },
        computed:{
            showButton(){
                return this.show ? '-' : '+';
            }
        },
        components:{

        }
    }
</script>