<template>
    <el-row class="p-add-pack">
        <page-dialog :title="titleName" v-model="dialogVisible" size="large" :close-on-click-modal="false">
            <el-form :model="packForm" :rules="rules" ref="packForm" label-width="150px">
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="供应商：" prop="supplier">
                            <supplier v-model="packForm.supplier"></supplier>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="11">
                        <el-form-item label="包装材料名称：" prop="title">
                            <el-input v-model="packForm.title" auto-complete="off" style="width:260px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="包材类型：" required>
                    <el-col :span="4">
                        <el-select v-model="packForm.type">
                            <el-option
                                    :key="item.value"
                                    v-for="item in types"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>

                <el-form-item label="成本：">
                    <el-col :span="4">
                        <el-form-item prop="cost_price">
                            <el-input v-model="packForm.cost_price" auto-complete="off" type="number"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" style="margin-left:7px">
                        <el-select v-model="packForm.currency" @change="changeSelect" style="width:115px">
                            <el-option
                                    :key="item.code"
                                    v-for="item in currencys"
                                    :label="item.name"
                                    :value="item.code"
                                    :disabled="item.disabled">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>

                <el-form-item label="尺寸：">
                    <label>长</label>
                   <!-- <input class="inline min-width el-input__inner" v-model="packForm.depth"
                           onkeyup="this.value=this.value.replace(/\D/g,'')"
                           onafterpaste="this.value=this.value.replace(/\D/g,'')">-->
                     <el-input type="number" class="inline diy-width" v-model="packForm.depth" @blur="blur_depth"></el-input>
                    <label>cm</label>
                    <label class="ml-xs">宽</label>
                   <!-- <input class="inline min-width el-input__inner" v-model="packForm.width"
                           onkeyup="this.value=this.value.replace(/\D/g,'')"
                           onafterpaste="this.value=this.value.replace(/\D/g,'')">-->
                     <el-input type="number" class="inline diy-width" v-model="packForm.width" @blur="blur_width"></el-input>
                    <label>cm</label>
                    <label class="ml-xs">高</label>
                  <!--  <input class="inline min-width el-input__inner" v-model="packForm.height"
                           onkeyup="this.value=this.value.replace(/\D/g,'')"
                           onafterpaste="this.value=this.value.replace(/\D/g,'')">-->
                    <el-input type="number" class="inline diy-width" v-model="packForm.height" @blur="blur_height"></el-input>
                    <label>cm</label>
                    <label class="ml-xs">体积</label>
                    <el-input type="number" class="inline diy-width" v-model="volume" :disabled="true"></el-input>
                    <label>cm³</label>
                </el-form-item>

                <el-form-item label="重量：" prop="weight">
                    <el-col :span="4">
                        <input class="inline el-input__inner" v-model="packForm.weight"
                               onkeyup="this.value=this.value.replace(/\D/g,'')"
                               onafterpaste="this.value=this.value.replace(/\D/g,'')">
                    </el-col>
                    <!-- <el-input class="inline" v-model="packForm.weight" type="number"></el-input>-->
                    <label>&nbsp;g</label>
                </el-form-item>
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="备注：">
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 2, maxRows: 6}"
                                    placeholder="请输入备注内容..."
                                    v-model="packForm.remark">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <request-button req-key="addPack" @click="confirm" :disabled="isDisabled" v-if="editId==0">
                    保存
                </request-button>
                <request-button req-key="updatePack" @click="update" :disabled="isDisabled" v-else>保存
                </request-button>
                <el-button size="mini" @click.native="dialogVisible=false">取 消</el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .p-add-pack{
        .add-pack-mt {
            margin-top: 5px;
        }
        .diy-width {
            width: 100px;
        }
    }

</style>
<script>
    import pageDialog from '../../../components/page-dialog.vue'
    import {api_pack_getCurrency, api_pack_add, api_pack_update} from '../../../api/pack';
    export default{
        data(){
            var Supplier = (rule, value, callback) => {

                setTimeout(() => {
                    if (!value) {
                        callback(new Error('供应商不能为空'));
                    } else {
                        callback();
                    }
                }, 1000);
            };
            var weight = (rule, value, callback) => {

                setTimeout(() => {
                    if (value < 0) {
                        callback(new Error('输入值不能小于0'));
                    } else {
                        callback();
                    }
                }, 1000);
            };
            return {
                url_supplier:config.apiHost+'supplier-offer/supplier',
                dialogVisible: false,
                unit: '',
                currencys: [],
                rules: {
                    title: [
                        {required: true, message: '名称不能为空', trigger: 'blur'}
                    ],
                    supplier: [
                        {required: true,validator: Supplier, trigger: 'change'}
                    ],
                    weight: [
                        {validator: weight, trigger: 'change'}
                    ],
                    cost_price: [
                        {validator: weight, trigger: 'change'}
                    ]
                },
                types: [
                    {
                        value: 0,
                        label: '入库'
                    },
                    {
                        value: 1,
                        label: '出库'
                    },
                    {
                        value: 2,
                        label: '集包'
                    }
                ]
            }
        },
        mounted(){
            this.$http(api_pack_getCurrency).then(res=> {
                this.currencys = res;
                for(let key in this.currencys){
                    if (key === 'CNY'){
                        this.$set(this.currencys[key],'disabled',false);
                    } else {
                        this.$set(this.currencys[key],'disabled',true);
                    }
                }
            }).catch(code=> {
                this.$message({message:code.message||code,type:'error'});
            });
        },
        methods: {
            //长宽高 失去焦点事件
            blur_depth(){
                 if (Number(this.packForm.depth) < 0) {
                        this.packForm.depth = 0;
                    }
                this.packForm.depth = Number(this.packForm.depth).toFixed(1);
            },
            blur_width(){
                if (Number(this.packForm.width) < 0) {
                        this.packForm.width = 0;
                    }
                this.packForm.width = Number(this.packForm.width).toFixed(1);
            },
            blur_height(){
                if (Number(this.packForm.height) < 0) {
                        this.packForm.height = 0;
                    }
                this.packForm.height = Number(this.packForm.height).toFixed(1);
            },

          fix_params({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    content:keyword,
                };
            },
            confirm(){//-----保存
                this.$refs.packForm.validate((valid)=> {
                    if (valid) {
                        this.$http(api_pack_add, this.packForm).then(res=> {
                            this.$message({
                                showClose: true,
                               type:"success",
                                message: res.message || res
                            });
                            this.dialogVisible = false;
                            this.$emit('confirm',res.id,this.packForm)
                        }).catch(code=> {
                            this.$message({message:code.message||code,type:'error'});
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('addPack', false);
                            }, 200)
                        });
                    } else {
                        this.$reqKey('addPack', false);
                    }
                });

            },
            update(){//----------------编辑
                let data = {
                    title: this.packForm.title,
                    cost_price: this.packForm.cost_price,
                    type: this.packForm.type,
                    width: this.packForm.width,
                    height: this.packForm.height,
                    depth: this.packForm.depth,
                    weight: this.packForm.weight,
                    remark: this.packForm.remark,
                    currency: this.packForm.currency,
                    supplier: this.packForm.supplier,
                };
                this.$refs.packForm.validate((valid)=> {
                    if (valid) {
                        this.$http(api_pack_update, this.editId, data).then(res=> {
                            this.$message({
                                showClose: true,
                                type:"success",
                                message: res.message || res
                            });
                            this.dialogVisible = false;
                            this.$emit('update',this.editId,data)
                        }).catch(code=> {
                            this.$message({message:code.message||code,type:'error'});
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('updatePack', false);
                            }, 200)
                        })
                    } else {
                        this.$reqKey('updatePack', false);
                    }
                });

            },
            changeSelect(val){
                switch (val){
                    case 1:
                        this.unit = '¥';
                        break;
                    case 2:
                        this.unit = '$';
                        break;
                    default:
                        this.unit = '£';
                }
            }
        },
        computed: {
            isDisabled(){
                if (!this.packForm.supplier) {
                    return true;
                }
                if (!this.packForm.title) {
                    return true;
                }
                return false;
            },
            volume(){ //----------自动计算商品体积
                return (this.packForm.depth * this.packForm.width * this.packForm.height / 6000).toFixed(2)
            },
            filtersuppliers(){
                return [];
            }
        },
        watch: {
            value(val){
                this.dialogVisible = val
            },
            dialogVisible(val){
                this.$emit('input', val)
            },
            editId(val){

            }
        },
        props: {
            value: {},
            editId: {
                required: true,
                type: Number
            },
            packForm: {
                required: true,
                type: Object
            },
            titleName: {
                required: true,
                type: String
            }
        },
        components: {
            pageDialog,
            uiSelect: require("../../../components/ui-select.vue").default,
            supplier: require("../../../api-components/supplier.vue").default,
        }
    }
</script>
