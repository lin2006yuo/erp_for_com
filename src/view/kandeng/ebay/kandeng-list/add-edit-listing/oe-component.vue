<template>
    <div class="c-oe-componen">
        <div>
            <el-select v-model="oeCompatId"
                       @change="change_oeCompat"
                       class="inline"
                       filterable clearable>
                <el-option
                        v-for="res in oeCompatList"
                        :label="res.number"
                        :value="res.id"
                        :key="res.id"
                ></el-option>
            </el-select>
            <el-button type="primary"
                       size="mini"
                       @click.native="save_as"
                       class="inline ml-sm">另存为</el-button>
            <el-button type="primary"
                       size="mini"
                       @click.native="edit_notes"
                       class="inline ml-sm">编辑Notes</el-button>
            <el-button type="primary"
                       size="mini"
                       @click.native="delete_all"
                       class="inline ml-sm">删除</el-button>
        </div>
        <div class="mt-sm">
            <table class="template">
                <tr>
                    <th width="50px">
                        <el-checkbox v-model="checkAll"></el-checkbox>
                    </th>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Year</th>
                    <th>Trim</th>
                    <th>Engine</th>
                    <th>Notes</th>
                    <th>操作</th>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <el-select v-model="makeOption"
                                   @change="change_make_option('make',$event)"
                                   filterable clearable>
                            <el-option
                                v-for="res in makeOptionList"
                                :label="res.make"
                                :value="res.make"
                                :key="res.make"
                            ></el-option>   
                        </el-select>   
                    </td>
                    <td>
                        <el-select v-model="modelOption"
                                   @change="change_make_option('model',$event)"
                                   filterable clearable>
                            <el-option
                                v-for="res in modelOptionList"
                                :label="res.model"
                                :value="res.model"
                                :key="res.model"
                            ></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="yearOption"
                                   @change="change_make_option('year',$event)"
                                   filterable clearable>
                            <el-option
                                v-for="res in yearOptionList"
                                :label="res.year"
                                :value="res.year"
                                :key="res.year"
                            ></el-option>   
                        </el-select>   
                    </td>
                    <td>
                        <el-select v-model="trimOption"
                                   @change="change_make_option('trim',$event)"
                                   filterable clearable>
                            <el-option
                                    v-for="res in trimOptionList"
                                    :label="res.trim"
                                    :value="res.trim"
                                    :key="res.trim"
                            ></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="engineOption"
                                   filterable clearable>
                            <el-option
                                    v-for="res in engineOptionList"
                                    :label="res.engine"
                                    :value="res.engine"
                                    :key="res.engine"
                            ></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-input v-model="notes"></el-input>
                    </td>
                    <td>
                        <el-button type="primary"
                                   size="mini"
                                   @click.native="add_cur"
                                   class="inline">添加</el-button>
                    </td>
                </tr>
                <tr v-for="(row,index) in tableData" :key="`${index}x`">
                    <td>
                        <el-checkbox v-model="row.isCheck"></el-checkbox>
                    </td>
                    <td>
                        <ui-tip :content="row.make" :width="95"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="row.model" :width="95"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="row.year" :width="95"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="row.trim" :width="95"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="row.engine" :width="95"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="row.notes" :width="95"></ui-tip>
                    </td>
                    <td>
                        <span class="operate"
                              @click="delete_cur(row.id)">删除</span>
                    </td>
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
        </div>
        <edit-notes v-model="editNotesDialog" @submit="submit"></edit-notes>
        <save-new-oe v-model="saveAsDialog" @submit="submit_new_oe"></save-new-oe>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_ebay_oe_makes,api_ebay_oe_save,api_ebay_oe_vechile,api_ebay_oe_list,api_ebay_oe_edit} from '../../../../../api/ebay-kandeng-public-module';
    export default {
        data() {
            return {
                page:1,
                pageSize:20,
                total:0,
                tableAllData:this.value,
                oeCompatId:"",
                oeCompatList:[],
//                tableData:[],
                editNotesDialog:false,
                saveAsDialog:false,
                makeOption:"",
                modelOption:"",
                yearOption:"",
                trimOption:"",
                engineOption:"",
                notes:"",

                makeOptionList:[],
                modelOptionList:[],
                yearOptionList:[],
                trimOptionList:[],
                engineOptionList:[],

            }
        },
        mounted(){
            this.get_oe_makes();
            this.get_oe_list();
        },
        methods:{
            handle_size_change(size){
                this.pageSize = size;
//                this.get_cur_page();
            },
            handle_current_change(page){
                this.page = page;
//                this.get_cur_page();
            },

            change_oeCompat(val){
                this.$http(api_ebay_oe_edit,{id:val}).then(res=>{
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
//                        this.get_cur_page();
                    }else{
                        this.$message({type:"warning",message:'暂无OE数据'})
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
//            get_cur_page(){
//                this.tableData = [];
//                this.tableAllData.forEach((row, index)=>{
//                    if(index < this.page * this.pageSize && index >= (this.page - 1) * this.pageSize){
//                        this.tableData.push(row);
//                    }
//                });
//                this.total = this.tableAllData.length;
//            },
            get_oe_list(){
                this.$http(api_ebay_oe_list).then(res=>{
                    this.oeCompatList = res.data;
                }).catch(code=>{
                    console.log(code);
                })
            },
            delete_cur(id){
                let index = this.tableAllData.findIndex(row=>row.id === id);
                if(index>-1){
                    this.tableAllData.splice(index,1);
//                    this.get_cur_page();
                }
            },
            change_make_option(name,val){
                this.$http(api_ebay_oe_vechile,{name:name,value:val}).then(res=>{
                    switch(name){
                        case 'make':
                            this.modelOptionList = res.data;
                            this.modelOption = '';
                            break;
                        case 'model':
                            this.yearOptionList = res.data;
                            this.yearOption = '';
                            break;
                        case 'year':
                            this.trimOptionList = res.data;
                            this.trimOption = '';
                            break;
                        case 'trim':
                            this.engineOptionList = res.data;
                            this.engineOption = '';
                            break;

                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_oe_makes(){//获取车型品牌
                this.$http(api_ebay_oe_makes).then(res=>{
                    this.makeOptionList = res.data;
                }).catch(code=>{
                    console.log(code,'code');
                })
            },
            save_as(){
                this.saveAsDialog = true;
//
            },
            edit_notes(){
                this.editNotesDialog = true;
            },
            delete_all(){
                this.$confirm(`此操作将删除列表中所有的数据，确定继续？`,"提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(()=>{
                    this.tableAllData = [];
//                    this.get_cur_page();
                }).catch(code=>{
                    this.$message({
                        type:"info",
                        message:"已取消操作"
                    });
                });
            },
            add_cur(){
                if(!this.makeOption||!this.modelOption||!this.yearOption||!this.trimOption||!this.engineOption) return this.$message({type:'warning',message:"有必填项为填写，请补充完整！"})
                let obj = {
                    id:new Date().getTime(),
                    make:this.makeOption,
                    model:this.modelOption,
                    year:this.yearOption,
                    trim:this.trimOption,
                    engine:this.engineOption,
                    notes:this.notes,
                    isCheck:true
                };
                this.tableAllData.unshift(obj);
//                this.get_cur_page();
            },
            submit(val){
                this.tableAllData.forEach(row=>{
                    if(row.isCheck){
                        row.compatibility_notes = val;
                    }
                })
            },
            submit_new_oe(form){
                let param = clone(form);
                this.$set(param,'oe_vechiles',this.tableAllData);
                this.$http(api_ebay_oe_save,{data:param}).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res
                    });
                    this.saveAsDialog = false;
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:code.message||code
                    })
                })
            },
        },
        computed:{
            tableData:{
                get(){
                    if(this.tableAllData){
                        let cur = [];
                        this.tableAllData.forEach((row, index)=>{
                            if(index < this.page * this.pageSize && index >= (this.page - 1) * this.pageSize){
                                cur.push(row);
                            }
                        });
                        this.total = this.tableAllData.length;
                        return cur;
                    }
                },
            },
            checkAll:{
                get(){
                    return !this.tableData.find(row=>!row.isCheck);
                },
                set(val){
                    this.tableData.forEach(row=>{
                        row.isCheck = val;
                    });
                }
            },
        },
        watch:{
            tableAllData(val){
                this.$emit('input',val);
            },
            value(val){
                this.tableAllData = val;
            },
        },
        props:{
            value:{},
        },
        components: {
            editNotes:require('./edit-notes').default,
            saveNewOe:require('./save-new-oe').default,
            uiTip:require('../../../../../components/ui-tip.vue').default,
            paramAccount:require('../../../../../api-components/param-account.vue'),
        }
    }
</script>