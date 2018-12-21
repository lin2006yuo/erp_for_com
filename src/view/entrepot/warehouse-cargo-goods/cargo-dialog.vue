<template>
    <page class="p-dialog">
        <page-dialog :title="title" v-model="dialog" size="small" :close-on-click-modal="false" @change="change_dialog">
            <el-form label-width="120px" :model="form" ref="form" :rules="rules">
                <el-form-item label="原货位：" prop="from_cargo_id">
                    <warehouse-cargo v-model="form.from_cargo_id" :params-data="param" disabled style="width: 170px;"></warehouse-cargo>
                </el-form-item>
                <el-form-item label="新货位：" prop="to_cargo_id">
                    <warehouse-cargo v-model="form.to_cargo_id" :params-data="param"  style="width: 170px;"></warehouse-cargo>
                </el-form-item>
                <el-form-item label="数   量： " prop="quantity">
                    <integer-input v-model="form.quantity" :min="1" style="width: 170px;display: -webkit-inline-box;"></integer-input>
                    <span class="red ml-xs">最大的移库数量为{{max_number}}</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click.native="get_shift">确定</el-button>
                <el-button size="mini" @click.native="dialog=false">取消</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus">
</style>
<script>
    import {warehouse_cargo_lists} from '../../../api/local';
    export default{
        data(){
            let number = (rule,value,callback)=>{
                if(value){
                    return value==0?callback(new Error("数量不能为0")):callback();
                } else {
                    return callback();
                }
            };
            return {
                dialog:false,
                form:{
                    quantity:'',
                    from_cargo_id:'',
                    to_cargo_id:'',
                },
                rules:{
                    to_cargo_id:[
                        {required:true,message:"新货位不能为空",type:'number',trigger:"blur change"}
                    ],
                    quantity:[
                        {required:true,message:"数量不能为空",trigger:"blur change"},
                        {validator:number,trigger:"blur change"}
                    ],
                },
                max_number:0
            }
        },
        mounted(){

        },
        methods: {
            get_shift(){
                this.$refs.form.validate((bool)=> {
                    if (bool) {
                        let data = {
                            from_cargo_id :this.form.from_cargo_id,
                            to_cargo_id :this.form.to_cargo_id,
                            quantity :this.form.quantity,
                        };
                        console.log("移库",data);
                        this.$emit('get-shift',data);
                    }
                });
            },
            change_dialog(val){

            }
        },
        filters: {},
        watch: {
            dialog(val){
                this.$emit('input',val)
            },
            value(val){
                this.dialog = val;
                this.form.quantity = '';
                this.form.to_cargo_id = '';
                if(this.paramsData){
                    this.form.from_cargo_id = this.paramsData.warehouse_cargo_id;
                    this.max_number = this.paramsData.quantity - this.paramsData.hold_quantity;
                }
            },
        },
        computed: {},
        props: {
            value:{},
            title:{},
            paramsData:{},
            param:{},
        },
        components: {
            labelItem:require('../../../components/label-item.vue').default,
            pageDialog:require('../../../components/page-dialog.vue').default,
            warehouseCargo:require('../../../api-components/warehouse-cargo.vue').default,
            integerInput:require('../../../components/integer-input.vue').default,
        }
    }
</script>
