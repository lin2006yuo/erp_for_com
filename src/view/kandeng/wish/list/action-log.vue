<template>
    <div class="p-action-log">
        <page-dialog :title="`查看 ${productId} 操作日志`" size="large"
                     v-model="show" :close-on-click-modal="false" @open="open">
            <el-table
                    :data="tableData"
                    border
                    :max-height="490"
                    v-loading="loading"
                    element-loading-text="玩命加载中..."
                    highlight-current-row
                    style="width: 100%">
                <el-table-column
                       inline-template
                        label="操作人"
                        width="100">
                    <span v-if="type==='ebay'">
                        {{row.realname}}
                    </span>
                    <span v-else>
                        <span v-if="type==='joom'">
                            {{row.create_name}}
                        </span>
                        <span v-else>
                            {{row.user.realname}}
                        </span>
                    </span>
                </el-table-column>
                <el-table-column
                        label="操作时间"
                        inline-template
                        width="140">
                    <span>{{row.create_time | filterTime}}</span>
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="操作状态"
                        inline-template
                        width="100">
                    <span>{{row.status | filterStatus}}</span>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="操作事项">
                    <span v-if="type!=='ebay'" v-html="row.log"></span>
                    <span v-else v-html="row.contents"></span>
                    <!--<ui-tip :content="row.log"></ui-tip>-->
                </el-table-column>
                <el-table-column
                        prop="message"
                        label="失败原因">
                </el-table-column>
                <!--<el-table-column-->
                        <!--label="定时执行时间"-->
                        <!--width="160"-->
                        <!--inline-template-->
                <!--&gt;-->
                    <!--<span>{{row.cron_time | filterTime}}</span>-->
                <!--</el-table-column>-->
            </el-table>
            <el-pagination
                class="fr mt-sm mb-sm"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="show=false" >关   闭</el-button>
            </div>
        </page-dialog>

    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_wish_action_log} from "../../../../api/kandeng"
    import {api_logs} from "../../../../api/publish-smt"
    import {api_get_action_logs} from "../../../../api/ebay-kandeng-public-module"
    import {api_joom_listing_logs} from "../../../../api/publish-joom"
    import {api_logs_publish} from "../../../../api/shopee-publish"

    import {api_record_logs} from "@/api/mymall"
    export default{
        data(){
            return {
                show:false,
                tableData:[],
                loading:true,
                page:1,
                size:20,
                total:0,
            }
        },
        created(){
        },
        mounted(){
        },
        computed: {
        },
        methods: {
            init(){
                this.loading=true;
                switch (this.type){
                    case "wish":
                    	this.operate(api_wish_action_log);
                    	break;
                    case "aliExpress":
                        this.operate(api_logs);
                    	break;
                    case "ebay":
                    	this.operate(api_get_action_logs);
                    	break;
                    case "joom":
                        this.operate(api_joom_listing_logs);
                    	break;
                    case "mymall":
                        this.operate(api_record_logs);
                        break;
                    case "shopee":
                        this.operate(api_logs_publish);
                        break;
                    default:
                    	break;
                }
            },
            operate(api){
            	let params = {};
            	if(this.type==="ebay"){
                    params = {
                        page:this.page,
                        size:this.size,
                        item_id:this.productId
                    };
                }else{
                    params = {
                        page:this.page,
                        pageSize:this.size,
                        product_id:this.productId
                    };
                }
                this.$http(api,params).then(res=>{
                    this.tableData=res.data;
                    this.total = res.count;
                    this.loading=false;
                }).catch(code=>{
                    this.loading=false;
                    this.$message({type: "error", message: code.message||code})
                })
            },
            open(){
                this.tableData=[];
                this.init();
            },
            handleSizeChange(size){
                this.size=size;
                this.init();
            },
            handleCurrentChange(page){
                this.page=page;
                this.init();
            },
        },
        filters: {
        	filterTime(val){
        		if(typeof val==="number"){
                    return val ? datef('YYYY-MM-dd HH:mm:ss',val) : "即时" ;
                }else{
                    return val;
                }
            },
            filterStatus(val){
                if(typeof val==="number"){
                    switch (val){
                        case 0:
                        	return "未更新";
                        	break;
                        case 1:
                            return "更新中";
                            break;
                        case 2:
                            return "更新成功";
                            break;
                        case 3:
                            return "更新失败";
                            break;
                        default:
                        	break;
                    }
                }else{
                    return val;
                }
            },
        },
        watch: {
            show(val){
                this.$emit("input", val)
            },
            value(val){
                this.show=val;
            },

        },
        props: {
            productId:{},
            value:{},
            type:{
            	default(){
            		return "wish";
                }
            }
        },
        components: {
            pageDialog:require("../../../../components/page-dialog.vue").default,
            uiTip:require('../../../../components/ui-tip.vue').default
        }
    }
</script>
