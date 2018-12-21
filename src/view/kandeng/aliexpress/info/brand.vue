<template>
    <div class="alipress-p-brand">
        <page-dialog v-model="show" title="品牌 - 平台分类 - 账号的绑定管理" @change="change_dialog" size="large" :close-on-click-modal="false">
            <el-row class="mb-sm">
                <el-input v-model="snText" class="inline mr-sm" placeholder="请输入品牌"></el-input>
                <el-radio v-model="radioSwitch" label="1">搜索分类</el-radio>
                <el-radio v-model="radioSwitch" label="2">搜索品牌</el-radio>
                <el-button type="primary" class="inline ml-lg" size="mini" :disabled="disSearch" @click.native="search">搜索</el-button>
                <el-button class="inline ml-lg" size="mini" @click.native="clear_search">清空搜索</el-button>
                <el-button size="mini" class="inline" @click="update_brand" >获取最新品牌</el-button>
            </el-row>
            <div v-show="radioSwitch==='1'">
                <ui-table ref="table" class="mt-sm"
                          v-loading="loading"  element-loading-text="玩命加载中..." :body-height="75"
                          :has-data="categoryTable.length>0" v-model="cateAll" @check="head_check"
                          :heads="[
                        {isCheck:true,width:3},
                        {label:'分类号',width:17},
                        {label:'名称',width:80}
                       ]">
                    <tbody>
                    <tr v-for="(item,index) in categoryTable" :key="index" @click="row_checked(item)">
                        <td><el-checkbox v-model="item.checked"></el-checkbox></td>
                        <td>{{item.category_id}}</td>
                        <td style="text-align: left;padding-left: 10px;">{{item.category_name_zh}}</td>
                    </tr>
                    </tbody>
                </ui-table>
                <span>({{cateCount}}/{{categoryTable.length}})</span>
                <el-checkbox v-model="isShowChecked" @change="showChecked" >只显示已勾选</el-checkbox>
                <choose-brand v-model="brandShow" :brands="brandsArr" @choose-brand="choose_brand"></choose-brand>
            </div>
            <div v-show="radioSwitch==='2'">
                <ul class="list" v-loading="loading"  element-loading-text="玩命加载中...">
                    <li class="spc">
                        <input v-model="brandAll" type="checkbox"/>请选择常用品牌
                    </li>
                    <li v-for="item in filterBrands"  >
                        <input v-model="item.checked" type="checkbox"/>{{item.name_zh}}({{item.name_en}})
                    </li>
                </ul>
                <span>({{countBrand}}/{{filterBrands.length}})</span>
                <el-checkbox v-model="isShowCheckedBrand" @change="showCheckedBrand">只显示已勾选</el-checkbox>
            </div>
            <div slot="footer" >
                <el-button type="primary" @click="submit" size="mini">确定绑定</el-button>
                <el-button @click.native="show=false" size="mini">取 消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .alipress-p-brand{
        .el-table .cell{
            text-align left;
        }
        .list{
            border: 1px solid #ccc;
            border-radius: 4px;
            max-height: 350px;
            overflow-y: auto;
            min-height:200px;
            li{
                line-height: 22px;
                padding: 2px 5px;
            }
            .spc{
                border-bottom: 1px solid #ccc;
            }
        }
        .p-brand-table{
            border-collapse:collapse;
            max-height: 350px;
            overflow-y: auto;
            min-height:200px;
            width:100%;
            td{
                padding:4px 5px;
                border:1px solid #ccc;
                &.first{
                    width:35px;
                    padding:4px 0;
                    text-align:center;
                }
            }
        }
    }
</style>
<script>
    import {api_ali_brand,api_ali_brand_set,api_ali_brand_new,api_aliexpress_categories_brand} from  "../../../../api/publish-smt"
    export default{
        data(){
            return {
                show:false,
                loading:true,
                snText:"",
                radioSwitch:"1",
                category:[],
                cateBrandId:0,
                categoryTable:[],
                isShowChecked:false,
                isShowCheckedArr:[],
                selectCateArr:[],
                brands:[],
                filterBrands:[],
                isShowCheckedBrand:false,
                isShowCheckedBrandArr:[],
                cateAll:false,
                flag:0,
                brandShow:false,
                brandsArr:[]
            }
        },
        computed: {
            disSearch(){
            	if(this.snText===''){
            		return true;
                }
                return false;
            },
            brandAll:{
                get(){
                    let find=this.filterBrands.find(row=>!row.checked)
                    return !find;
                },
                set(val){
                    this.filterBrands.forEach(row=>{
                        row.checked=val;
                    })
                }
            },
            cateCount(){
                let i=0;
                this.categoryTable.forEach(item=>{
                    if(item.checked){
                        i++;
                    }
                });
                return i;
            },
            count(){
                let i=0;
                this.selectCateArr.forEach(item=>{
                    if(item.checked){
                        i++;
                    }
                });
                return i;
            },
            countBrand(){
                let i=0;
                this.filterBrands.forEach(item=>{
                    if(item.checked){
                        i++;
                    }
                });
                return i;
            },
        },
        methods: {
            row_checked(row){
                row.checked = !row.checked;
                let find=this.categoryTable.find(item=>!item.checked);
                this.cateAll = !find;
            },
            head_check(val){
                this.categoryTable.forEach(row=>{
                    row.checked=val;
                });
            },
            //只显示勾选
            showChecked(){
                if(this.isShowChecked){
                    this.isShowCheckedArr = window.clone(this.categoryTable);
                    this.categoryTable = this.isShowCheckedArr.filter(item=>{
                        return item.checked===true;
                    })
                }else {
                    this.categoryTable = this.isShowCheckedArr;
                }
            },
            //
            showCheckedBrand(){
                if(this.isShowCheckedBrand){
                    this.isShowCheckedBrandArr = window.clone(this.filterBrands);
                    this.filterBrands = this.isShowCheckedBrandArr.filter(item=>{
                        return item.checked===true;
                    })
                }else {
                    this.filterBrands = this.isShowCheckedBrandArr;
                }
            },
            submit(){
                let category = this.categoryTable.filter(row=>row.checked);
                let brand=this.filterBrands.filter(row=>row.checked);
                switch (this.radioSwitch){
                    case '1':
                        if(category&&category.length>0){
                            let data ={
                                account_id:this.accountId,
                                category_id:category.map(row=>row.category_id).join(","),
                                brands:this.cateBrandId,
                                is_delete:0
                            };
                            let find = category.find(row=>{
                                return row.category_id===this.categoryId;
                            });
                            let arr =[];
                            if(!!find){
                                arr.push({id:this.cateBrandId,name_zh:this.snText.trim()});
                                this.flag=0;
                            }
                            this.ajax_submit(data,arr,this.flag);
                        }else {
                            this.$message({type: "warning", message:'请选择品牌'})
                        }
                        break;
                    case '2':
                        if(brand&&brand.length>0){
                            let brand_ids=brand.map(row=>row.id).join(",");
                            let data={account_id:this.accountId,category_id:this.categoryId,brands:brand_ids,is_delete:1};
                            this.flag=1;
                            this.ajax_submit(data,brand,this.flag);
                        }else {
                            this.$message({type: "warning", message:'请选择品牌'})
                        }
                        break;
                    default:
                        break;
                }
            },
            ajax_submit(data,arr,flag){
                this.$http(api_ali_brand_set,data).then(res=>{
                    this.$message({type: "success", message: res.message || res})
                    this.$emit("brand",arr,flag);
                    this.show=false;
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                })
            },
            search(){
                switch (this.radioSwitch){
                    case '1':
                        this.get_catecory();
                        break;
                    case '2':
                        let oldBrand = this.brands.filter(row=>row.checked);
                        this.filterBrands=this.brands.filter(row=>{
                            if(this.snText===""){
                                return true
                            }else {
                                let find=oldBrand.find(it=>{
                                    return it.id===row.id;
                                });
                                if(find) return false;
                                if(row.name_zh.toLocaleLowerCase().indexOf(this.snText.toLocaleLowerCase())!==-1||row.name_en.toLocaleLowerCase().indexOf(this.snText.toLocaleLowerCase())!==-1){
                                    return true
                                }else{
                                    return false;
                                }
                            }
                        });
                        this.filterBrands.push(...oldBrand);
                        break;
                    default:
                        break;
                }
            },
            clear_search(){
                this.snText="";
            },
            choose_brand(id){
                this.loading=true;
                let data={
                    account_id:this.accountId,
                    keywords:this.snText.trim(),
                    brand_id:id,
                }
                this.$http(api_aliexpress_categories_brand,data).then(res=>{
                    this.loading=false;
                    this.categoryTable=res.data;
                    this.categoryTable.forEach(row=>{
                        this.$set(row,'checked',true);
                    });
                    let find=this.categoryTable.find(item=>!item.checked);
                    this.cateAll = !find;
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                    setTimeout(()=>{
                        this.loading=false;
                    },300)
                })
            },
            get_catecory(){
                this.loading=true;
                let data={
                    account_id:this.accountId,
                    keywords:this.snText.trim(),
                }
                this.$http(api_aliexpress_categories_brand,data).then(res=>{
                	if(res.multi_brand===1){
                        this.brandShow = true;
                        res.brands.forEach(row=>{
                        	this.$set(row,"isCheck",false);
                        });
                        this.brandsArr = res.brands;
                    }else{
                        this.categoryTable=res.data;
                        this.categoryTable.forEach(row=>{
                            this.$set(row,'checked',true);
                        });
                        let find=this.categoryTable.find(item=>!item.checked);
                        this.cateAll = !find;
                    }
                    this.loading=false;
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                    setTimeout(()=>{
                        this.loading=false;
                    },300)
                })
            },
            operate_cate(data){

            },
            get_brand(){
                this.loading=true
                this.$http(api_ali_brand,{account_id:this.accountId,category_id:this.categoryId}).then(res=>{
                    this.loading=false;
                    this.brands=res;
                    this.filterBrands=res;
                }).catch(code=>{
                    console.log(code.message||code);
                })
            },
            // 更新品牌
            update_brand(){
                return this.$http(api_ali_brand_new,{account_id:this.accountId,category_id:this.categoryId}).then(res=>{
                    if(res.success){
                        this.get_brand()
                    }else {
                        this.$message({type: "success", message:"已是最新的数据"})
                    }
                    return Promise.resolve();
                }).catch(code=>{
                    console.log(code.message||code);
                })
            },
            change_dialog(val){
                if(val){
                    this.get_brand();
                }else {
                    this.radioSwitch = '1';
                    this.categoryTable=[];
                    this.filterBrands=[];
                    this.snText="";
                    this.isShowChecked = false;
                    this.isShowCheckedArr=[];
                    this.selectCateArr = [];
                    this.isShowCheckedBrand = false;
                    this.isShowCheckedBrandArr=[];
                    this.brands= [];
                    this.cateBrandId = 0;
                }
            }
        },
        filters: {},
        watch: {
            value(val){
                this.show=val;
            },
            show(val){
                this.$emit('input',val)
                if(!!val){

                }
            },
            isShowChecked(val){

            }
        },
        props: {
            value:{},
            accountId:{},
            categoryId:{
            }

        },
        components: {
            pageDialog:require("../../../../components/page-dialog.vue").default,
            uiTable:require("../../../../components/ui-table.vue").default,
            chooseBrand:require("./choose-brand.vue").default,
        }
    }
</script>
