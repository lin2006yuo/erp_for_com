<template>
    <page class="p-index-classify">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <label-item label="分组名称：">
                <el-input v-sf.name v-model="searchData.name" class="inline width-super enter-result"></el-input>
            </label-item>
            <label-item class="ml-sm">
                <el-select slot="label" class="s-width-small" v-sf.snType v-model="searchData.snType" @change="change_sntype">
                    <el-option v-for="type in types"
                               :label="type.label"
                               :value="type.value"
                               :key="type.value">
                    </el-option>
                </el-select>
                <el-select v-model="searchData.snText"
                           class="ml-xs mr-sm s-width-default"
                           v-sf.snText
                           v-if="searchData.snType==='category'"
                           filterable clearable
                           placeholder="请选择所属类别">
                    <el-option
                            v-for="item in categories"
                            :label="item.label"
                            :key="item.value"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="searchData.snText"
                           class="mr-sm width-super"
                           v-sf.snText
                           v-else filterable clearable
                           placeholder="请选择开发员">
                    <el-option
                            v-for="item in developer"
                            :label="item.label"
                            :key="item.value"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <!--<el-button class="inline ml-sm" size="mini" @click.native="search" type="primary">搜索</el-button>-->
            <!--<el-button class="inline" size="mini" @click.native="clear">清空搜索</el-button>-->
        </search-card>
        <data-table :tableData="tableData" :first-loading="firstLoading" :loading="loading" @change-del="change_del" @change-add="change_add">
        </data-table>
        <div >
            <el-pagination
                    class="page-fixed"
                    @size-change="size_change"
                    @current-change="current_change"
                    :current-page="searchData.page"
                    :page-sizes="[20, 50, 100, 200,500]"
                    :page-size="searchData.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>


    </page>
</template>
<style lang="stylus">
    .p-index-classify{

    }
</style>
<script>
    import  {api_product_list,api_product_person,api_product_category} from "../../../api/product-class"
    export default{
        page:{},
        refresh(){
            this.init();
        },
        data(){
            return{
                firstLoading:true,
                show:false,
                type:1,
                developer:[],
                categories:[],
                tableData:[],
                loading:true,
                searchData:{
                    name:"",
                    snType:"category",
                    snText:"",
                    page:1,
                    pageSize:50
                },
                clears:{
                    name:"",
                    snType:"category",
                    snText:"",
                    page:1,
                    pageSize:50
                },
                total:0,
                types:[
                    {label:'所属类别',value:"category"},
                    {label:'开发员',value:"developer"},
                ]
            }
        },
        mounted(){
            this.init();
            this.get_categories();
            this.get_developer();
        },
        computed:{
            snData(){
                if(this.searchData.snType==="category"){
                    return  this.categories
                }
                return  this.developer
            }
        },
        methods:{
            change_sntype(){
                this.searchData.snText="";
            },
            //初始化
            init(){
                this.tableData=[];
                this.loading=true;
                this.$http(api_product_list,this.searchData).then(res=>{
                    this.tableData=res.data;
                    this.total=res.count;
                    this.loading=false;
                    this.firstLoading = true;
                }).catch(code=>{
                    console.log(code)
                })

            },
            //获取分类
            get_categories(){
                this.categories=[];
                this.$http(api_product_category,{content:""}).then(res=>{
                    this.categories=res.map(row=>{
                        let item={
                            value:row.id,
                            label:row.name
                        }
                        return item
                    });
                    this.categories.unshift({label:'全部',value:''});
                }).catch(code=>{
                    console.log(code)
                })
            },
            //获取开发人员
            get_developer(){
                this.developer=[];
                this.$http(api_product_person,{type:'development',data:{content:""}}).then(res=>{
                    this.developer=res.map(row=>{
                        let item={
                            value:row.id,
                            label:row.realname
                        }
                        return item
                    });
                }).catch(code=>{
                    console.log(code)
                })
            },
            change_del(sum){
            	if(!!sum){
            		this.total -= sum;
                }else{
                    this.total --;
                }
            },
            change_add(){
            	this.total++;
            },
            //搜索
            search(){
                this.init()
            },
            //清空搜索
            clear(){
                console.log("test")
                this.searchData={
                    name:"",
                    snType:"category",
                    snText:"",
                    page:1,
                    pageSize:50
                }
                this.init()
            },
            //更改页面数量
            size_change(val){
                this.searchData.pageSize=val;
                this.init()
            },
            //更改当前页
            current_change(val){
                this.searchData.page=val;
                this.init()
            },
        },
        components:{
            labelItem:require('../../../components/label-item.vue').default,
            dataTable:require('./data-table.vue').default,
            searchCard: require('../../../components/search-card.vue').default
        }
    }
</script>
