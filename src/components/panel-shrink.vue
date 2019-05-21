<template>
    <div class="panel-shrink">
        <div  class="panel"   :style="menuStyle">
            <slot v-show="showShrink" name="left"></slot>
        </div>
        <div class="panel" :style="contentStyle"  >
            <slot name="right"></slot>
        </div>
        <div class="paging">
            <slot name="pagination"></slot>
        </div>
        <slot name="other"></slot>
        <!--<slot></slot>-->
    </div>
</template>
<style lang="stylus">
    .panel-shrink{
        position: absolute;
        top:60px;
        left:0;
        right:0;
        bottom:0;
        display: flex;
        .side{
            position: absolute;
            display: inline-block;
            top:0;
            right:-1px;
            width:1px;
            height:100%;
            background-color: #e3e3e3;
            .side-button{
                z-index:1000;
                position: absolute;
                top:30%;
                display: inline-block;
                width:17px;
                height:61px;
                border-top-right-radius: 15px;
                border-bottom-right-radius: 15px;
                background: url(../assets/icon_arrow.png) no-repeat 0 0;
                &:hover{
                    background-position: -22px 0;
                    cursor: pointer;
                }
            }
        .buttonclass{
                background: url(../assets/icon_arrow.png) no-repeat 0 -61px;
                &:hover{
                    background-position: -22px -61px;
                    cursor: pointer;
                }
            }
        }
        .panel{
            display: block;
            position: relative;
            height:100%;
            margin-left:0;
            border-left:2px solid #00acac;
        }
    }
</style>
<script>

    import {mapGetters} from 'vuex';
    export default{
        data(){
            return {
                contentStyle:{ flex:1}
            };
        },
        mounted(){
            console.log(this.showShrink,'this.showShrink');
        },
        computed:{
            ...mapGetters({
                viewMode:'ui/viewMode',
            })
        },
        props:{
            span:{
                default:4
            },
            menuStyle:{

            },
            showShrink:{},
        },
        components:{

        }
    }
</script>