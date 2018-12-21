<template>
    <page class="p-publish-collect">
        <order-input v-model="url"
                     class="inline width-full mb-xs"
                     :is-input="isInput"
                     @keydown="begin_collect"
                     placeholder="请填写产品网址，多个网址用回车键换行；仅支持采集：速卖通网站。"></order-input>
        <request-button :mintime="200" req-key="begin_collect" class="ml-sm" :request="begin_collect" :disabled="canCollect">开始采集</request-button>
        <el-button size="mini" @click="clear">清空</el-button>
        <search-card class="mt-sm mb-sm collect-search" @search="search" @enter="search" :params="searchData" :clears="clears">
            <label-item label="产品ID：">
                <el-input placeholder="请输入搜索内容..." v-sf.product_id v-model="searchData.product_id"
                          class="inline mb-mini mr-sm" style="width:145px"></el-input>
            </label-item>
            <label-item label="认领状态：">
                <el-select v-sf.claim_channel v-model="searchData.claim_channel" class="inline mb-mini mr-sm" style="width:150px">
                    <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="采集者：">
                <el-select v-sf.uid v-model="searchData.uid" class="inline mb-mini mr-sm s-width-small">
                    <el-option v-for="item in userList" :key="item.id" :label="item.realname" :value="item.id"></el-option>
                </el-select>
            </label-item>
            <div class="collect-btn">
                <permission tag="ElButton" :route="apis.url_publish_collect_delete" size="mini" @click="batch_del">删除</permission>
            </div>
        </search-card>
        <el-table
            v-resize="{height:38}"
            class="scroll-bar"
            :data="tableData"
            border
            style="width:100%"
            highlight-current-row
            @selection-change="select_all"
            v-loading="isLoading"
            element-loading-text="玩命加载中...">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
                <el-table-column type="selection" width="30"></el-table-column>
                <el-table-column label="图片" min-width="65" inline-template>
                    <el-popover placement="right" trigger="hover">
                        <img v-lazy="row.images&&row.images[0]" width="200px" height="200px">
                        <span slot="reference">
                          <img v-lazy="row.images&&row.images[0]" height="60px" width="60px" style="border:none">
                        </span>
                    </el-popover>
                </el-table-column>
                <el-table-column inline-template label="产品ID">
                    <ui-tip :content="row.product_id" :width="98"></ui-tip>
                </el-table-column>
                <el-table-column inline-template label="本地SPU">
                    <span @click="bind_spu(row)" class="operate" v-if="row.goods_id===0">
                         <i class="el-icon-information" style="position: absolute;left: 5px" title="点击关联"></i>
                        <ui-tip :content="row.spu||'未关联'"  style="padding-left: 12px"></ui-tip>
                    </span>
                    <ui-tip :content="row.spu" v-else></ui-tip>
                </el-table-column>
                <el-table-column inline-template min-width="300" label="标题">
                    <ui-tip :content="row.title" :width="98"></ui-tip>
                </el-table-column>
                <el-table-column inline-template label="价格">
                    <div>$ {{row.max_price}}</div>
                </el-table-column>
                <el-table-column inline-template label="来源">
                    <ui-tip :is-operate="true" :content="row.link" :width="98"
                             @cur-click="cur_click(row.link)"></ui-tip>
                </el-table-column>
                <el-table-column inline-template label="已认领平台">
                    <div>
                        <span v-for="(item,index) in row.claim_channel" :key="index">
                            <el-tag>{{filter_channel(item)}}</el-tag>
                        </span>
                    </div>
                </el-table-column>
                <el-table-column inline-template label="采集者">
                    <ui-tip :content="row.realname" :width="98"></ui-tip>
                </el-table-column>
                <el-table-column inline-template label="采集时间">
                    <div>{{row.create_time | fdatetime}}</div>
                </el-table-column>
                <el-table-column inline-template label="操作">
                    <div>
                        <permission tag="span" :route="apis.url_publish_collect_claim" class="operate" @click="curCollect(row)">认领</permission>
                        <permission tag="span" :route="apis.url_publish_collect_claim">|</permission>
                        <permission tag="span" :route="apis.url_publish_collect_delete" class="operate" @click="curDelete(row)">删除</permission>
                    </div>
                </el-table-column>
        </el-table>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagetation.page"
            :page-sizes="[20, 50, 100, 200]"
            :page-size="pagetation.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagetation.total">
        </el-pagination>
        <add-goods v-model="addlistVisable" @selected="selecteds"></add-goods>
        <add-collect v-model="addCollectVisable" :accounts="accounts" :select-data="selectData"></add-collect>
    </page>
</template>
<style lang="stylus">
    .p-publish-collect{
        .width-full{
            width:100%;
            height: 105px;
        }
        .collect-search{
            position: relative;
            .collect-btn{
                position : absolute;
                right:5px;
                top:10px;
            }
        }

    }
</style>
<script>
    import {
    	api_publish_collect_list,
        api_publish_collect_add,
        api_publish_collect_bind,
        api_publish_collect_delete,
        api_aliexpress_users,
        url_publish_collect_claim,
        url_publish_collect_bind,
        url_publish_collect_delete
    } from '../../../../api/publish-collect'
    import {api_add_goods} from "../../../../api/supplier-quote"
    import {
        api_express_get_accounts
    } from "../../../../api/publish-smt"
	export default{
        permission:{
            url_publish_collect_claim,
            url_publish_collect_bind,
            url_publish_collect_delete
        },
		data(){
			return {
			    firstLoading: true,
                url:'',
                searchData:{
                    product_id:"",
                    claim_channel:"",
                    uid:""
                },
                clears:{
                },
                statusList:[
                    {'label':'全部','value':''},
                    {'label':'未认领','value':0},
                    {'label':'认领到速卖通','value':1},
//                    {'label':'认领到wish','value':3},
//                    {'label':'认领到ebay','value':1},
                ],
                pagetation:{
                	page:1,
                    pageSize:20,
                    total:0
                },
                isInput:false,
                userList:[],
                tableData:[],
                isLoading:false,
                img:[],
                addlistVisable:false,
                addCollectVisable:false,
                localSku:{
                    data:[]
                },
                channelSku:[],
                listingId:0,
                accounts:[],
                selectData:{},
                selectIds:[],
                isDis:false,
            }
		},
        mounted(){
			this.init();
            this.get_account();
            this.get_users();
        },
        methods:{
			init(){
			    this.isLoading = true;
				let data = {
                    product_id:this.searchData.product_id,
                    claim_channel:this.searchData.claim_channel,
                    uid:this.searchData.uid,
                    page:this.pagetation.page,
                    pageSize:this.pagetation.pageSize,
                };
                this.$http(api_publish_collect_list,data).then(res=>{
                    res.data.forEach(row=>{
                    	row.images = row.images ? JSON.parse(row.images) : [];
                    	row.claim_channel = JSON.parse(row.claim_channel);
                    });
                    this.tableData = res.data;
                    this.pagetation.total = res.total;
                    this.isLoading = false;
                    this.firstLoading = false
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                });
            },
            cur_click(data){ //连接跳转
                window.open(data);
            },
            get_users(){
                this.$http(api_aliexpress_users).then(res=>{
                    this.userList = res;
                }).catch(code=>{
//                    this.$message({message:code.message||code,type:'error'})
                });
            },
            select_all(val){
				this.selectIds = val;
            },
            //获取速卖通的销售员
            get_account(){
                return this.$http(api_express_get_accounts).then(res => {
                    this.accounts = res;
                }).catch(code => {
                    this.$message({type:"error", message: code.message || code});
                });
            },
            update(){},
            //开始采集
            begin_collect(){
                let cur = this.url.split('\n').filter(row=>!!row);
                let snText = '';
                if(cur&&cur.length>1){
                    let arr = cur.map(row=>{
                        return row.trim();
                    });
                    let newArr = []
                    arr.forEach(row=>{
                    	if(row.includes('?')){
                            newArr.push(row.split('?')[0]);
                        }else{
                            newArr.push(row);
                        }
                    })
                    snText = newArr.join(';');
                }else if(cur&&cur.length===1){
                    snText = this.url;
                }
                this.isDis = true;
                return this.$http(api_publish_collect_add,{url:snText}).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.isDis = false;
                    this.init();
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                    this.isDis = false;
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('begin_collect',false);
                    },200);
                });
            },
            //认领
            curCollect(item){
                if(!item.goods_id){
                    this.$message({type:"warning",message:"请先关联产品！"});
                    return ;
                }
                this.addCollectVisable = true;
                this.selectData = window.clone(item);
            },
            bind_spu(data){
                this.addlistVisable=true;
                this.listingId = data.id;
            },
            //绑定spu
            selecteds(val){
            	let goods_id = 0;
            	let spu = "";
            	val.forEach(row=>{
            		goods_id = row.id;
                    spu = row.spu;
            	});
                let data = {
                	id:this.listingId,
                    goods_id:goods_id,
                }
                this.$http(api_publish_collect_bind,data).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    let find = this.tableData.find(row=>{return this.listingId===row.id});
                    if(find){
                        find.spu = spu;
                        find.goods_id= goods_id;
                    }
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                });
            },
            //单个删除
            curDelete(item){
                this.$confirm(`确认删除此条数据吗`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.operate_del(item.id,item);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //批量删除
            batch_del(){
                if(!this.selectIds.length){
                    this.$message({type:"warning",message:"请选择要删除的数据！"});
                    return ;
                }
                this.$confirm(`确认删除勾选数据吗`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.operate_del(this.selectIds.map(x=>{return x.id}).join(","),this.selectIds);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            operate_del(ids,datas){
                this.$http(api_publish_collect_delete,{id:ids}).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res
                    });
                    if(datas instanceof Array){
                        datas.forEach(row=>{
                            let index=this.tableData.indexOfFun(row,function (old,row) {
                                return old.id===row.id;
                            });
                            this.tableData.splice(index,1);
                            this.pagetation.total-=1;
                        })
                    } else if(datas instanceof Object){
                        let i = this.tableData.indexOfFun(datas,function (old,datas) {
                            return old.id===datas.id;
                        });
                        this.tableData.splice(i,1);
                        this.pagetation.total-=1;
                    }
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                })
            },
            batch_collect(){
            },

            clear(){
                this.url = '';
            },
            search(){
                this.init();
            },
            handleSizeChange(val){
                this.pagetation.pageSize=val;
                this.init();
            },
            handleCurrentChange(val){
                this.pagetation.page=val;
                this.init();
            },
            filter_channel(data){
            	switch (data){
                    case 'aliExpress':
                    	return '速卖通';
                    	break;
                    case 'wish':
                        return 'wish';
                        break;
                    case 'ebay':
                        return 'ebay';
                        break;
                    default:
                    	break;
                }
            },
        },
        computed:{
            canCollect(){
                return this.url&&!this.isDis ? false : true;
            },
            emptyText(){
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            }
        },
        filters:{
            fdatetime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val)
            }
        },
        props:{

        },
		components: {
            orderInput:require("../../../../components/order-input.vue").default,
            labelItem:require("../../../../components/label-item.vue").default,
            searchCard:require('../../../../components/search-card.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
            trendsSelect:require('../../../../components/trends-select.vue').default,
            addGoods:require('../../wish/info/add-goods.vue').default,
            addCollect:require('./add-collect.vue').default,
        }
	}
</script>
