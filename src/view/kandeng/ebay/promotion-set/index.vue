<template>
    <page class="p-index">
        <search-card @search="search" @enter="search" :params="params" :clears="clears">
            <label class="inline">ebay账号：</label>
            <el-select class="inline s-width-default" v-sf.account v-model="params.account" filterable clearable placeholder="请选择eBay账号">
                <el-option
                    :key="item.value"
                    v-for="item in c_accountList"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <label class="inline ml-sm">促销名称：</label>
            <el-input class="inline width-super" v-sf.name v-model="params.name" placeholder="请输入促销名称"></el-input>
            <label class="inline ml-sm">状态：</label>
            <el-select class="inline s-width-mini" v-sf.status v-model="params.status" filterable clearable placeholder="请选择状态">
                <el-option
                        :key="item.value"
                        v-for="item in statusList"
                        :label="item.label"
                        :value="item.value"
                ></el-option>
            </el-select>
        </search-card>
        <div class="mt-xs mb-xs ml-sm">
            <permission tag="ElButton"
                        :route="apis.url_save_promotion"
                        size="mini"
                        type="primary"
                        @click.native="add_promotion_rule">新增促销规则</permission>
            <permission tag="ElButton"
                        :route="apis.url_rsync_ebay_promotion"
                        size="mini" type="primary"
                        @click.native="sync_promotion_rule">同步促销规则</permission>
        </div>
        <!--新增促销规则-->
        <add-promotion-rule
                v-model="addDialog"
                :form="add_edit_form"
                :title="title"
                :account-list="accountList"
                @save="save"
        ></add-promotion-rule>
        <el-table
                v-resize="{height:41}"
                class="scroll-bar"
                :data="tableData"
                v-loading="loading"
                @selection-change="selection_change"
                element-loading-text="玩命加载中..."
                highlight-current-row >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="35px"></el-table-column>
            <el-table-column label="促销名称" prop="model_name" show-overflow-tooltip></el-table-column>
            <el-table-column label="账号" inline-template show-overflow-tooltip>
                <div>{{filter_date(this.accountList,row.ebay_account)}}</div>
            </el-table-column>
            <el-table-column label="有效期" inline-template width="350px">
                <div>
                    <span>{{row.start_date | filterTime}}</span>&nbsp;—&nbsp;<span>{{row.end_date | filterTime}}</span>
                </div>
            </el-table-column>
            <el-table-column label="折扣" width="120px" inline-template>
                <div>{{row.promotion_discount}}&nbsp;%</div>
            </el-table-column>
            <el-table-column label="免运费" inline-template width="200px">
                <div>{{row.promotion_trans | filterType}}</div>
            </el-table-column>
            <el-table-column label="状态" inline-template>
                <div>{{row.status | filterStatus}}</div>
            </el-table-column>
            <el-table-column label="操作" inline-template width="120px">
                <div>
                    <permission tag="span"
                                :route="apis.url_save_promotion"
                                class="operate"
                                @click="edit(row)">编辑</permission>
                    <span v-if="showLine">|</span>
                    <permission tag="span"
                                :route="apis.url_delete_promotion"
                                class="operate"
                                @click="cur_delete(row)">删除</permission>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="page_change"
                :current-page="page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count">
        </el-pagination>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_account,api_rsync_ebay_promotion,api_common_modeList,api_get_promotionList,api_edit_promotion,api_delete_promotion} from '../../../../api/ebay-kandeng-public-module';
    import {url_delete_promotion,url_save_promotion,url_rsync_ebay_promotion} from '../../../../api/ebay-kandeng-public-module';
    export default{
        permission:{
            url_save_promotion,
            url_delete_promotion,
            url_rsync_ebay_promotion
        },
        page:{},
        refresh(){
            this.params = {
                account:"",
                name:"",
                status:"",
            };
            this.init();
        },
        computed:{
            showLine(){
                return this.$hasPermission(url_save_promotion)&&this.$hasPermission(url_delete_promotion);
            },
            c_accountList(){
                let arr = window.clone(this.accountList);
                arr.unshift({label:"全部",value:""});
                return arr;
            },
            emptyText(){
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            }
        },
        data(){
            return {
                firstLoading: true,
                ids:[],
                accountList:[],
                statusList:[
                    {label:"全部",value:""},
                    {label:"可用",value:1},
                    {label:"不可用",value:2},
                ],
                /*促销规则*/
                addDialog:false,
                syncDialog:false,
                /*列表*/
                tableData:[],
                page:1,
                pageSize:50,
                count:0,
                /*添加 && 编辑form数据*/
                title:"",
                add_edit_form:{
                    model_name:"",
                    ebay_account:"",
                    start_date:"",
                    end_date:"",
                    promotion:true,
                    promotion_type:1,
                    promotion_discount:"",
                    promotion_cash:"",
                    promotion_trans:false,
                },
                params:{
                    account:"",
                    name:"",
                    status:"",
                },
                clears:{}
            }
        },
        created(){
            this.get_account();
            this.init();
        },
        filters:{
            filterTime(val){
                return val?datef('YYYY-MM-dd HH:mm:ss',val):"-- --";
            },
            filterType(val){
                switch(val){
                    case 0:
                        return '否';
                        break;
                    case 1:
                        return '是';
                        break;
                }
            },
            filterStatus(val){
                return val===1?"可用":"不可用";
            }
        },
        methods:{
            /*搜索  && 清空搜索*/
            search(){
                this.init();
            },
            /*新增促销规则   同步促销规则   删除*/
            add_promotion_rule(){
                this.add_edit_form={
                    model_name:"",
                    ebay_account:"",
                    start_date:"",
                    end_date:"",
                    promotion:true,
                    promotion_type:1,
                    promotion_discount:"",
                    promotion_cash:"",
                    promotion_trans:false,
                }
                this.title = "新增促销设置";
                this.addDialog = true;
            },
            selection_change(val){
                this.ids = val;
            },
            sync_promotion_rule(){
                if(this.ids.length<=0)return this.$message({type:"warning",message:"请先选择需要同步促销规则的数据"});
                let params = {
                    data:this.ids.join(',')
                };
                return this.$http(api_rsync_ebay_promotion,params).then(res=>{
                     this.$message({type:"success",message:res.message||res});
                     this.init();
                     return Promise.resolve();
                }).catch(code=>{
                     this.$message({type:"error",message:code.message||code})
                });
            },
            batch_delete(){
                console.log("batch_delete");
            },
            save(val,data){
                val.id = parseInt(data.id);
                val.status = data.status;
                let index = this.tableData.find(row=> {
                    return row.id === val.id;
                });
                if(index instanceof Object){
                    Object.assign(index,val)
                }else{
                    this.tableData.unshift(val);
                    this.count++;
                }
            },
            /*列表  编辑 && 删除*/
            edit(row){
                this.edit_promotion_rule(row.id);
                this.title = `编辑促销：${row.model_name} 信息`;
                this.addDialog = true;
            },
            cur_delete(row){
                this.$confirm(`您将删除${row.model_name}促销数据,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        model_type:"promotion",
                        id:row.id,
                    }
                    this.$http(api_delete_promotion,params).then(res=>{
                        this.$message(res.message);
                        let index = this.tableData.findIndex( old=> {
                        	return old.id===row.id
                        });
                        this.tableData.splice(index,1)
                        this.count--;
                    }).catch(code=>{
                        this.$message({message:code.message,type:'error'});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            /*列表翻页*/
            size_change(size){
                this.pageSize = size;
                this.init();
            },
            page_change(page){
                this.page = page;
                this.init();
            },
            /*转换  表格站点&&账号*/
            filter_date(Array,id){
                let cur = Array.find((row)=>{
                    if(row.value === id){
                        return row;
                    }
                })
                if(!!cur)return  cur.label;
                return '- -'
            },
            //     账号  API
            get_account(){
                this.$http(api_get_account).then(res=>{
                    this.accountList = res.data.map(row=>{
                        return {
                            label:row.code,
                            value:row.id
                        }
                    });
                }).catch(code=>{
                    this.$message({type:"error",message: code.message || code});
                });
            },
            //获取列表数据
            init(){
                let params = {
                    model_type:'promotion',
                    page:this.page,
                    size:this.pageSize,
                    ebay_account:this.params.account,
                    model_name:this.params.name,
                    status:this.params.status
                };
                this.loading = true;
                this.$http(api_get_promotionList,params).then(res=>{
                    this.tableData = res.data;
                    this.count = res.count;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                    setTimeout(()=>{
                        this.loading = false;
                        this.firstLoading = false;
                    },200)
                });
            },
            /*编辑促销规则*/
            edit_promotion_rule(id){
                    let params = {
                        model_type:"promotion",
                        id:id,
                    };
                    this.$http(api_edit_promotion,params).then(res=>{
                        res.data.promotion = res.data.promotion?true:false;
                        res.data.promotion_trans = res.data.promotion_trans?true:false;
                        this.add_edit_form = res.data;
                        this.add_edit_form.end_date = res.data.end_date?new Date(res.data.end_date*1000):"";
                        this.add_edit_form.start_date = res.data.start_date?new Date(res.data.start_date*1000):"";
                    }).catch(code=>{
                        this.$message({type:"error", message: code.message || code});
                    });
            },
        },
        components: {
            addPromotionRule:require('./add-promotion-rule.vue').default,
            searchCard:require('../../../../components/search-card.vue').default,
        }
    }
</script>
