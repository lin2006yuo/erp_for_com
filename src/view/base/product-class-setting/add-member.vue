<template>
    <div class="add-members">
        <page-dialog title="添加成员" v-model="show" size="large"
                     @open="open"
                     @close="close"
                     :close-on-click-modal="false" @change="change_dialog"  >
        <search :searchData="searchData" @search="search" @clear="clear" class="mb-sm"></search>
            <el-table
                    v-loading="loading" element-loading-text="玩命加载中..."
                    :data="tableData"
                    style="width: 100%"
                    height="300"
                    class="scroll-bar"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="35">
                </el-table-column>
                <el-table-column
                        prop="channel_id"
                        label="平台"
                        >
                </el-table-column>
                <el-table-column
                        prop="account_id"
                        label="渠道账号"
                        >
                </el-table-column>
                <el-table-column
                        inline-template
                        label="销售员"
                >
                    <div>
                       <div  class="boder"  v-for="item in row.info">{{item.seller_id}}</div>
                    </div>
                </el-table-column>

                <el-table-column
                        inline-template
                        label="仓库类型"
                >
                    <div>
                        <div class="boder"  v-for="item in row.info">{{item.warehouse_type | warehouse_type}}</div>
                    </div>
                </el-table-column>
                <el-table-column
                        prop="customer_id"
                        label="客服">
                </el-table-column>
            </el-table>
            <div style="text-align: right;">
        <el-pagination
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
            </div>
            <div slot="footer" >
                <request-button req-key='addMember' @click="save_member">确定</request-button>
                <el-button size="mini" @click.native="show = false">关闭</el-button>
            </div>
    </page-dialog>
    </div>
</template>
<style lang="stylus">
.add-members{
    .boder+.boder{
        border-top: 1px solid sandybrown;

    }
}
</style>
<script>
    import {api_member_list,api_member_edit,api_member_del,api_member_batch} from "../../../api/member"
    import {api_product_channel,api_product_account} from "../../../api/product-class"
    export default{
        data(){
            return {
                searchData:{
                    channel_id:this.channel,
                    snType:"sales",
                    snText:"",
                    account_id:"",
                    page:1,
                    pageSize:50,
                },
                show:false,
                total:0,
                loading:true,
                tableData:[],
                memVisable:false,
                channels:[],
                selects:[],
            }
        },
        created(){
        },
        mounted(){
            this.init()
            this.get_channel()
        },
        computed: {},
        methods: {
            open(){
                this.searchData = {
                    channel_id:this.channel,
                    snType:"sales",
                    snText:"",
                    account_id:"",
                    page:1,
                    pageSize:50,
                };
                this.search();
            },
            close(){
                this.selects=[];
            },
            init(){
                this.loading=true
                this.$http(api_member_list,this.searchData).then(res=>{
                    this.loading=false;
                    this.total=res.count;
                    this.tableData=res.data.map(row=>{
                        row.isCheck=false
                        return row;
                    });
                }).catch(code=>{console.log(code)})
            },
            handle_size_change(val){
                this.searchData.pageSize=val;
                this.init()
            },
            handle_current_change(val){
                this.searchData.page=val;
                this.init()
            },
            handleSelectionChange(val){
              this.selects =val;
            },
            save_member(){
                if(this.selects.length===0){
                    this.$message({type:"warning",message:"请选择成员"});
                    setTimeout(() => {
                        this.$reqKey('addMember', false);
                    }, 300);
                    return;
                }
                this.show=false;
              this.$emit("selected",this.selects)
            },
            get_channel(){
                this.channels=[];
                this.$http(api_product_channel).then(res=>{
                    this.channels=res;
                }).catch(code=>{
                    console.log(code)
                })
            },
            search(){
                this.init()
            },
            clear(){
                this.searchData={
                    channel_id:this.channel,
                    snType:"sales",
                    snText:"",
                    account_id:"",
                    page:1,
                    pageSize:10,
                };
                this.init()
            },
        },
        filters: {},
        watch: {
            show(val){
                this.$emit("input",val)
            },
            value(val){
                this.show=val;
            }
        },
        props: {
            value:{},
            channel:{}
        },
        components: {
            pageDialog:require("../../../components/page-dialog.vue").default,
            search:require("../member-ship/search.vue").default,
            uiTable:require("../../../components/ui-table.vue").default
        }
    }
</script>
