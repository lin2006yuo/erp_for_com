<template>
    <div class="c-add-promotion-rule">
        <page-dialog :title="title" v-model="dialog" size="large" width="40%" left="25%" :close-on-click-modal="false" >
                <el-form :model="form" :rules="rules" ref="form" label-width="220px">
                <el-form-item label="促销名称：" prop="model_name">
                    <el-input class="inline width-super" v-model="form.model_name" placeholder="请填写促销名称"></el-input>
                </el-form-item>
                <el-form-item label="eBay账号：" prop="ebay_account">
                    <el-select class="inline width-super"
                               v-model="form.ebay_account"
                               placeholder="请填写eBay账号"
                               :disabled="readOnly"
                               filterable clearable>
                        <el-option
                                :key="item.value"
                                v-for="item in accountList"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始日期：" prop="start_date">
                    <el-date-picker
                            class="inline width-super"
                            v-model="form.start_date"
                            type="datetime"
                            :picker-options="start_date"
                            placeholder="请选择开始日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期：" prop="end_date">
                    <el-date-picker
                            class="inline width-super"
                            v-model="form.end_date"
                            type="datetime"
                            :picker-options="end_date"
                            placeholder="请选择结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="优惠明细：">
                    <div>
                        <el-checkbox v-model="form.promotion" @change="change_promotion_type">价格折扣</el-checkbox>
                    </div>
                    <el-radio-group v-model="form.promotion_type" @change="change_discount" :disabled="!form.promotion_type">
                        <div class="mb-mini">
                            <el-radio :disabled="!form.promotion" :label="1">在原价格上给予折扣
                                <ui-limit-number :disabled="form.promotion_type===2||!form.promotion" :limit="2" class="inline width-sm" v-model="form.promotion_discount"></ui-limit-number>&nbsp;%
                            </el-radio>
                        </div>
                        <div>
                            <el-radio :disabled="!form.promotion" :label="2">在原价格上降价
                                <ui-limit-number :disabled="form.promotion_type===1||!form.promotion" :limit="2" class="inline width-sm" style="margin-left:24px" v-model="form.promotion_cash"></ui-limit-number>
                            </el-radio>
                        </div>
                    </el-radio-group>
                    <div>
                        <el-checkbox v-model="form.promotion_trans">免运费（用于第一运输方式）</el-checkbox>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" size="mini" @click.native="save">确定</el-button>
                <el-button size="mini" @click.native="cancel">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
import {api_save_promotion} from '../../../../api/ebay-kandeng-public-module';
    export default{
        data(){
            return {
                dialog:false,
                choice:1,
                rules:{
                    model_name:[
                        {required:true,message:"促销名称为必填",trigger:'blur'},
                    ],
                    ebay_account:[
                        {required:true,message:"eBay账号为必填",trigger:'blur',type:"number"},
                    ],
                    start_date:[
                        {required:true,message:"开始日期为必填",trigger:'blur',type:'date'},
                    ],
                    end_date:[
                        {required:true,message:"结束日期为必填",trigger:'blur',type:'date'},
                    ]
                },
                start_date:{
                    disabledDate:(time)=>{
                        if(this.form.end_date){
                            return  time.getTime() > this.form.end_date;
                        }else {
                            return false
                        }
                    }
                },
                end_date:{
                    disabledDate:(time)=>{
                        if(this.form.start_date){
                            return  time.getTime() < this.form.start_date;
                        }else {
                            return false
                        }
                    }
                }
            }
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
            }
        },
        methods:{
            save(){
                this.$refs.form.validate((bool)=>{
                    if(bool){
                        let curForm = window.clone(this.form);
                        curForm.type="promotion";
                        if(curForm.end_date){
                            let end_date = new Date(this.form.end_date);
                            curForm.end_date = datef("YYYY-MM-dd HH:mm:ss",end_date.getTime()/1000);
                        }
                        if(curForm.start_date){
                            let start_date = new Date(this.form.start_date);
                            curForm.start_date = datef("YYYY-MM-dd HH:mm:ss",start_date.getTime()/1000);
                        }
                        curForm.promotion_trans = curForm.promotion_trans?1:0;
                        curForm.promotion = curForm.promotion?1:0;
                        let detail = [];
                        detail.push(curForm);
                        let params = {
                            model_type:"promotion",
                            detail:JSON.stringify(detail)
                        };
                        return this.$http(api_save_promotion,params).then(res=>{
                            this.$message(res.message);
                            this.dialog = false;
                            let start_date = new Date(this.form.start_date);
                            let end_date = new Date(this.form.end_date);
                            curForm.end_date = end_date.getTime()/1000;
                            curForm.tart_date = start_date.getTime()/1000;
                            this.$emit("save",curForm,res.data);
                            return Promise.resolve();
                        }).catch(code=>{
                            this.$message({message:code.message,type:'error'});
                            console.log(code);
                        });
                    }
                })

            },
            cancel(){
                this.dialog = false;
            },
            change_promotion_type(){
                this.choice = 1;
                this.form.promotion_discount = '';
                this.form.promotion_cash = '';
            },
            change_discount(val){
                if(val===1)return this.form.promotion_cash='';
                this.form.promotion_discount = '';
            }
        },
        props:{
            value:{},
            title:{},
            form:{},
            accountList:{
                type:Array,
                required:true
            },
            readOnly:{//刊登页面需要，限制不可编辑
                default(){
                    return  false;
                }
            }
        },
        components: {
            pageDialog:require('../../../../components/page-dialog.vue').default,
            uiLimitNumber:require('../../../../components/ui-limit-number.vue').default,
        }
    }
</script>
