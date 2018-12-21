<template>
    <div class="chat-message">
        <el-autocomplete
                class="search-input"
                popper-class="chat-search"
                v-model="searchKey"
                :fetch-suggestions="querySearch"
                custom-item="chat-search-item"
                placeholder="搜索你想要的..."
                @select="handleSelect"
                icon="search"
        ></el-autocomplete>
        <ul class="user-list">
            <li v-for="user in users" :key="user.userid">

            </li>
        </ul>
        <chat-box></chat-box>
    </div>
</template>
<style lang="stylus">
    .chat-message{
        box-sizing border-box;
        z-index: 999;
        background-color: #FFF;
        position: absolute;
        top:0;
        right:1px;
        height:100%;
        width:220px;
        border-left:2px solid rgba(138, 212, 255, 0.34);
        padding:10px 5px;
        &:hover{
            border-left-color: #CCC;
        }
        .search-input{
            height:32px;
            width:100%;
        }
        .user-list{
            position: absolute;
            top:40px;
            left:0;
            right:0;
            bottom :20px;
            background-color: #efefef;
            overflow-y hidden;
            &:hover{
                overflow-y: auto;
            }
            &::-webkit-scrollbar-track-piece{width:2px;background-color:#4e4e5a ;  }

            &::-webkit-scrollbar{width:2px;height:6px ; }

            &::-webkit-scrollbar-thumb{height:10px;background:#3fb560;   cursor:pointer;}

            &::-webkit-scrollbar-thumb:hover{background:#3fb560 ; cursor:pointer}
            li{
                border-bottom:1px solid #dddddd;
                height:48px;
                &:hover{
                    background-color :#dddddd;
                }
            }
        }
        .chat-search {
            li {
                line-height: normal;
                padding: 7px;

                .name {
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
                .addr {
                    font-size: 12px;
                    color: #b4b4b4;
                }

                .highlighted .addr {
                    color: #ddd;
                }
            }
        }
    }
</style>
<script>
    import Vue from 'vue';
    Vue.component('chat-search-item', {
        functional: true,
        render: function (h, ctx) {
            var item = ctx.props.item;
            return h('li', ctx.data, [
                h('div', { attrs: { class: 'name' } }, [item.value]),
                h('span', { attrs: { class: 'addr' } }, [item.address])
            ]);
        },
        props: {
            item: { type: Object, required: true }
        }
    });
    import {mapGetters, mapActions} from 'vuex';
    export default{
        data(){
            return{
                searchKey:'',
            }
        },
        methods:{
            handleSelect(){},
            querySearch(){},
        },
        computed:{
            ...mapGetters({
                'users':'chat/users'
            })
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            }
        },
        components:{
            chatBox:require('./chat-box.vue').default
        }
    }
</script>