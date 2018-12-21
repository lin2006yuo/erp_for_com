<template>
    <page-dialog :title="$t('ymx-list.operate')" v-model="visible" size="large" :close-on-click-modal="false">
        <el-table :data="tableData" border highlight-current-row class="scroll-bar">
            <el-table-column :label="$t('ymx-list.operator')">
                <template slot-scope="scope">
                    <span>{{scope.row.user && scope.row.user.realname}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('ymx-list.operateTime')">
                <template slot-scope="scope">
                    <span>{{scope.row.create_time}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('ymx-list.operateStatus')">
                <template slot-scope="scope">
                    <span>{{scope.row.status}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('ymx-list.operateItem')">
                <template slot-scope="scope">
                    <span v-html="scope.row.log"></span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('ymx-list.FailCauses')">
                <template slot-scope="scope">
                    <span>{{scope.row.message}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="log_page">
            <el-pagination
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page=searchData.page
                :page-sizes="[20, 50,100, 200, 500]"
                :page-size=searchData.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total=total>
            </el-pagination>
        </div>
        <div slot="footer">
            <el-button size="mini" @click="visible=false">{{$t('common.close')}}</el-button>
        </div>

    </page-dialog>
</template>

<style lang="stylus">
    .log_page{
        text-align: right;
    }

</style>
<script>
    import {api_amazon_logs} from '../../../../api/amazon-publish-list';
    export default{
        data(){
            return {
                visible: false,
                searchData:{
                    page:1,
                    pageSize:50,
                    amazon_listing_id:''
                },
                total:0,
                tableData:[]
            }
        },
        methods: {
            init(){

                this.searchData.amazon_listing_id = this.amazonListingId;
                this.$http(api_amazon_logs, this.searchData).then(res=>{
                    this.tableData = res.data;
                    this.total = res.count;
                })
            },
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            }
        },
        watch: {
            value(val){
                this.visible = val;
                if(val){
                    this.init();
                }
            },
            visible(val){
                this.$emit('input', val)
            }
        },
        props: {
            value:{},
            amazonListingId:{
                require:true
            }
        },
        components: {
            pageDialog: require('../../../../components/page-dialog.vue').default
        }
    }
</script>

