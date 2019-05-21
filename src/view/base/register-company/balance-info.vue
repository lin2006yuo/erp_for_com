<template>
    <el-form :model="form"
             ref="balance"
             label-width="350px">
        <el-form-item label="法人结账："
                      prop="corporate_settlement"
                      :rules="[{type:'number',required:true,message:'请输入金额',trigger:'blur'}]">
            <el-col :span="12" v-if="flag!==1">
                <decimal-input v-model.number="form.corporate_settlement"
                               :is-appear="false"
                               class="inline"
                               :disabled="form.status===7">
                </decimal-input>  CNY
            </el-col>
            <span v-else>{{form.corporate_settlement}} CNY</span>
        </el-form-item>
        <el-form-item label="代理结账："
                      prop="agency_settlement"
                      :rules="[{type:'number',required:true,message:'请输入金额',trigger:'blur'}]">
            <el-col :span="12" v-if="flag!==1">
                <decimal-input v-model.number="form.agency_settlement"
                               :is-appear="false"
                               class="inline"
                               :disabled="form.status===7">
                </decimal-input>  CNY
            </el-col>
            <span v-else>{{form.agency_settlement}} CNY</span>
        </el-form-item>
        <el-form-item label="是否有公章：" prop="has_seal"
                      :rules="[{type:'number',required:true,message:'请选择公章',trigger:'blur'}]">
            <el-col :span="12" v-if="flag!==1">
                <el-select v-model="form.has_seal"
                           class="width-lg"
                           :disabled="disabled">
                    <el-option v-for="item in cachet"
                               :value="item.value"
                               :key="item.value"
                               :label="item.label">
                    </el-option>
                </el-select>
            </el-col>
            <span>{{isSeal}}</span>
        </el-form-item>
        <el-form-item label="备注：">
            <el-col :span="12" v-if="flag!==1">
                <el-input type="textarea"
                          v-model.trim="form.settlement_remark"
                          :disabled="form.status===7"></el-input>
            </el-col>
            <span v-else>{{form.settlement_remark}}</span>
        </el-form-item>
        <el-form-item label="" v-if="flag!==1">
                <template v-if="form.status_text==='待结账'">
                    <template v-if="form.has_seal===1">
                        <el-button type="primary" size="mini"
                                   @click.native="draw_info('audit_submit')">待领公章
                        </el-button>
                    </template>
                    <template v-if="form.has_seal===0">
                        <el-button type="primary" size="mini"
                                   @click.native="draw_info('audit_submit',true)">注册完成
                        </el-button>
                    </template>
                </template>
                <template v-if="form.status===6">
                    <el-button type="primary" size="mini"
                               @click.native="draw_info('audit_success')">领取公章
                    </el-button>
                </template>
                <el-button type="primary" size="mini"
                           @click.native="save"
                           :disabled="form.status===7">保 存
                </el-button>
                <el-button size="mini" @click.native="$emit('cancel')">取 消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {api_get_balance_info} from '@/api/register-company';
    export default {
        name: "balance-info",
        data() {
            return {
                cachet:[
                    {label:'有',value:1},
                    {label:'无',value:0}
                ],

            }
        },
        mounted() {
            if(this.flag){
                this.init_balance();
            }
        },
        computed: {
            isSeal(){
                if(this.flag===1){
                    let find=this.cachet.find(row=>row.value===this.form.has_seal);
                    if(find){
                        return find.label;
                    }
                }
            },
            disabled(){
                if(this.form.status_text==='待领公章'||this.form.status===7)return true;
            }
        },
        methods: {
            init_balance(){
                this.$http(api_get_balance_info,this.form.id).then(res=>{
                    if(res.agency_settlement==='0.00'&&res.corporate_settlement==='0.00'){
                        //第一次打开或保存
                        this.$set(this.form,'corporate_settlement','');
                        this.$set(this.form,'agency_settlement','');
                        this.$set(this.form,'has_seal','');
                    }else{
                        this.$set(this.form,'corporate_settlement',res.corporate_settlement);
                        this.$set(this.form,'agency_settlement',res.agency_settlement);
                        this.$set(this.form,'has_seal',res.has_seal);
                    }
                    this.$set(this.form,'settlement_remark',res.settlement_remark);
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            draw_info(string,bool){
                this.$refs.balance.validate(valid=>{
                    if(valid){
                        this.$emit('submit-balance-info',string,bool);
                    }
                })
            },
            save(){
                this.$emit('submit-balance-info','save');
            }
        },
        props: {
            form:Object,
            flag:Number
        },
        components: {
            decimalInput:require('./decimal-input').default
        },
    }
</script>

