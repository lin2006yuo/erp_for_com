<template>
    <page-dialog v-model="show" :title="title" @open="open" class="c-add-module" size="full">
        <div class="mt-sm mb-sm">
            <label class="ml-sm required-sign">OE ID：</label>
            <label-item>
                <el-input v-model="number" :disabled="!isAdd" class="inline mb-mini mr-sm"></el-input>
            </label-item>
            <label-item label="Item ID：">
                <el-input v-model="item_id" :disabled="!isAdd" class="inline mb-mini mr-sm"></el-input>
            </label-item>
            <label-item label="SPU：">
                <el-input v-model="spu" :disabled="!isAdd" class="inline mb-mini mr-sm"></el-input>
            </label-item>
            <label-item label="工厂型号：">
                <el-input v-model="factory_model" :disabled="!isAdd" class="inline mb-mini mr-sm"></el-input>
            </label-item>
        </div>
        <table class="template" v-loading="loading" element-loading-text="玩命加载中..." >
            <tr>
                <th class="required-sign">Make</th>
                <th class="required-sign">Model</th>
                <th class="required-sign">Year</th>
                <th class="required-sign">Trim</th>
                <th class="required-sign">Engine</th>
                <th>Notes</th>
                <th width="60px">操作</th>
            </tr>
            <tr>
                <td>
                    <el-select v-model="formData.make"
                               @input = "(val)=>{change_select('make')}"
                               filterable clearable
                               class="inline mb-mini">
                        <el-option v-for="(item,i) in makeList" :key="i" :label="item.make" :value="item.make"></el-option>
                    </el-select>
                </td>
                <td>
                    <el-select v-model="formData.model"
                               @input = "(val)=>{change_select('model')}"
                               filterable clearable
                               class="inline mb-mini">
                        <el-option v-for="(item,i) in modelList" :key="i" :label="item.model" :value="item.model"></el-option>
                    </el-select>
                </td>
                <td>
                    <el-select v-model="formData.year"
                               @input = "(val)=>{change_select('year')}"
                               filterable clearable
                               class="inline mb-mini">
                        <el-option v-for="(item,i) in yearList" :key="i" :label="item.year" :value="item.year"></el-option>
                    </el-select>
                </td>
                <td>
                    <el-select v-model="formData.trim"
                               @input = "(val)=>{change_select('trim')}"
                               filterable clearable
                               class="inline mb-mini">
                        <el-option v-for="(item,i) in trimList" :key="i" :label="item.trim" :value="item.trim"></el-option>
                    </el-select>
                </td>
                <td>
                    <el-select v-model="formData.engine"
                               filterable clearable
                               class="inline mb-mini">
                        <el-option v-for="(item,i) in engineList" :key="i" :label="item.engine" :value="item.engine"></el-option>
                    </el-select>
                </td>
                <td>
                    <el-input v-model="formData.notes" @keyup.enter.native="add"></el-input>
                </td>
                <td><el-button type="primary" size="mini" @click="add">添加</el-button></td>
            </tr>
            <tr v-for="(item,i) in oe_vechiles">
                <td><ui-tip :content="item.make" :width="95"></ui-tip></td>
                <td><ui-tip :content="item.model" :width="95"></ui-tip></td>
                <td><ui-tip :content="item.year" :width="95"></ui-tip></td>
                <td><ui-tip :content="item.trim" :width="95"></ui-tip></td>
                <td><ui-tip :content="item.engine" :width="95"></ui-tip></td>
                <td><ui-tip :content="item.notes" :width="95"></ui-tip></td>
                <td><el-button type="primary" size="mini" @click="del(i)">删除</el-button></td>
            </tr>
        </table>
        <el-pagination
            class="fr mt-sm"
            @size-change="handle_size_change"
            @current-change="handle_current_change"
            :current-page="page"
            :page-sizes="[20, 50, 100, 200]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <div slot="footer">
            <el-button type="primary" size="mini" @click="keep" :disabled="canEdit">确定</el-button>
            <el-button size="mini" @click.native="show=false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {
        api_ebay_oe_save,
        api_ebay_oe_update,
        api_ebay_oe_edit,
        api_ebay_oe_makes,
        api_ebay_oe_vechile,
    } from '../../../../api/ebay-kandeng-public-module'
    export default{
        data(){
            return{
                show:this.value,
                item_id:"",
                number:"",
                spu:"",
                factory_model:"",
                formData:{
                    make:"",
                    year:"",
                    model:"",
                    trim:"",
                    engine:"",
                    notes:"",
                },
                oe_vechiles:[],
                makeList:[],
                modelList:[],
                yearList:[],
                trimList:[],
                engineList:[],
                loading:false,
                page:1,
                pageSize:20,
                total:0,
                tableAllData:[],
                oldList:[],
            }
        },
        mounted(){
            this.init();

        },
        methods:{
            open(){
                this.oe_vechiles=[];
                this.tableAllData = [];
                this.formData={
                    make:"",
                    year:"",
                    model:"",
                    trim:"",
                    engine:"",
                    notes:"",
                };
                this.total=0;
                this.oldList = [];
                if(!this.isAdd){
                    this.get_list();
                }else{
                    this.item_id = "";
                    this.number = "";
                    this.spu = "";
                    this.factory_model = "";
                }
            },
            init(){
                this.$http(api_ebay_oe_makes).then(res=>{
                	this.makeList = res.data;
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                });
            },
            handle_size_change(size){
                this.pageSize = size;
                this.get_cur_page();
            },
            handle_current_change(page){
                this.page = page;
                this.get_cur_page();
            },
            get_cur_page(){
                this.oe_vechiles = [];
                this.tableAllData.forEach((row, index)=>{
                    if(index < this.page * this.pageSize && index >= (this.page - 1) * this.pageSize){
                        this.oe_vechiles.push(row);
                    }
                });
                this.total = this.tableAllData.length;
            },
        	add(){
            	let flag = this.get_data();
            	if(!flag) return ;
        		let obj = window.clone(this.formData);
                if(!obj.make){
                	this.$message({type:"warning", message: '有未填信息'});
                	return ;
                }
        		this.tableAllData.unshift(obj);
                this.formData = {
                    make:"",
                    year:"",
                    model:"",
                    trim:"",
                    engine:"",
                    notes:"",
                }
                this.get_cur_page();
            },
            get_data(){
        		let flag = true;
                for(let k in this.formData){
                    if(k!=='notes'){
                        if(!this.formData[k]){
                        	this.$message({type:"warning", message: '有必填信息未填'});
                        	flag = false;
                        	return;
                        }
                    }
                }
                return flag;
            },
        	del(index){
                this.tableAllData.splice(index,1);
                this.get_cur_page();
            },
            change_select(status){
                switch (status){
                    case 'make':
                        this.formData.model = "";
                        this.formData.year = "";
                        this.formData.trim = "";
                        this.formData.engine = "";
                        this.modelList = [];
                        this.yearList = [];
                        this.trimList = [];
                        this.engineList = [];
                        break;
                    case 'model':
                        this.formData.year = "";
                        this.formData.trim = "";
                        this.formData.engine = "";
                        this.yearList = [];
                        this.trimList = [];
                        this.engineList = [];
                        break;
                    case 'year':
                        this.formData.trim = "";
                        this.formData.engine = "";
                        this.trimList = [];
                        this.engineList = [];
                        break;
                    case 'trim':
                        this.formData.engine = "";
                        this.engineList = [];
                        break;
                    default:
                        break;
                }
                let data = window.clone(this.formData);
                delete data.notes;
                this.$http(api_ebay_oe_vechile,data).then(res=>{
                    switch (status){
                        case 'make':
                            this.modelList = res.data;
                            break;
                        case 'model':
                            this.yearList = res.data;
                            break;
                        case 'year':
                            this.trimList = res.data;
                            break;
                        case 'trim':
                            this.engineList = res.data;
                            break;
                        default:
                            break;
                    }
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                });
            },
            keep(){
                if(this.isAdd){
                	let obj = {
                		number:this.number,
                        item_id:parseInt(this.item_id),
                        spu:this.spu,
                        factory_model:this.factory_model,
                        oe_vechiles:this.tableAllData,
                    }
                	return this.$http(api_ebay_oe_save,{data:obj}).then(res=>{
                		this.$message({type:"success",message: res.message || res});
                		this.show = false;
                		obj.id = Number(res.id);
                        this.$emit("change-data",obj);
                        return Promise.resolve();
                    }).catch(code=>{
                    	this.$message({type:"error", message: code.message || code});
                        this.show = false;
                    });
                }else{
                    let data = {
                        id:this.id,
                        spu:this.spu,
                        factory_model:this.factory_model,
                        oe_vechiles:this.tableAllData,
                    }
                    this.$http(api_ebay_oe_update,{data:data}).then(res=>{
                        this.$message({type:"success",message: res.message || res});
                        this.show = false;
                    }).catch(code=>{
                        this.$message({type:"error", message: code.message || code});
                        this.show = false;
                    });
                }
            },
            get_list(){
                this.$http(api_ebay_oe_edit,{id:this.id}).then(res=>{
                    this.number = res.data.number;
                    this.item_id = res.data.item_id;
                    this.spu = res.data.spu;
                    this.factory_model = res.data.factory_model;
                    if(!!res.data&&!!res.data.oe_vechiles){
                        this.tableAllData = res.data.oe_vechiles.map(row=>{
                            return {
                                id:row.id,
                                make:row.make,
                                model:row.model,
                                year:row.year,
                                trim:row.trim,
                                engine:row.engine,
                                notes:row.notes,
                                isCheck:true
                            }
                        });
                        this.oldList = window.clone(this.tableAllData);
                        this.get_cur_page();
                    }else{
                        this.$message({type:"warning",message:'暂无OE数据'})
                    }
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                });
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            },
        },
        computed:{
        	canEdit(){
                if(JSON.stringify(this.oldList)===JSON.stringify(this.tableAllData)){
                	return true;
                }
                return false;
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            title:{
                required:true,
            },
            isAdd:{
                default(){
                	return true;
                }
            },
            id:{
            	required:true,
            },
        },
        components:{
            pageDialog:require('../../../../components/page-dialog.vue').default,
            labelItem:require("../../../../components/label-item.vue").default,
            uiTip:require("../../../../components/ui-tip.vue").default,

        }
    }
</script>
