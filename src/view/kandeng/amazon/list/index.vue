<template>
    <page>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="$t('ymx-list.list')" name="1">
                <has-published ref="has"
                               :siteList="siteList"
                               v-if="activeName==='1'"></has-published>
            </el-tab-pane>
            <el-tab-pane :label="$t('ymx-list.notPub')" name="2">
                <not-published ref="not"
                               :site-list="siteList"
                               v-if="activeName==='2'"></not-published>
            </el-tab-pane>
            <el-tab-pane :label="$t('ymx-list.record')" name="3">
                <published-queue ref="queue"
                                 :siteList="siteList"
                                 v-if="activeName==='3'"></published-queue>
            </el-tab-pane>
            <el-tab-pane :label="$t('ymx-list.drafts')" name="5">
                <published-draft ref="draft" v-if="activeName==='5'"></published-draft>
            </el-tab-pane>
        </el-tabs>
    </page>
</template>

<style lang="stylus">

</style>
<script>
    import {api_account_site} from '../../../../api/amazon-publish-list';
    import {api_get_amazon_site} from '../../../../api/product-category-api';
    export default{
        page: {},
        refresh(){
           let refs=['has',"not",'queue',"error","draft"];
            this.$nextTick(()=>{
                let name=refs[parseInt(this.activeName)-1];
                this.$refs[name].init();
            })
        },
        data(){
            return {
                activeName: '1',
                siteList:[{label: this.$t('ymx-list.all'),value: ''}],
            }
        },
        created(){
            this.get_site();
        },
        methods: {
            get_site(){
                this.$http(api_get_amazon_site).then(res => {
                    this.siteList = [{label: this.$t('ymx-list.all'), value: ''},...res.site];
                }).catch(code => {
                    console.log(code);
                })
            },
            init(){

            },
            handleClick(tab, event){
            }
        },
        props: {},
        components: {
             hasPublished: require('./has-published.vue').default,//已刊登
             notPublished: require( './not-published.vue').default,//未刊登
             publishedQueue : require('./published-queue.vue').default, //刊登队列
             publishedError : require('./published-error.vue').default, //刊登异常
             publishedDraft: require('./published-draft.vue').default // 草稿箱

        }
    }
</script>

