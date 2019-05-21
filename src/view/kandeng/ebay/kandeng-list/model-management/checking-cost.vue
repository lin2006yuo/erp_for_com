<template>
    <page-dialog v-model="show"
                 size="full" title="检查eBay费用"
                 @open='open' :close-on-click-modal="false">
        <p>此处为eBay API平台返回的标准收费，不包含任何eBay活动折扣，实际收费以刊登后eBay平台为准。</p>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column label="刊登标题" width="300" inline-template>
                <ui-tip :content="row.title"></ui-tip>
            </el-table-column>
            <el-table-column label="SPU" width="90" prop="spu"></el-table-column>
            <el-table-column label="账号简称" width="120" prop="account_code"></el-table-column>
            <el-table-column label="站点" width="120" inline-template>
                <span>{{filterSite(row.site)}}</span>
            </el-table-column>
            <el-table-column label="出售方式" width="120" inline-template>
                <span>{{row.listing_type | way}}</span>
            </el-table-column>
            <el-table-column inline-template label="刊登费用">
                <div>
                    <div v-if='row.expenses.length>0' v-for="item in row.expenses">{{item}}</div>
                    <div v-else>暂无数据</div>
                </div>
            </el-table-column>
            <el-table-column inline-template label="检查失败">
                <ui-tip :content="row.message"></ui-tip>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="close" >关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .text-right{
        text-align: right;
        padding-right:5px;
    }
    .td-ud{
        text-decoration : underline
    }
</style>
<script>
    import {api_check_draft_fee,api_testfees_batch} from "../../../../../api/ebay-kandeng-public-module"
    import {mapGetters} from 'vuex';
    export default{
        data(){
            return{
                show:this.value,
                tableData:[],
            }
        },
        methods:{
            open(){
                this.init();
            },
            init(){
                let draft_ids = this.selectIds.map(x => x.id).join(",");
                let account_ids = this.selectIds.map(x => x.account_id).join(",");
                this.tableData = this.selectIds.map(row=>{
                    return {
                        draft_id:row.id,
                        title:row.title,
                        spu:row.spu,
                        account_code:row.account_code,
                        listing_type:row.listing_type,
                        site:row.site,
                        expenses:[],
                        message:'',
                    }
                });
                let params = {
                    draft_ids:draft_ids,
                    account_ids:account_ids,
                };
                this.$http(api_testfees_batch,params).then(res=>{
                    res.data.forEach(row=>{
                        let expenses = Object.keys(row.fees_info).map(it=>{
                            return `${it} = ${row.fees_info[it]}`
                        });
                        let find = this.tableData.find(item=>item.id===row.id);
                        if(find) {
                            this.$set(find,'expenses',expenses);
                            find.message = row.message;
                        }
                    });
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:code.message||code
                    });
                });
            },
            close(){
                this.show=false;
            },
            filterAccount(val){ // 过滤账号
                this.accountList = this.accounts("ebay");
                let name = "";
                this.accountList.forEach(row =>{
                    if(val === row.value){
                        name = row.label
                    }
                });
                return name
            },
            filterSite(val){ // 过滤站点
                let name = "";
                this.siteList.forEach(row =>{
                    if(val === row.id){
                        name = row.label;
                    }
                });
                return name
            },
        },
        computed:{
            ...mapGetters({accounts:'api/getPublishAccount'}),
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        filters:{
            way(value){
                switch(value){
                    case 1:
                        return "一口价";
                        break;
                    case 2:
                        return "拍卖";
                        break;
                    default:
                        break;
                }
            },
            filterDay(val){
                switch (val){
                    case 1:
                        return "GTC";
                        break;
                    case 2:
                        return 1;
                        break;
                    case 3:
                        return 3;
                        break;
                    case 4:
                        return 5;
                        break;
                    case 5:
                        return 7;
                        break;
                    case 6:
                        return 10;
                        break;
                    case 7:
                        return 30;
                        break;
                    default:
                        break;
                }
            },
        },
        props:{
            value:{
                required:true,
            },
            selectIds:{},
            siteList:{
                required:true,
                type:Array,
            },
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
            uiTip:require('@/components/ui-tip.vue').default,
        }
    }
</script>
