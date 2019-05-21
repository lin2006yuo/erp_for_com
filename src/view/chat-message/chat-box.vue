<template>
    <div class="c-chat-box">
        <img class="ding" @click="ding=false;" v-if="ding" src="../../assets/ding.png" title="点击取消Ding住">
        <img class="ding" v-else @click="ding=true;" src="../../assets/ding-un.png" title="点击Ding住">
        <ul class="opens">
            <li v-for="open in opens"
                :key="open.userid"
                v-menu-context="menuContext">
            </li>
        </ul>
    </div>
</template>
<style lang="stylus">
    .c-chat-box{
        position: absolute;
        left:-625px;
        top:40%;
        width:620px;
        height:300px;
        background-color: #f3f3f3;
        border:1px solid #c1c1c1;
        &:hover{
            border: 2px solid #9c9c9c;

        }
        .ding{
            position: absolute;
            top:2px;
            right:2px;
            width:22px;
            height:22px;
            &:hover{
                background-color: #dddddd;
            }
        }
        .opens{
            position: absolute;
            left: 0;
            top:0;
            height:100%;
            width: 100px;
            background-color: #f3f3f3
            border-right:1px solid #dddddd;
            overflow-y:hidden;
            &:hover{
                overflow-y:auto;
            }
            &::-webkit-scrollbar-track-piece{width:2px;background-color:#4e4e5a ;  }

            &::-webkit-scrollbar{width:2px;height:6px ; }

            &::-webkit-scrollbar-thumb{height:10px;background:#3fb560;   cursor:pointer;}

            &::-webkit-scrollbar-thumb:hover{background:#3fb560 ; cursor:pointer}
            li{
                border-bottom:1px #dddddd solid;
                height:32px;
                &:hover{
                    background-color: #dddddd;
                }
                &:active{
                    background-color: #cacaca;
                }
                &.active{
                    background-color: #ececec;
                }
            }
        }
    }
</style>
<script>

    import {mapGetters} from 'vuex';
    export default{
        data(){
            return{
                menuContext:[
                    {label:'xxxx',action(){
                        console.log(this.ding);
                    }},
                    {label:'yyyyy',action(){
                        console.log(this.ding);
                    }}
                ]
            }
        },
        computed:{
            ...mapGetters({
                opens:'chat/opens'
            }),
            ding:{
                get(){
                    return this.$store.getters['chat/ding'];
                },
                set(val){
                    this.$store.dispatch('chat/changeDing',val);
                }
            }
        },
        components:{

        }
    }
</script>