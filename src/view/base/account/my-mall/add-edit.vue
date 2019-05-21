<template>
    <div class="c-add-edit">
        <page-dialog v-model="dialog" :close-on-click-modal="false" size="small" :title="title">
            <el-form :model="form" ref='form' label-width="220px" :rules="rules">
                <el-form-item label="MyMall账号：" prop='account_name'>
                    <el-input v-model="form.account_name" class='width-super' v-if="edit" disabled></el-input>
                    <label v-else>{{form.account_name}}</label>
                </el-form-item>
                <el-form-item label="账号简称：" prop="code">
                    <el-input v-model="form.code" v-if="edit" class='width-super' disabled></el-input>
                    <label v-else>{{form.code}}</label>
                </el-form-item>
                <el-form-item label="抓取Listing数据：">
                    <el-select v-model="form.sync_listing" v-if="edit"
                               class='width-super'
                               default-first-option filterable clearable>
                        <el-option
                            v-for="res in selectList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                        ></el-option>
                    </el-select>
                    <label v-else>{{comSync}}</label>
                </el-form-item>
                <el-form-item label="同步发货状态到myMall功能：">
                    <el-select v-model="form.sync_delivery" v-if="edit" class='width-super'
                               default-first-option filterable clearable>
                        <el-option
                            v-for="res in selectList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                        ></el-option>
                    </el-select>
                    <label v-else>{{form.sync_delivery|syncDeliveryFilter}}</label>
                </el-form-item>
                <el-form-item label="抓取Mymall订单功能：">
                    <el-select v-model="form.download_order" v-if="edit" class='width-super'
                               default-first-option filterable clearable>
                        <el-option
                                v-for="res in selectList"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                        ></el-option>
                    </el-select>
                    <label v-else>{{comOrder}}</label>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <div v-if="edit">
                    <request-button req-key="MyMallAdd" class="inline" @click.native="add_update">确定</request-button>
                    <el-button size="mini" class="inline" @click.native="dialog = false">取消</el-button>
                </div>
                <el-button size="mini" v-else class="inline" @click.native="dialog = false">关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_update_pandao_account} from '@/api/my-mall';
    export default {
        data() {
            return {
                dialog:this.value,
                selectList:[
                    {label: "未启用", value: 0},
                    {label: "30分钟", value: 30},
                    {label: "1小时", value: 60},
                    {label: "2小时", value: 120},
                    {label: "3小时", value: 180},
                    {label: "4小时", value: 240},
                    {label: "5小时", value: 300},
                    {label: "6小时", value: 360},
                    {label: "7小时", value: 420},
                    {label: "8小时", value: 480},
                    {label: "9小时", value: 540},
                    {label: "10小时", value: 600},
                    {label: "11小时", value: 660},
                    {label: "12小时", value: 720},
                    {label: "24小时", value: 1440},
                ],
                rules:{
                    account_name:[
                        {required:true,message:'MyMall账号为必填项',trigger:'change'}
                    ],
                    code:[
                        {required:true,message:'账号简称为必填项',trigger:'change'}
                    ],
                },
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        methods:{
            add_update(){
                this.$refs.form.validate((b)=>{
                    if(b){
                        this.$http(api_update_pandao_account,this.form).then(res => {
                            res.data.enabled = res.data.enabled === 1;
                            this.$message({type:'success',message:res.message||res});
                            this.dialog = false;
                            this.$emit('add-update',res.data);
                        }).catch(code => {
                            this.$message({type:'error',message:code.message||code});
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('MyMallAdd', false);
                            }, 300)
                        })
                    }else{
                        this.$reqKey('MyMallAdd', false);
                    }
                })
            },
        },
        filters:{
            syncDeliveryFilter(value){
                let str='';
                if(value===0){
                    str='未启用';
                }
                else if(value===30){
                    str='30分钟';
                }
                else{
                    str=value/60+'小时';
                }
                return str;
            }
        },
        computed:{
            comOrder(){
                if(this.edit)return;
                let find = this.selectList.find(row=>row.value === this.form.download_order);
                return find?find.label:'暂无数据';
            },
            comSync(){
                if(this.edit)return;
                let find = this.selectList.find(row=>row.value === this.form.sync_listing);
                return find?find.label:'暂无数据';
            },
        },
        props:{
            value:{},
            title:{},
            form:{},
            edit:{},
        },
        components: {
            pageDialog:require('../../../../components/page-dialog.vue').default,
        }
    }
</script>
