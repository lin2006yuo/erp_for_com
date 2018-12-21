<template>
    <div class="c-category-dialog">
        <page-dialog v-model="dialog" @open="open" title="选择平台产品分类" size="large" :close-on-click-modal="false">
            <el-row>
                <el-col :span="24">
                    <label>搜索：</label>
                    <el-input v-model="curInput" class="inline width-super" @keyup.enter.native="search" placeholder="请输入分类号或分类名称..."></el-input>
                    <el-button type="primary" size="mini" class="inline ml-lg" @click.native="search">搜索</el-button>
                    <el-button size="mini" class="inline ml-lg" @click.native="clear_search">清空搜索</el-button>
                </el-col>
            </el-row>
            <div class="confirm-box" v-if="currentName&&whichHandle===1">
                <span>当前分类：您已选择分类【&nbsp;{{currentName}}&nbsp;】，请点击【确定】继续！</span><br />
            </div>
            <div :class="['ml-mini',currentName&&whichHandle===1?'':'mt-sm']">
                <!--选择分类-->
                <category-box
                        v-show="!comChannel&&whichHandle===1"
                        :data="categorysList"
                        :site="site"
                        :request="[]"
                        @last="last"
                        :channel="channel"
                        which-one="category"
                ></category-box>
                <trees ref="trees"
                       v-show="comChannel&&whichHandle===1"
                       :treeData="categorysList" class="tree" @last="last"
                       @change-btn="change_btn"  :request="[]"></trees>
            </div>
            <!--搜索分类-->
            <div v-show="whichHandle===0" class="ml-lg" style="position: relative;">
                <img src="../../../assets/return.png" @click="return_back" class="return-btn">
                <el-table
                    max-height="500"
                    class="scroll-bar mt-sm"
                    :data="dataTable.list"
                    v-loading="loading"
                    element-loading-text="玩命加载中..."
                    @row-click="change_checkbox"
                    highlight-current-row
                >
                    <el-table-column inline-template width="35px">
                        <el-checkbox v-model="row.isCheck"></el-checkbox>
                    </el-table-column>
                    <el-table-column label="分类号" prop="category_id" width="120"></el-table-column>
                    <el-table-column label="名称" align="left" inline-template>
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
                <el-button type="primary" size="mini" class="inline" v-if="channel!=='aliexpress'" @click.native="submit">确定</el-button>
                <el-button type="primary" size="mini" class="inline" @click.native="submit" :disabled="subDis" v-else>确定</el-button>
                <el-button size="mini" class="inline" @click.native="dialog = false">取消</el-button>
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
    import {api_aliexpress_classify,api_aliexpress_categories} from "../../../api/publish-smt"
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
            	if(!val){
                    this.subDis = false;
                }else{
            		this.subDis = true;
                }
            }
        },
        methods:{
            open(){
                let id = 0;
                this.nameList = [];
                this.get_categorys(id);
            },
            change_btn(val){
            	this.subDis = val;
            },
            return_back(){
                this.whichHandle = 1;
            },
            search(){
            	this.whichHandle = 0;
                this.init();
            },
            clear_search(){
                this.curInput="";
                this.init();
            },
            change_checkbox(row){
            	row.isCheck = !row.isCheck;
                if(!row.isCheck) return ;
                this.dataTable.list.forEach(res=>{
                    res.isCheck = false;
                })
                row.isCheck = true;
                this.curRow = row;
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
                    this.dataTable.list = res.data;
                    this.dataTable.count = res.count;
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
                    if(!this.nameList||this.nameList.length<=0)return this.$message({type:'warning',message:'尚未选择任何分类！'});
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
                    this.$http(api_aliexpress_classify).then(res=>{
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
            trees:require('../aliexpress/info/trees.vue').default
        }
    }
</script>
