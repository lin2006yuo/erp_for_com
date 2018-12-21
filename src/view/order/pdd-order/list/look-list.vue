<template>
        <page-dialog title="快速抓取订单"
                     v-model="addFormVisible"
                     center>
            <el-form :model="addData"
                     :rules="rules"
                     label-width="190px"
                     ref="addData"
                     style="margin-top:20px;height:140px">
                <el-form-item label="账号简称：" prop="account_id">
                        <el-select v-model="addData.account_id"
                                   class="inline mr-sm"
                                   style="width: 170px;"
                                   placeholder="请选择账号简称"
                                   filterable clearable>
                            <el-option
                                :key="item.value"
                                v-for="item in addEditSiteList"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="开始时间： " prop="stime">
                    <el-date-picker
                        type="date"
                        placeholder="请选择开始时间"
                        v-model="addData.stime"
                        class="inline"
                        :picker-options="pickerOptions"
                        style="width:170px">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间： " prop="etime">
                    <el-date-picker
                        type="date"
                        placeholder="请选择结束时间"
                        v-model="addData.etime"
                        class="inline"
                        :picker-options="pickerOptions1"
                        style="width:170px">
                    </el-date-picker>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="addFormVisible = false">取 消</el-button>
                <request-button req-key="lookFormPdd" @click="save_order">确 定</request-button>
            </div>
        </page-dialog>
</template>
<style lang="stylus">
</style>
<script>
    export default{
        data(){
            return{
                pickerOptions:{
                    disabledDate:(time)=>{
                        return time.getTime() >new Date()
                    }
                },
                pickerOptions1:{
                    disabledDate: (time) => {
                        return time.getTime() > new Date().getTime() || time.getTime() < this.addData.stime;
                    }
                },
                addFormVisible:this.value,
                rules:{
                    account_id:[
                        {required: true, message: '请选择账号简称', trigger: 'change',type:'number'}
                    ],
                    stime:[
                        {required: true, message: '请选择开始时间', trigger: 'change',type:'date'}
                    ],
                    etime:[
                        {required: true, message: '请选择结束时间', trigger: 'change',type:'date'}
                    ],

                }
            }
        },
        created(){},
        methods:{
            save_order(){//-------------点击保存
                this.$refs.addData.validate((bool)=>{
                    if(bool){
                        this.$emit('save_order');//-------事件抛出
                    }else{
                        this.$reqKey('lookFormPdd', false);
                    }
                });
            },
        },
        computed:{},
        watch:{
            addFormVisible(val){
              this.$emit('input',val);
            },
            value(val){
                this.addFormVisible = val;
            }
        },
        props:{
            addData:{
                required:true,
                type:Object
            },
            addEditSiteList:{
                required:true,
                type:[Array]
            },
            value:{
                type:Boolean,
                required:true
            },
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
            requestButton:require('../../../../global-components/request-button').default,
            orderInput:require('../../../../components/order-input.vue').default,
            paramAccount:require('../../../../api-components/param-account.vue').default,
        }
    }
</script>
