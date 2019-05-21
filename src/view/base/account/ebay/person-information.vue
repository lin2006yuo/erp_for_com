<template>
    <el-row class="p-person-information">
        <page-dialog :title="titlename" v-model="infrommationVisible" size="large"  :close-on-click-modal="false">
            <el-card class="box-card">
                <el-form :model="personData2" label-width="200px">
                    <el-form-item label="eBay用户名：">
                        <div style="text-align: left">{{personData2.account_name}}</div>
                    </el-form-item>
                    <el-form-item label="信用评价：">
                        <el-col :span="2">
                            <el-input v-model="personData2.feedback_score" auto-complete="off" readonly></el-input>
                        </el-col>
                        <div style="text-align: left">S</div>
                    </el-form-item>
                    <el-form-item label="好评率：">
                        <el-col :span="2">
                            <el-input v-model="personData2.positive_feedback_percent" auto-complete="off" readonly></el-input>
                        </el-col>
                        <div style="text-align: left">%</div>
                    </el-form-item>
                    <el-form-item label="eBay地址：">
                        <el-col :span="14">
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 4, maxRows: 8}"
                                    placeholder="请输入内容"
                                    readonly
                                    resize="none"
                                    :value="`${personData2.country_name}${personData2.state_or_province}${personData2.city_name}${personData2.street}`">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="eBay邮件地址：">
                        <el-col :span="8">
                            <el-input v-model="personData2.email" auto-complete="off"   placeholder="ansiaj@163.com" readonly></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="注册日期：">
                        <el-col :span="8">
                            <el-input v-model="personData2.register_time" auto-complete="off"  placeholder="2012-03-12" readonly></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="表现：">
                        <div style="text-align: left">{{personData2.seller_show}}</div>
                    </el-form-item>
                    <el-form-item label="超级买家级别：">
                        <div style="text-align: left">{{  personData2.seller_level}}</div>
                    </el-form-item>
                    <el-form-item label="政策遵守度：">
                        <div style="text-align: left">{{ personData2.respect}}</div>
                    </el-form-item>
                    <el-form-item label="超级买家折扣：">
                        <el-col :span="3">
                            <el-input v-model="personData2.seller_discount" auto-complete="off"  placeholder="0.1" readonly></el-input>
                        </el-col>
                    </el-form-item>
                </el-form>
            </el-card>
            <div slot="footer" class="dialog-footer">
                    <el-button @click.native="infrommationVisible = false" type="primary" size="mini">关  闭</el-button>

                </div>

        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
</style>
<script>
    import  pageDialog from "../../../../components/page-dialog.vue"
    export default{
        data(){
            return{
                infrommationVisible:false,
                personData:{
                    name:"ansi",
                    count:18837,
                    address:"深圳市",
                    praise:98,
                    email:"",
                    day:"",
                    action:"",
                    level:"白银",
                    respect:"",
                    discount:""
                }
            }
        },
        computed:{
            titlename(){
                return  `查看账户：${this.personData2.account_name} 信息`
            }
        },
        watch:{
            infrommationVisible(val){
                this.$emit('input',val);
            },
            value(val){
                this.infrommationVisible = val;
            }
        },
        props:{
            value:{},
            personData2:{
                required:true,
                type:Object
            }
        },
        components:{
            pageDialog
        }
    }
</script>
