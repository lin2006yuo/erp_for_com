<template>
    <page-dialog title="批量修改结算方式"
                 v-model="addFormVisible"
                 center>
        <el-form :model="addData"
                 :rules="rules"
                 label-width="190px"
                 ref="addData"
                 class="mt-lg">
            <el-form-item label="修改结算方式为：" prop="balance_type">
                <el-select v-model="addData.balance_type"
                           class="inline mr-sm"
                           style="width: 175px;"
                           filterable clearable
                           placeholder="请选择结算方式">
                    <el-option
                        :key="item.label"
                        v-for="item in balanceList"
                        :label="item.name"
                        :value="item.label">
                    </el-option>
                </el-select>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="addFormVisible = false">取 消</el-button>
            <request-button req-key="clearingForm2" @click="add_ymx">确 定</request-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
</style>
<script>
    import {api_get_balance} from '../../../api/assert-sup';
    export default{
        data(){
            return{
                addFormVisible:this.value,
                balanceList: [],
                rules:{
                    balance_type:[
                        {required: true, message: '请选择结算方式', trigger: 'change',type:'number'}
                    ],
                }
            }
        },
        created(){
            this.get_balance();
        },
        methods:{
            get_balance() {
                this.$http(api_get_balance).then(res => {
                    this.balanceList = res;
                }).catch(code => {
                    console.log(code);
                })
            },
            add_ymx(){//-------------点击保存
                this.$refs.addData.validate((bool)=>{
                    if(bool){
                        this.$emit('submit');//-------事件抛出
                    }else{
                        this.$reqKey('clearingForm2', false);
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
            addData:{required:true, type:Object},
            value:{},
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
            requestButton:require('../../../global-components/request-button').default,
        }
    }
</script>
