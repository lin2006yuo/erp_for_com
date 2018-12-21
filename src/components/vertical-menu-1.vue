<template>
    <ul class="c-vertical-menu-1">
        <li class="menu-child" v-for="(item,index) in menuData" :key="item.id">
            <div class="menu-child-title">
                <ui-tip :content="item.title" :width="98"></ui-tip>
            </div>
            <div v-for="it in item.children"
                 :class="[it.children&&it.children.length>0?'parent-icon_':'','menu-child-content']"
                 :key="it.id" @click="open_router(it)">
                <ui-tip :content="it.title" :width="98"></ui-tip>
                <div v-if="it.children&&it.children.length>0"
                     :class="[it.children&&it.children.length>0?'child-icon_':'','content-child']"
                     v-for="it_row in it.children" :key="it_row.id"
                     @click="open_router(it_row)">
                    <ui-tip :content="it_row.title" :width="98"></ui-tip>
                </div>
            </div>
        </li>
    </ul>
</template>
<style lang="stylus">
    .c-vertical-menu-1{
        /*color:#a8acb1;*/
        .menu-child{
            box-sizing:border-box;
            float:left;
            width:140px;
            overflow:hidden;
            text-align:center;
            padding:10px;
            .menu-child-title{
                width:100%;
                font-weight:650;
                font-size:1.5rem;
                border-bottom:2px solid #ddd;
                padding-bottom: 5px;
            }
            .menu-child-content{
                width:100%;
                /*height:26px;*/
                line-height:26px;
                cursor: pointer;
                position:relative;
                &.parent-icon_{
                    background-image:url('../assets/open-icon.svg');
                    background-repeat:no-repeat;
                    background-size:24px 24px;
                    background-position:0 2px;
                }
                &:hover{
                    background-color: #F1F5FE;
                }
                .content-child{
                    position:relative;
                    &.child-icon_{
                        background-image:url('../assets/circle.svg');
                        background-repeat:no-repeat;
                        background-size:8px 8px;
                        background-position:11px 13px;
                        &:hover{
                            background-image:url('../assets/circle-hover.svg');
                        }
                    }
                    .p-ui-tip{
                        >a{
                            &:hover{
                                color: #00acac !important;
                            }
                        }
                    }
                    &:hover{
                        color: #00acac;
                    }
                }
            }
        }
    }
</style>
<script>

    export default {
        data() {
            return {}
        },
        methods:{
            open_router(row){
                if(row.children&&row.children.length>0)return;
                this.$open(row);
                this.$emit('open-router');
            },
        },
        props:{
            menuData:{}
        },
        components: {
            uiTip:require('./ui-tip.vue').default,
        }
    }
</script>