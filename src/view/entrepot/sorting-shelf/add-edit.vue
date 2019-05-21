<template>
    <page-dialog :title="action.title"
                 size="large"
                 v-model="visible"
                 class="p-sorting-shelf"
                 :close-on-click-modal="false">
        <el-form :model="editData" :rules="rules" ref="editForm" label-width="120px" class="form-style">
            <div style="display: flex; flex-direction:column;">
                <el-form-item label="播种车名称：" required prop="name">
                    <el-input type="text" v-model="editData.name" class="width-lg"></el-input>
                </el-form-item>
                <el-form-item label="仓库：" required prop="warehouse_id">
                    <el-select v-model="editData.warehouse_id" class="width-lg" disabled>
                        <el-option v-for="item in warehouses"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="播种货架：" prop="row_column" required>
                    <div v-for="(item, index) in goodsShelf"
                         v-if="editData.row_column.length > 0">
                        <span>{{item.label}}{{index+1}}</span>
                        <span class="ml-sm">行数：</span>
                        <el-input type="number"
                                  :key="`${index}row`"
                                  class="width-xs inline"
                                  @change="rowChange(index, editData.row_column[index].row)"
                                  v-model="editData.row_column[index].row">
                        </el-input>
                        <span>列数：</span>
                        <el-input type="number"
                                  :key="`${index}col`"
                                  class="width-xs inline"
                                  @change="colChange(index, editData.row_column[index].column)"
                                  v-model="editData.row_column[index].column">
                        </el-input>
                        <el-button size="mini"
                                   type="danger"
                                   class="el-icon-delete ml-sm"
                                   v-show="goodsShelf.length > 1"
                                   @click="del_shelf(index)">
                        </el-button>
                        <el-button type="primary" size="mini"
                                   @click="add_shelf"
                                   v-if="index === goodsShelf.length - 1"
                                   v-show="goodsShelf.length < 3">添加</el-button>
                        <div class="row_column" v-if="editData.row_column[index].row > 9 || editData.row_column[index].column > 9">
                            <div v-show="editData.row_column[index].row > 9"
                                 class="form_error">行数不能大于9</div>
                            <div v-show="editData.row_column[index].column > 9"
                                 class="form_error col_error">列数不能大于9</div>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="最大包裹数量：">
                    <el-input v-model="max_package" disabled class="width-lg"></el-input>
                </el-form-item>
                <el-form-item label="默认播种车：" required prop="is_default">
                    <el-radio v-model="editData.is_default" :label="1">是</el-radio>
                    <el-radio v-model="editData.is_default" :label="0">否</el-radio>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                    <el-input type="textarea"
                              v-model="editData.remark"
                              style="width:300px"
                              :autosize="textSize">
                    </el-input>
                </el-form-item>
                <el-form-item label="状态：" required prop="status">
                    <el-radio v-model="editData.status" :label="0">启用</el-radio>
                    <el-radio v-model="editData.status" :label="1">禁用</el-radio>
                </el-form-item>
            </div>
            <!--这里来动态创建货架-->
            <div class="div-table mb-sm">
                <table class="shelf-table mb-sm"
                       v-for="(item, index) in goodsShelf"
                       :key="index"
                       v-if="editData.row_column.length > 0 && !!editData.row_column[index].row && !!editData.row_column[index].column && editData.row_column[index].row <= 9 && editData.row_column[index].column <= 9">
                    <tr v-for="(childRow, i) in editData['rowList'+(index+1)]" :key="`${i}tr`">
                        <td v-for="(childCol, ind) in editData['colList'+(index+1)]"
                            :key="`${ind}td`"
                            :class="{'padding-left':ind === 0,
                            'padding-right':ind === editData['colList'+(index+1)].length-1}">
                            <span class="shelf-style"><img src="../../../assets/goods-shelf.png" alt=""><span>{{index+1}}{{i+1}}{{ind+1}}</span></span>
                        </td>
                    </tr>
                </table>
            </div>
        </el-form>
        <div slot="footer">
            <request-button @click="save" req-key="apiAddEdit">确定</request-button>
            <el-button @click.native="visible = false" size="mini">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .form-style{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .shelf-style{
        display: flex;
        flex-direction: column;
        align-items: center;
        img{
            width :20px;
            height :24px;
        }
        span{
            color:#00acac;
        }
    }
    .p-sorting-shelf{
        .div-table{
            display: flex;
            flex-direction :column;
            align-items: top;
            justify-content: space-around;
            margin-right :40px;
        }
        .shelf-table{
            width:auto;
            td{
                position: relative;
                padding:0 6px;
            }
        }
        .square{
            border:1px solid grey;
            display:inline-block;
            text-align: center;
            width:30px;
            height:20px;
            line-height:20px;
        }
        .padding-left{
            padding-left:1px !important;
        }
        .padding-right{
            padding-right:1px !important;
        }
        .gray-div{
            background-color: #CCCCCC;
            height: 26px;
            width:6px;
            top:-2px;
            position:absolute;
        }
        .left-div{
            left:-8px;
        }
        .top-border{
            border-top:1px solid gray;
        }
        .bottom-border{
            border-bottom:1px solid gray;
        }
        .left-border{
            border-left:1px solid gray;
        }
        .right-border{
            border-right:1px solid gray;
        }
        .right-div{
            right:-8px;
        }
        .form_error{
            float:left;
            display: inline-block;
            color: #ff4949;
            font-size: 1.2rem;
            line-height: 1;
            padding-top: 0;
            margin-left: 95px;
            z-index: 10;
        }
        .row_column{
            height: 12px;
            line-height: 1px;
            overflow: hidden;
        }
        .col_error{
            float:right;
            margin-right: 345px;
        }
    }
</style>
<script>
    import {entrepot_picking, api_add_shelf, api_update_shelf} from '@/api/sorting-shelf'
    export default {
        data(){
            return {
                warehouses: [],
                goodsShelf:[],
                rules: {
                    name: [
                        { required: true, message: '请填写播种车名称', trigger: 'blur', type:'string'}
                    ],
                    warehouse_id: [
                        { required: true, message: '请选择仓库', trigger: 'change', type:'number'}
                    ],
                    is_default: [
                        { required: true, message: '请选择默认播种车', trigger: 'change', type:'number'}
                    ],
                    status: [
                        { required: true, message: '请选择播种车状态', trigger: 'change', type:'number'}
                    ],
                },
                visible:false,
                textSize:{
                    minRows: 4,
                    maxRows: 6
                },
                newData:{}
            }
        },
        mounted(){
            this.init_warehouse();
        },
        methods: {
            init_warehouse(){
                this.$http(entrepot_picking).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                }).catch(code => {
                    this.$message({type:"error",message:code.message || code});
                })
            },
            add_shelf(){
                this.goodsShelf.push({label:'货架'});
                this.editData.row_column.push({row:'',column:''});
            },
            del_shelf(index){
                this.goodsShelf.splice(index, 1);
                this.editData['rowList'+(index+1)] = [];
                this.editData['colList'+(index+1)] = [];
                this.editData.row_column.splice(index, 1);
                this.editData.row_column.forEach((item, index)=>{
                    this.rowChange(index, item.row);
                    this.colChange(index, item.column);
                });
                console.log(this.editData);
            },
            save(){
                return this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        typeof this.editData.name === 'string' && (this.editData.name = this.editData.name.trim())
                        typeof this.editData.remark === 'string' && (this.editData.remark = this.editData.remark.trim())
                        let data = window.clone(this.editData);
                        if(this.action.value === 'add'){
                            this.$http(api_add_shelf, data).then(res=>{
                                if(res.status === 1){
                                    this.$confirm(`${res.message}`, '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning',
                                        closeOnClickModal: false,
                                    }).then(() => {
                                        data.is_sure = 1;
                                        this.$http(api_add_shelf, data).then(res=> {
                                            this.$message({type:"success",message:res.message||res});
                                            this.newData = res.data;
                                            this.$emit('newData', this.newData);
                                            this.visible = false;
                                        }).catch(code => {
                                            this.$message({type:"error",message:code.message || code});
                                        })
                                    }).catch(() => {
                                        this.$message({
                                            type: 'info',
                                            message: '已取消'
                                        });
                                    });
                                } else {
                                    this.newData = res.data;
                                    this.$emit('newData', this.newData);
                                    this.visible = false;
                                    this.$message({type:"success",message:res.message||res});
                                }
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message || code});
                            }).finally(()=>{
                                setTimeout(()=>{
                                    this.$reqKey(`apiAddEdit`, false);
                                },200);
                            });
                        } else {
                            data.is_sure = 0;
                            delete data.create_time;
                            delete data.update_time;
                            this.$http(api_update_shelf, this.editData.id, data).then(res=>{
                                if(res.status === 1){
                                    this.$confirm(`${res.message}`, '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning',
                                        closeOnClickModal: false,
                                    }).then(() => {
                                        data.is_sure = 1;
                                        this.$http(api_update_shelf, this.editData.id, data).then(res=> {
                                            this.$message({type:"success",message:res.message||res});
                                            this.newData = res.data;
                                            this.$emit('newData', this.newData);
                                            this.visible = false;
                                        }).catch(code => {
                                            this.$message({type:"error",message:code.message || code});
                                        })
                                    }).catch(() => {
                                        this.$message({
                                            type: 'info',
                                            message: '已取消'
                                        });
                                    });
                                } else {
                                    this.newData = res.data;
                                    this.$emit('newData', this.newData);
                                    this.$message({type:"success",message:res.message||res});
                                    this.visible = false;
                                }
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message || code});
                            }).finally(()=>{
                                setTimeout(()=>{
                                    this.$reqKey(`apiAddEdit`, false);
                                },200);
                            });
                        }
                    } else {
                        this.$message({type:"warning", message:"信息未填写完整！"});
                        this.$reqKey(`apiAddEdit`, false);
                        return false;
                    }
                });
            },
            rowChange(index, row){
                if(this.editData.row_column[index].row > 9 || this.editData.row_column[index].column > 9){
                    return false;
                }
                this.editData['rowList'+(index+1)] = [];
                let i = 0;
                while(i < row){
                    this.editData['rowList'+(index+1)].push(i);
                    i++;
                }
            },
            colChange(index, row){
                if(this.editData.row_column[index].row > 9 || this.editData.row_column[index].column > 9){
                    return false;
                }
                this.editData['colList'+(index+1)] = [];
                let i = 0;
                while(i < row){
                    this.editData['colList'+(index+1)].push(i);
                    i++;
                }
            }
        },
        computed: {
            max_package(){
                let max = 0;
                this.editData.row_column.forEach(item=>{
                    if(item.row > 0 && item.column > 0){
                        max += item.row * item.column;
                    }
                });
                return max;
            }
        },
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                if(val){
                    this.goodsShelf.length = 0;
                    this.editData.row_column.forEach((item, index)=>{
                        this.goodsShelf.push({label:'货架'});
                        this.rowChange(index, item.row);
                        this.colChange(index, item.column);
                    });
                }
                this.visible = val;
            },
        },
        props: {
            value:{},
            action:{},
            editData:{},
            searchData:{}
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            requestButton:require('../../../global-components/request-button.vue').default,
        },
    }
</script>
