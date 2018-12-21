<template>
    <page-dialog :title="title" v-model="show" size="large" :close-on-click-modal="true" @open="open">
        <el-row>
        </el-row>
        <el-row class="mb-sm">
            <el-form label-width="90px" ref="form" :model="formData" :rules="rules">
                <el-form-item label="类型：">
                    <label-buttons
                        :max="15"
                        class="inline p-package-tab-buttons"
                        label=""
                        ref="label-buttons"
                        @select="change_type"
                        :buttons="typeButtons">
                    </label-buttons>
                </el-form-item>
                <el-form-item label="错误信息：" prop="error_info">
                    <el-input class="inline" style="width: 95%;" type="textarea" v-model="formData.error_info"
                              :autosize="{ minRows: 6, maxRows: 8}"></el-input>
                </el-form-item>
                <el-form-item label="解决方案：" prop="error_solution">
                    <el-input class="inline" style="width: 95%;" type="textarea" v-model="formData.error_solution"
                              :autosize="{ minRows: 6, maxRows: 8}"></el-input>
                </el-form-item>
                <el-form-item label="物流渠道：" v-if="formData.list_type===1" prop="shipping_name">
                    <el-input class="inline" style="width: 95%;" type="textarea" v-model="formData.shipping_name"
                              :autosize="{ minRows: 6, maxRows: 8}"></el-input>
                </el-form-item>
                <el-form-item label="负责人：" prop="respon_people">
                    <el-input class="inline"
                              style="width: 100px;"
                              type="text"
                              v-model="formData.respon_people"></el-input>
                </el-form-item>
            </el-form>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary">{{editType==='add'?'新增':'确定'}}</el-button>
            <el-button size="mini" @click.native="close">关 闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_packages_error_add,api_get_packages_error_edit} from '@/api/error-info-solution'
    export default {
        page:{
            devinfo:{
                frontEnd:'覃宏峰',
                backEnd:'蓝术术',
                createTime:'2018-10-18',
                updateTime:'2018-10-19'
            }
        },
        data() {
            return {
                show: this.value,
                rules: {
                    error_info: [
                        {required: true, message: "错误信息不能为空", trigger: "blur"}
                    ],
                    error_solution: [
                        {required: true, message: "解决方案不能为空", trigger: "blur"}
                    ],
                    shipping_name: [
                        {required: true, message: "物流渠道不能为空", trigger: "blur"}
                    ],
                    respon_people: [
                        {required: true, message: "负责人不能为空", trigger: "blur"}
                    ]
                },
                typeButtons:[
                    {label:'物流',value:1},
                    {label:'订单',value:2},
                    {label:'包裹',value:3},
                ]
            }
        },
        methods: {
            open(){
                let i;
                let item = this.typeButtons.find((row,index)=> {
                    if(row.value===this.formData.list_type){
                        i = index;
                        return true
                    }
                });
                this.$nextTick(()=>{
                    this.$refs[`label-buttons`].buttonClick(i,item);
                });
            },
            close() {
                this.show = false;
            },
            change_type(index,item){
                this.formData.list_type = item.value;
            },
            keep(){
                this.$refs.form.validate((bool)=>{
                    if(bool){
                        let data = {
                            list_type:this.formData.list_type,
                            error_info:this.formData.error_info,
                            respon_people:this.formData.respon_people,
                            error_solution:this.formData.error_solution
                        };
                        if(this.formData.list_type===1){
                            data.shipping_name = this.formData.shipping_name;
                        }
                        if(this.editType==='edit'){
                            data.id = this.formData.id;
                        }
                        this.$http(this.editType==='add'?api_get_packages_error_add:api_get_packages_error_edit, data).then(res => {
                            this.$message({
                                message: res.message || res,
                                type: 'success'
                            });
                            this.show = false;
                            this.$emit('save',this.editType,res.data);
                        }).catch(code => {
                            this.$message({message: code.message || code, type: 'error'})
                        })
                    }
                });
            }
        },
        filters:{
            filterDate(val){
                return val?datef('YYYY-MM-dd HH:mm:ss',val):'-- --';
            }
        },
        watch: {
            show(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.show = val;
            },
            'formData.list_type':{
                handler(val){
                    if(val===1){
                        this.rules.shipping_name = [{required: true, message: "物流渠道不能为空", trigger: "blur"}];
                    }else{
                        this.rules.shipping_name = [];
                    }
                },
                immediate:true
            }
        },
        props: {
            value: {
                required: true,
                type: Boolean
            },
            title: {
                required: true,
                type: String
            },
            formData:{
                required:true,
                type:Object
            },
            editType:{
                required:true,
                type:String
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            labelButtons:require('@/components/label-buttons').default,
        }
    }
</script>
