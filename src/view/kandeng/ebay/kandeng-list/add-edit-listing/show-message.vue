<template>
    <page class="c-show-message">
        <div>
            <el-table
                class="scroll-bar" 
                :data="dataTable"
                element-loading-text="玩命加载中..."
                highlight-current-row
            >
                <el-table-column label="本地SPU" prop="spu"></el-table-column>
                <el-table-column label="站点" prop="site_name"></el-table-column>
                <el-table-column label="刊登账号" prop="account_code"></el-table-column>
                <el-table-column label="刊登标题" inline-template>
                    <div>
                        <ui-tip :content="row.title" :width="95"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="刊登费用" inline-template>
                    <div>{{row.site_code}}&nbsp;{{row.insertion_fee}}</div>
                </el-table-column>
                <el-table-column label="刊登结果" inline-template>
                    <div>
                        <template v-if="row.listing_status===4">
                            <span class="red">刊登失败！</span>
                            <el-popover placement="left"
                                        title="失败原因："
                                        width="400"
                                        trigger="hover">
                                <div>{{row.message}}</div>
                                <span slot="reference">
                                        <span class="operate">失败原因</span>
                                    </span>
                            </el-popover>
                        </template>
                        <template v-if="row.listing_status===3">
                            刊登成功！Item ID: <a :href="row.cur_link" target="_blank" class="link">{{row.item_id}}</a>
                        </template>
                        <template v-if="row.listing_status===0||row.listing_status===1">
                            数据提交中，请稍后...
                        </template>
                    </div>
                </el-table-column>
            </el-table>
            <el-button type="primary"
                       size="mini"
                       class="inline fr mt-sm ml-sm"
                       @click.native="close">关闭</el-button>
            <!--<page-dialog v-model="dialog"></page-dialog>-->
        </div>
    </page>
</template>
<style lang="stylus" scoped>

</style>
<script>
    import {api_get_ebay_site,api_publish_immediately,api_get_immediately_results}from '../../../../../api/ebay-kandeng-public-module';
    import {mapGetters,mapActions} from 'vuex'
    export default {
        page:{
//            multiple: true,
        },
        data() {
            return {
//                tableData:[],
            }
        },
        mounted(){
            this.timer = setInterval(this.get_,3000);
        },
        destroyed(){
            this.clear_data();
            clearInterval(this.timer);
        },
        computed:{
            ...mapGetters({
                'ids':'kandeng-result/ids',
                'dataTable':'kandeng-result/dataTable'
            })
        },
        methods:{
            ...mapActions({
                clear_data:'kandeng-result/clear_data',
                remove_ids:'kandeng-result/remove_ids',
                replace_table:'kandeng-result/replace_table',
            }),
            get_site_name(siteId){
                let find = this.param.siteList.find(row=>row.siteid===siteId);
                if(!!find)return find.country;
            },
            get_(){
                if(this.ids.length>0){
                    this.$http(api_get_immediately_results,{ids:this.ids}).then(res=>{
                        res.data.forEach(row=>{
                            let link = this.add_cur_link(row.site);
                            if(row.listing_status===3){
                                link = link+row.item_id;
                            }
                            this.$set(row,'cur_link',link);
                            if(row.listing_status===3||row.listing_status===4)this.remove_ids(row.id);
                        });
                        this.replace_table(res.data);
                    }).catch(code=>{
                        console.log(code);
                    })
                }
            },
            add_cur_link(siteId){
                switch(siteId){
                    case 0:
                        return 'https://www.ebay.com/itm/';
                    case 100:
                        return 'https://www.ebay.com/itm/';
                    case 15:
                        return 'https://www.ebay.com.au/itm/';
                    case 16:
                        return 'https://www.ebay.at/itm/';
                    case 186:
                        return 'https://www.ebay.es/itm/';
                    case 101:
                        return 'https://www.ebay.it/itm/';
                    case 71:
                        return 'https://www.ebay.fr/itm/';
                    case 3:
                        return 'https://www.ebay.co.uk/itm/';
                    case 77:
                        return 'https://www.ebay.de/itm/';
                    case 2:
                        return 'https://www.ebay.ca/itm/';
                    default:
                        console.error(`NO FIND ${siteId}`);
                }
            },
            close(){
                this.$close('/show-message');
            },
            look_over(){

            },
        },
        components:{
            uiTip:require('../../../../../components/ui-tip.vue').default,
            pageDialog:require('../../../../../components/page-dialog.vue').default,
        }
    }
</script>