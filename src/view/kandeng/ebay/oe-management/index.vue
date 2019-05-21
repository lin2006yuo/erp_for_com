<template>
    <page class="p-index">
        <search-card @search="search" @enter="search" :params="params" :clears="clears">
            <label-item label="OE ID：">
                <el-input v-sf.oeId  v-model="params.number" class="mr-sm"></el-input>
            </label-item>
            <label-item label="Item ID：">
                <el-input v-sf.itemId  v-model="params.item_id" class="mr-sm"></el-input>
            </label-item>
            <label-item label="SPU：">
                <el-input v-sf.spu  v-model="params.spu" class="mr-sm"></el-input>
            </label-item>
        </search-card>
        <div class="mt-xs mb-xs ml-sm">
            <el-button class="inline mb-mini" size="mini" type="primary"
                       v-for="(item,index) in btnslist" :key="index"
                       @click.native='clicked(item.status)'>{{item.name}}</el-button>
        </div>
        <el-table :data="tableData" v-resize="{height:41}" v-loading="loading"
                  ref="table"
                  @row-click="row_click"
                  @selection-change="click_arr"
                  element-loading-text="玩命加载中...">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column label="OE ID(TYC CODE)" prop="number">
            </el-table-column>
            <el-table-column label="Item ID(eBay)" prop="item_id">
            </el-table-column>
            <el-table-column label="SPU" prop="spu">
            </el-table-column>
            <el-table-column label="工厂型号" prop="factory_model">
            </el-table-column>
            <el-table-column label="创建时间" inline-template>
                <times :time="row.create_time"></times>
            </el-table-column>
            <el-table-column label="操作" width="100" inline-template>
                <permission tag="ElButton" :route="apis.url_ebay_oe_edit" size="mini" @click.native="edit(row)" type="primary">编辑</permission>
            </el-table-column>
        </el-table>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pages.page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="pages.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pages.total">
        </el-pagination>
        <get-oe-information v-model="getVisable" :title="title" @change-data="change_data"></get-oe-information>
        <merge-module v-model="mergeShow" :selectArr="checkArr" @change-data="change_data"></merge-module>
        <add-module v-model="addVisable" :title="title" :is-add="isAdd" :id="oeId" @change-data="change_data"></add-module>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {
    	api_ebay_oe_sync,
        api_ebay_oe_list,
        api_ebay_oe_remove,
        url_ebay_oe_sync,
        url_ebay_oe_edit,
        url_ebay_oe_save,
        url_ebay_oe_remove,
        url_oe_model_merge
    } from '../../../../api/ebay-kandeng-public-module'
    export default{
        permission: {
            url_ebay_oe_sync,url_ebay_oe_edit,url_ebay_oe_save,url_ebay_oe_remove,url_oe_model_merge
        },
        refresh(){
            this.params = {
                number:"",
                item_id:"",
                spu:""
            };
            this.title = "";
            this.init();
        },
		data(){
			return {
                btnList:[//----------------------------------------------操作按钮
                    {name:'获取OE兼容信息',clickName:'',status:1,api:url_ebay_oe_sync},
                    {name:'添加OE兼容信息',clickName:'',status:2,api:url_ebay_oe_save},
                    {name:'合并',clickName:'',status:4,api:url_oe_model_merge},
                    {name:'删除',clickName:'',status:3,api:url_ebay_oe_remove},
                ],
                params:{
                    number:"",
                    item_id:"",
                    spu:""
                },
                clears:{
                },
                tableData:[
                ],
                checkArr:[],
                loading:false,
                firstLoading: true,
                pages:{
                	size:50,
                    page:1,
                    total:0,
                },
                factory_model:"",
                title:"",
                getVisable:false,
                addVisable:false,
                isAdd:false,
                oeId:"",
                mergeShow:false,
            }
		},
        mounted(){
            this.init();
        },
        methods:{
			init(){
				let data ={
					"number":this.params.number.trim(),
                    "item_id":this.params.item_id,
                    "spu":this.params.spu,
                    "factory_model":"",
                    "page":this.pages.page,
                    "size":this.pages.size,
                };
                this.loading = true;
				this.$http(api_ebay_oe_list,data).then(res=>{
                    this.tableData = res.data;
                    this.pages.total = res.count;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                    this.loading = false;
                    this.firstLoading = false;
                });
            },
            change_data(data){
                let timestamp = Date.parse(new Date());
                timestamp = timestamp / 1000;
				let find = this.tableData.findIndex(row=>{
					return parseInt(row.id) === parseInt(data.id);
                });
				if(find>-1){
                    Object.assign(find,data);
                }else{
					data.create_time = timestamp;
                    this.tableData.unshift(data);
                    this.pages.total++;
                }
            },
            row_click(row,event,col){
                this.$refs.table.toggleRowSelection(row);
            },
            edit(row){
                this.addVisable = true;
                this.isAdd = false;
                this.oeId = row.id;
                this.title = "编辑兼容信息模板";
            },
            search(){
            	this.init();
            },
            clicked(status){//------------------------------------操作不同按钮执行的事件
                switch (status){
                    case 1:         //获取oe
                        this.title = "获取OE兼容信息";
                        this.getVisable = true;
                        break;
                    case 2:         //添加oe
                        this.isAdd = true;
                        this.addVisable = true;
                        this.title = "添加兼容信息模板";
                        this.oeId = '';
                        break;
                    case 3:         //删除
                        this.del();
                        break;
                    case 4:         //合并
                        this.merge();
                        break;
                    default:
                        break;
                }
            },
            merge(){
                if(this.checkArr.length < 2){
                    this.$message({type:"warning", message: '请至少选择两条需要合并的数据'});
                    return ;
                }
                this.mergeShow = true;

            },
            del(){
                if(!this.checkArr.length){
                	this.$message({type:"warning", message: '请先选择要删除的数据'});
                	return ;
                }
            	let arr = this.checkArr.map(row => {return row.id;});
                this.$confirm(`您将要对已选数据执行删除, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_ebay_oe_remove,{ids:arr.join(",")}).then(res=>{
                        this.checkArr.forEach(row=>{
                            let find = this.tableData.findIndex(it=>{
                                return parseInt(row.id) === parseInt(it.id);
                            });
                            if(find>-1){
                                this.tableData.splice(find,1);
                                this.pages.total--;
                            }
                        });
                        this.$message({type:"success",message: res.message || res});
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({type:"error", message: code.message || code});
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                })
            },
            handleSizeChange(size){
                this.pages.size=size;
                this.init();
            },
            handleCurrentChange(page){
                this.pages.page=page;
                this.init();
            },
            click_arr(val) {
                this.checkArr = val;
            },
        },
        computed:{
            btnslist(){
                return this.btnList.filter(row=>{
                    if(row.api){
                        return this.$hasPermission(row.api);
                    }else {
                        return true;
                    }
                });
            },
            emptyText(){
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            }
        },
		components: {
            labelItem:require("../../../../components/label-item.vue").default,
            searchCard:require('../../../../components/search-card.vue').default,
            getOeInformation:require("./get-oe-information.vue").default,
            addModule:require("./add-module.vue").default,
            mergeModule:require("./merge-module.vue").default,
        }
	}
</script>
