<template>
    <page-dialog v-model="show" size="large" title="批量修改商店分类" @open="open"
                 class="ebay-published-oprate" :close-on-click-modal="false">
        <div class="row">
            <label-item label="第一分类：">
                <el-button type="primary" size="mini" @click.native="choice_store('first')"
                           class="inline ml-sm">选择商店分类</el-button>
                <span class="ml-sm">{{get_classify(classify.first,classify.firstName)}}</span>
            </label-item>
        </div>
        <div class="row">
            <label-item label="第二分类：">
                <el-button type="primary" size="mini" class="inline ml-sm"
                           @click.native="choice_store('second')">选择商店分类</el-button>
                <span class="ml-sm">{{get_classify(classify.second,classify.secondName)}}</span>
            </label-item>
            <p>小提示：请确认您的eBay账号开通了商店，否则无法使用商店分类。</p>
        </div>
        <p>
            <label class="label-title"> 定时提交修改：</label>
            <el-date-picker
                v-model="classify.cron_time"
                type="datetime"
                class="inline"
                placeholder="选择日期时间">
            </el-date-picker>
        </p>
        <p class="remark-box">
            <label class="label-title"> 修改备注：</label>
            <el-input
                type="textarea"
                :rows=4
                style="width:35%"
                placeholder="请输入内容"
                v-model="classify.remark">
            </el-input>
        </p>
        <el-row>
            <el-button size="mini"
                       @click.native="look_store"
                       type="primary"
                       class="mt-sm mb-sm fr">预览</el-button>
        </el-row>
        {{parentId}}
        <el-table :data="showDatas" style="width: 100%">
            <el-table-column inline-template label="item_ID" width="120" v-if="ebayStatus==='already'">
                <div v-copy>{{row.item_id}}</div>
            </el-table-column>
            <el-table-column inline-template label="范本ID" width="120" v-if="ebayStatus==='model'">
                <div v-copy>{{row.id}}</div>
            </el-table-column>
            <el-table-column label="修改前" inline-template align="left">
                <div>
                    <div>第一分类：{{row.store_category_chain}}</div>
                    <div>第二分类：{{row.store_category2_chain}}</div>
                </div>
            </el-table-column>
            <el-table-column label="修改后" inline-template align="left">
                <div v-if="editShow">
                    <div>第一分类：{{get_classify(classify.first,classify.firstName)}}</div>
                    <div>第二分类：{{get_classify(classify.second,classify.secondName)}}</div>
                </div>
            </el-table-column>
        </el-table>
        <store-dialog v-model="storeDialog" :account-id="accountId" @submit="store_submit"></store-dialog>
        <div slot="footer" class="dialog-footer">
            <request-button @click="keep" req-key='actionStore' :mintime="300">确定</request-button>
            <el-button size="mini" @click.native="close" >关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .ebay-published-oprate{
        .remark-box{
            min-height:90px;
        }
        .label-title{
            width: 90px;vertical-align: top;text-align: right;display: inline-block
        }
        .row{
            padding:5px 10px;
        }
        .text-right{
            text-align: right;
            padding-right:5px;
            margin: 3px 0;
        }
    }
</style>
<script>
    import {api_edit_ebay_product_auction_price,api_custom_category_tree,api_edit_ebay_shop_category,api_draft_store_category} from "../../../../../api/ebay-kandeng-operated"
    import {api_get_custom_category,api_dl_store_category,api_up_store} from "../../../../../api/ebay-kandeng-public-module"
    export default{
        data(){
            return{
                show:this.value,
                firstSearch:"",
                secondSearch:"",
                classify:{ //分类
                    first:"",
                    firstName:"",
                    second:"",
                    secondName:"",
                    cron_time:"",
                    remark:"",
                },
                firstOptions:[],
//                secondOptions:[],
                showDatas:[],
                trees:[],
                editShow:false,
                parentId:"",
                curName:"",
                storeDialog:false,
            }
        },
        methods:{
            get_classify(id,name){
                if(!id&&!name)return;
                return `${id}>>${name}`
            },
            store_submit(nameList,currentName){
                if(nameList.length<=0)return this.$message({message:"尚未选择任何分类", type:'warning'});
                let length = nameList.length;
                this.storeDialog = false;
                if(this.curName==='first'){
                    this.classify.firstName = currentName;
                    this.classify.first = nameList[length-1].parent_id;
                }else{
                    this.classify.secondName = currentName;
                    this.classify.second = nameList[length-1].parent_id;
                }
            },
            choice_store(name){
                this.curName = name;
                this.storeDialog = true;
            },
            open(){
                this.clear();
            },
            clear(){
                this.classify = {
                    first:"",
                    second:"",
                    cron_time:"",
                    remark:"",
                };
                this.editShow = false;
                this.get_old_store();
                this.get_first_option();
            },
            get_first_option(){
                let options = {
                    parent_id: 0,
                    account:this.accountId,
                };
                this.$http(api_get_custom_category,options).then(res=>{
                    this.firstOptions = res.data;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code})
                })
            },
            get_old_store(){
                let data = this.selectIds.map(row => row.id);
                this.$http(api_dl_store_category,{ids:data}).then(res=>{
                    this.showDatas = res.data;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            get_category(){
                this.trees.forEach(row =>{
                    this.$http(api_custom_category_tree,row).then(res=>{
                        console.log(res,'res');
                        let arr = res.data.name.split("->");
                        this.showDatas.forEach(row =>{
                            this.$set(row, "stores",arr);
                        });
                    }).catch(code=>{
                        this.$message({
                            type:"error",
                            message:code.message || code
                        })
                    })
                })
            },
            //预览
            look_store(){
                if(this.classify.first===""){
                    this.$message({type:"warning",message:"请先选择第一分类"});
                    this.$reqKey('actionStore',false);
                    return  false;
                }
                this.editShow = true;
                return true
            },
            //保存
            keep(){
                let flag=this.look_store();
                if(this.classify.cron_time && this.classify.cron_time instanceof Object){
                    this.classify.cron_time = datef("YYYY-MM-dd HH:mm:ss",this.classify.cron_time/1000);
                }else if(!this.classify.cron_time){
                    this.classify.cron_time = "";
                }
                if(!flag)return;
                let list = [];
                if(this.ebayStatus==='model'){
                    list = this.showDatas.map(row=>{
                        return {
                            id:row.id,
                            store_category_id:this.classify.first,
                            store_category2_id:this.classify.second,
                        }
                    })
                }else{
                    list = this.showDatas.map(row=>{
                        let old_val = {
                            store_category_id:row.store_category_id,
                            store_category2_id:row.store_category2_id,
                        };
                        let new_val = {
                            store_category_id:this.classify.first,
                            store_category2_id:this.classify.second,
                        };
                        return {
                            item_id:row.item_id,
                            listing_sku:row.listing_sku,
                            account_id:row.account_id,
                            site:row.site,
                            remark:this.classify.remark,
                            cron_time:this.classify.cron_time,
                            new_val:new_val,
                            old_val:old_val,
                        }
                    });
                }
                let url = this.ebayStatus==='model'?api_draft_store_category:api_edit_ebay_shop_category;
                this.$http(url,{data:list}).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.show=false;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                }).finally(()=>{
                    this.$reqKey('actionStore',false);
                });

            },
            close(){
                this.show=false;
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            },
//            "classify.first"(value){  取消调取关联
//                this.get_second_option(value);
//            }
        },
        props:{
            value:{
                required:true,
            },
            selectIds:{
            },
            accountId:{
                required:true,
            },
            ebayStatus:{
                required:true,
                type:String,
            }
        },
        components:{
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            storeDialog:require('../add-edit-listing/store-dialog.vue').default,
            labelItem:require('@/components/label-item.vue').default,
        }
    }
</script>

