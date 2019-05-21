<template>
    <div class="c-category-dialog">
        <page-dialog v-model="dialog" @open="open" :title="$t('ymx-detail.classPro')" size="large" :close-on-click-modal="false">
            <el-row>
                <el-col :span="24">
                    <label>{{$t('ymx-detail.search')}}：</label>
                    <el-input v-model="curInput" class="inline width-super"   @keydown.enter.native="search"  :placeholder="$t('ymx-detail.cateName')"></el-input>
                    <el-button type="primary" size="mini" class="inline ml-lg"
                               :disabled="curInput?false:true"
                               @click.native="search">{{$t('ymx-detail.search')}}</el-button>
                    <el-button size="mini" class="inline ml-lg" @click.native="clear_search">{{$t('ymx-detail.clear')}}</el-button>
                    <!--同步分类属性 目前仅速卖通平台存在 -->
                    <request-button v-if="channel==='aliexpress'"
                               size="mini"
                               class="inline ml-lg"
                               :disabled="subDis"
                               req-key="api_sync_category_attr"
                               @click="synchronizeAttr">同步分类属性</request-button>
                </el-col>
            </el-row>
            <div class="confirm-box" v-if="currentName&&whichHandle===1">
                <span>{{$t('ymx-detail.curcate')}} {{$t('ymx-detail.youcur')}}【&nbsp;{{currentName}}&nbsp;】，{{$t('ymx-detail.clickok')}}</span><br />
            </div>

            <div :class="['ml-mini',currentName&&whichHandle===1?'':'mt-sm']">
                <!--选择分类-->
                <category-box
                        v-show="!comChannel&&whichHandle===1"
                        :data="categorysList"
                        :site="site"
                        :request="[]"
                        @last="last"
                        @change-btn="change_btn_box"
                        :channel="channel"
                        which-one="category">
                </category-box>
                <trees ref="trees"
                       v-show="comChannel&&whichHandle===1"
                       :treeData="categorysList"
                       class="tree"
                       :accountId="accountId"
                       @last="last"
                       @change-btn="change_btn"
                       :request="[]">
                </trees>
            </div>
            <!--搜索分类-->
            <div v-show="whichHandle===0" class="ml-lg" style="position: relative;">
                <img src="../../../assets/return.png" @click="return_back" class="return-btn">
                <el-table
                    max-height="500"
                    class="scroll-bar mt-sm"
                    :data="dataTable.list"
                    v-loading="loading"
                    :element-loading-text="$t('common.playLoad')"
                    @cell-click="change_checkbox"
                    highlight-current-row>
                    <!--<el-table-column inline-template width="35px" >
                        <el-checkbox v-model="row.isCheck""></el-checkbox>
                    </el-table-column>-->
                    <el-table-column  width="35px" >
                        <template slot-scope="scope">
                            <el-checkbox v-model="scope.row.isCheck"></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('ymx-detail.categorycode')" prop="category_id" width="120"></el-table-column>
                    <el-table-column :label="$t('ymx-detail.name')" align="left" inline-template>
                        <span v-if="channel==='aliexpress'">{{row.category_name_zh}}</span>
                        <span v-else-if="channel === 'amazon'">{{row.category_path_name}}</span>
                        <span v-else>{{row.category_name}}</span>
                    </el-table-column>
                </el-table>
                <el-pagination
                        class="fr"
                        @size-change="size_change"
                        @current-change="page_change"
                        :current-page="dataTable.page"
                        :page-size="dataTable.pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="dataTable.count">
                </el-pagination>
            </div>
            <div slot="footer">
                <el-button type="primary" size="mini" class="inline" v-if="channel!=='aliexpress'" @click.native="submit">{{$t('ymx-detail.confirm')}}</el-button>
                <el-button type="primary" size="mini" class="inline" @click.native="submit" :disabled="subDis" v-else>{{$t('ymx-detail.confirm')}}</el-button>
                <el-button size="mini" class="inline" @click.native="dialog = false">{{$t('common.cancel')}}</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .c-category-dialog {
        .confirm-box{
            box-sizing:border-box;
            margin:10px 10px;
            /*width:100%;*/
            padding:10px 15px;
            border: 1px solid #61A840;
            border-radius: 3px;
            color:#095210;
            background-color:#E9FDC1 ;
        }
        .return-btn{
            width:20px;
            height:20px;
            position: absolute;
            top:0;
            left:0;
            z-index:2;
            padding: 4px 7px;
            cursor: pointer;
        }
    }
</style>
<script>
    import {api_get_categorys,api_suggested_categories} from '../../../api/ebay-kandeng-public-module';
    import {api_aliexpress_classify,api_aliexpress_categories,api_sync_category_attr } from "../../../api/publish-smt"
    import {api_product_category, api_product_search} from '../../../api/amazon-publish-info';
    import {api_shopee_category} from '../../../api/shopee-publish';
    export default{
        data(){
            return {
                lastRow:'',
                dialog:this.value,
                categorysList:[],
                whichHandle:1,
                nameList:[],
                curInput:"",
                loading:false,
                dataTable:{
                    list:[],
                    count:0,
                    page:1,
                    pageSize:20
                },
                curRow:{},
                subDis:true,
            }
        },
        computed:{
            comChannel(){
                return this.channel==='aliexpress'
            },
            currentName(){
                if(this.nameList.length>0){
                    let length = this.nameList.length;
                    let lastObj = window.clone(this.nameList).splice(length-1,1);
                    let cur = this.nameList.map(row=>row.category_name||row.category_name_zh).join(">>");
                    return `${lastObj[0].category_id}-${cur}`;
                }else {
                    return ""
                }
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
            whichHandle(val){
            	// if(!val){
                //     this.subDis = false;
                // }else{
            	// 	this.subDis = true;
                // }
                switch(val){
                    case 0:
                        /*搜索分类*/
                        if(this.curRow.isCheck){
                            this.subDis = false;
                        }else{
                            this.subDis = true;
                        }
                        break;
                    case 1:
                        /*分类树分类*/
                        this.subDis = true;
                        break;
                }
            },
            "curRow":{
                deep:true,
                handler(val,oldVal){
                    if(val.isCheck){
                        this.$set(this,'subDis',false);
                    }else{
                        this.$set(this,"subDis",true);
                    }
                }
            }
        },
        methods:{
            // 同步分类属性
            synchronizeAttr(){
                switch(this.whichHandle){
                    case 0:
                        /*搜索分类*/
                        //console.log('this.curRow=====================',this.curRow);
                        if(!this.curRow.category_id){
                            this.$reqKey('api_sync_category_attr',false);
                            return this.$message({type:'warning',message:this.$t('ymx-detail.onplat')});
                        }
                        this.$http(api_sync_category_attr,this.curRow.category_id).then(res=>{
                            if(res.status){
                                this.$message({type:'success',message:res.message});
                                this.$emit("submit",this.curRow);
                            }
                        }).catch(error=>{
                            this.$message({type:"error",message:error.message||error})
                        }).finally(()=>{
                            // this.curRow = {};
                            setTimeout(()=>{
                                this.$reqKey('api_sync_category_attr',false);
                            },300)
                        });
                        break;
                    case 1:
                        /*分类树分类*/
                        if(this.nameList.length===0){
                            this.$reqKey('api_sync_category_attr',false);
                            return this.$message({type:'warning',message:this.$t('ymx-detail.onplat')});
                        }
                        let category_id = this.nameList[this.nameList.length-1].category_id;
                        this.$http(api_sync_category_attr,category_id).then(res=>{
                            if(res.status){
                                this.$message({type:'success',message:res.message});
                                this.$emit("submit",this.nameList,this.currentName,this.whichHandle);
                            }
                        }).catch(error=>{
                            this.$message({type:"error",message:error.message||error})
                        }).finally(()=>{
                            setTimeout(()=>{
                                this.$reqKey('api_sync_category_attr',false);
                            },300)
                        });
                        break;
                }
            },
            open(){
                let id = 0;
                this.nameList = [];
                this.get_categorys(id);
            },
            change_btn_box(){
                this.nameList = [];
            },
            change_btn(val){
                //console.log('change_btn=================',val);
            	this.subDis = val;      //
            },
            return_back(){
                this.whichHandle = 1;
            },
            search(){
            	this.whichHandle = 0;
                this.init();
            },
            clear_search(){
                this.curInput=''
                this.dataTable.list = [];
                this.dataTable.count = 0;
                this.subDis = true;
            },
            change_checkbox(row){
                this.curRow = row;
                if(row.isCheck){
                    this.$set(row,"isCheck",!row.isCheck);
                    this.subDis = false;    // 搜索分类勾选中状态 可点击
                }else{
                    this.dataTable.list.forEach(row=>{
                        this.$set(row,"isCheck",false);
                    });
                    this.$set(row,"isCheck",!row.isCheck);
                    this.subDis = true;
                }
            },
            init(){
                switch (this.channel){
                    case 'ebay':
                    	this.get_ebay();
                    	break;
                    case 'aliexpress':
                        this.get_aliexpress();
                        break;
                    case 'amazon':
                        this.get_amazon();
                        break;
                    case 'shopee':
                        this.get_shopee();
                }
            },
            get_shopee(){
                this.$http(api_shopee_category,{site:this.site,category_name:this.curInput}).then(res => {
                    console.log(res,'res');
                    this.dataTable.list = res.data;
                    this.dataTable.count = res.count;
                    this.dataTable.list.forEach(row=>{
                        this.$set(row,'isCheck',false);
                    });
                    this.loading = false;
                }).catch(code => {
                    console.log(code);
                })
            },
            get_ebay(){
                let params = {
                    site_id:this.site,
                    query:this.curInput,
                    account_id:this.accountId,
                    page:this.dataTable.page,
                    pageSize:this.dataTable.pageSize
                };
                this.loading = true;
                return this.$http(api_suggested_categories,params).then(res=>{
                    if(!!res.result){
                        this.dataTable.list = res.data;
                        this.dataTable.count = res.count;
                        this.dataTable.list.forEach(row=>{
                            this.$set(row,'isCheck',false);
                        });
                    }
                    this.loading = false;
                    return Promise.resolve();
                }).catch(code=>{
                    this.loading = false;
                    this.$message({type:"error", message: code.message || code});
                })
            },
            get_aliexpress(){
                let params = {
                    keywords:this.curInput,
                    page:this.dataTable.page,
                    pageSize:this.dataTable.pageSize,
                };
                this.loading = true;
                return this.$http(api_aliexpress_categories,params).then(res=>{
                    this.dataTable.list = res.data;
                    this.dataTable.count = res.total;
                    this.dataTable.list.forEach(row=>{
                        this.$set(row,'isCheck',false);
                    });
                    this.loading = false;
                    return Promise.resolve();
                }).catch(code=>{
                    this.loading = false;
                    this.$message({type:"error", message: code.message || code});
                })
            },
            get_amazon(){
                let params = {
                    keywords:this.curInput,
                    page:this.dataTable.page,
                    pageSize:this.dataTable.pageSize,
                    site: this.site
                };
                this.loading = true;
                return this.$http(api_product_search,params).then(res=>{
                    this.dataTable.list = res.data;
                    this.dataTable.count = res.total;
                    this.dataTable.list.forEach(row=>{
                        this.$set(row,'isCheck',false);
                    });
                    this.loading = false;
                    return Promise.resolve();
                }).catch(code=>{
                    this.loading = false;
                    this.$message({type:"error", message: code.message || code});
                })
            },
            size_change(size){
                this.dataTable.pageSize = size;
                this.init();
            },
            page_change(page){
                this.dataTable.page = page;
                this.init();
            },
            submit(){
                if(this.whichHandle===0){
                	switch (this.channel){
                        case 'ebay':
                            this.$emit("submit",this.curRow.category_name,this.curRow.category_id,this.curRow.item_compatibility_enabled,this.whichHandle,this.curRow.variations_enabled);
                        	break;
                        case 'aliexpress':
                            this.$emit("submit",this.curRow);
                            break;
                        case 'amazon':
                            this.$emit("submit", this.curRow);
                            break;
                        case 'shopee':
                            this.$emit('submit',this.curRow);
                            break;
                        default:
                            this.$emit("submit",this.curRow.category_name,this.curRow.category_id,this.whichHandle);
                            break;
                    }
                }else{
                    if(!this.nameList||this.nameList.length<=0)return this.$message({type:'warning',message:this.$t('ymx-detail.onplat')});
                    switch (this.channel){
                        case 'amazon':
                            this.$emit("submit",this.nameList,this.lastRow);
                            break;
                        default:
                            this.$emit("submit",this.nameList,this.currentName,this.whichHandle);
                    }
                }
            },
            last(val,val2){
                if(!!val2){
                    this.lastRow = val2;//主要用于亚马逊刊登，需要最后一个分类里面所带的属性
                }
                this.nameList = val;
            },
            /*商品类目   API*/
            get_categorys(category_id){
            	if(this.channel==='ebay'){
                    let params = {
                        category_id:category_id,
                        site:this.site,
                    }
                    this.$http(api_get_categorys,params).then(res=>{
                        res.data.forEach((row)=>{
                            this.$set(row,"show",false);
                        });
                        this.categorysList = res.data;
                    }).catch(code=>{
                       this.$message({type:"error", message: code.message || code});
                    })
                }else if(this.channel==='aliexpress'){
                    this.$http(api_aliexpress_classify,{account_id:this.accountId}).then(res=>{
                        res.forEach((row)=>{
                            this.$set(row,"show",false);
                        });
                        this.categorysList=res;
                    }).catch(code=>{
                        this.$message({type:"error", message: code.message || code});
                    })
                }else if(this.channel === 'amazon'){
                    let params = {
                        site: this.site,
                        category_id:0
                    };
                    this.$http(api_product_category, params).then(res=>{
                        res.forEach(row=>{
                            this.$set(row, 'show', false);
                            this.$set(row, 'category_name', row.en_name);
                        });
                        this.categorysList=res;
                    }).catch(code=>{
                        this.$message({type:"error", message: code.message || code});
                    })
                }else if(this.channel === 'shopee'){
                    this.$http(api_shopee_category,{category_id:0,site:this.site}).then(res => {
                        res.forEach(row=>{
                            this.$set(row, 'show', false);
                        });
                        this.categorysList = res;
                    }).catch(code => {
                        console.log(code);
                    })
                }
            }
        },
        props:{
            value:{},
            site:{required:true},
            channel:{
            	default(){
            		return 'ebay'
                }
            },
            /*ebay平台账号ID*/
            accountId:{}
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            categoryBox:require('./category-box.vue').default,
            trees:require('../aliexpress/info/trees.vue').default,
            requestButton:require('../../../global-components/request-button').default
        }
    }
</script>
