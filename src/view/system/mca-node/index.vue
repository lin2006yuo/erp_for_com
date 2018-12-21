<template>
    <page>
        <mca-node @show-page-node="show_page_node"
                  @show-filter-node="show_filter_node"
                  :nodes="nodes"
                  v-loading="loading"
                  element-loading-text="玩命加载中..."></mca-node>
        <filter-node v-model="showFilterNode" :controller="controller"></filter-node>
    </page>
</template>
<style lang="stylus">

</style>
<script>

    import {api_get} from '../../../api/mca-node';
    export default{
    	page:{},
        refresh(){
            this.init();
        },
        data(){
            return{
                showPageNode:false,
                showFilterNode:false,
                nodes:[],
                controller:{},
                loading:true
            }
        },
        created(){
            this.init();
        },
        methods:{
        	init(){
                this.loading = true;
                this.$http(api_get).then(res=>{
                    this.nodes = res;
                    setTimeout(() => {
                        this.loading = false;
                    }, 1000);
                });
            },
            show_page_node(controller){
                this.controller= controller;
                this.showPageNode = true;
            },
            show_filter_node(controller){
                this.controller = controller;
                this.showFilterNode = true;
            }
        },
        components:{
            mcaNode:require('./mac-node.vue').default,
            filterNode:require('./filter-node.vue').default,
        }
    }
</script>
