<template>
    <page-dialog :title="title"
            v-model="show"
            size='small'
            :close-on-click-modal="false"
            @change="open_dialog"
        >  
        <el-form label-position="right" label-width="200px" :model="baseData" :rules="rules" ref="baseForm">
            <el-form-item label="手机号运营公司：" required prop="operator">
                <el-col :span='span10' class="add-phone-mobile">
                    <el-select class="full-width"
                            v-model="baseData.operator"                        
                            clearable
                            :disabled="account_num"
                            placeholder="请选择">
                        <el-option
                                v-for="item in mobileCompany"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>                
            </el-form-item>

            <el-form-item label="手机号：" >
                <el-col :span="span10" class="add-phone-mobile">
                    <el-input v-model="baseData.phone" type="number"  :disabled="account_num" class="inline full-width"></el-input>
                </el-col>                
            </el-form-item>     

            <el-form-item label="注册人：">
                <el-col :span='span10' class="add-phone-mobile">
                    <!-- <el-input v-model="baseData.reg_id" class="inline full-width"></el-input> -->
                    <scroll-select v-model="baseData.reg_id"  class="inline full-width"
                        textAlign="left"
                        ref="creater"
                        :disabled="account_num"                    
                        :remote="urlcreater"
                        :fix-params="fix_params_account"
                        :fixResult="fix_result_account"
                       >
                    </scroll-select>
                </el-col>                
            </el-form-item> 
              
            <el-form-item label="注册日期：">
                <el-col :span="span10" class="add-phone-mobile">
                     
                    <el-date-picker 
                        class="full-width"
                        v-model="baseData.reg_time"
                        type="date"
                        :disabled="account_num" 
                        placeholder="选择日期"
                        :picker-options="pickerOptions0"  
                    >
                    </el-date-picker>
                </el-col>                
            </el-form-item>                  

            <el-form-item label="猫池：">
                <el-col :span="span10">
                    <el-select v-model="baseData.cat_pool">
                        <el-option v-for="item in catPool"
                                   :key="item.key"
                                   :label="item.key"
                                   :value="item.key">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>

            <el-form-item label="状态：">
                <el-col :span="span10">
                    <el-switch v-model="baseData.status"
                        class="full-width"
                        on-text="启用"
                        :disabled="account_num" 
                        off-text="停用"
                        :on-value='1'
                        :off-value='0'
                        @change="change_status">
                    </el-switch>
                </el-col>                
            </el-form-item>                        
        </el-form>

        <div slot="footer" class="dialog-footer">         
            <el-button size="mini" type="primary" v-show="!account_num" @click.native="close">确定</el-button>
            <el-button size="mini" v-show="!account_num" @click.native="cancle">取消</el-button>
            <el-button size="mini" v-show="account_num"  @click="show=false">关闭</el-button>
        </div>

    </page-dialog>
</template>

<style lang="stylus">
.add-phone-mobile{
    .full-width{
        width 100%;
    }
}

</style>

<script>
    import {api_operation__phone,api_get_cat_pool } from '@/api/phone-management'
    export default {
        page: {
            devinfo: {
                frontEnd:'文军辉',
                backEnd:'',
                createTime:'2019-1-7',
                updateTime:'2019-1-7'
            }
        },
        name: "add-look-edit",
        mounted(){
            this.get_cat_pool();
        },
        data() {
            var checkcode = (rule, value, callback) => {
                let check=/^1[3456789][0-9]{9}$/;                
                setTimeout(() => {
                    if (value !== '' && check.test(value)) {
                        callback();
                    } else {
                        callback(new Error('请输入正确的手机号！'));
                    }
                }, 300);
            };
            return {
                show:this.value,
                span10: 14,
                urlcreater:'get|user',
                mobileCompany:[                
                    {label:'电信', value: 1},
                    {label:'移动', value: 2},
                    {label:'联通', value: 3},
                ],
                catPool:[],
                rules:{
                    operator:[
                        { required: true, type: 'number',message: '请选择运营公司', trigger: 'change' }
                    ],
                    // 取消了手机号的验证, 方便输入国外的手机号码。
                    // phone:[
                    //     { required: true,validator: checkcode, trigger: 'blur' },                        
                    // ]
                },
                pickerOptions0: {
                    disabledDate: (time) => {                    
                        if (this.baseData.reg_time) {
                            return time.getTime() > Date.now();
                        } else {
                            return false;
                        }                        
                    }
                }
            }
        },
        computed: {
            account_num() {
                return this.relationFlag;
            }
        },
        watch: {
            show(val){
                this.$emit('input',val)
            },
            value(val) {
                this.show=val;
            },
            form:{
                deep:true,
                handler(val){
                    if(this.flag){
                        this.businessPicture=[];
                        this.IDFront=[];
                        this.IDBack=[];
                        if(val.charter_url){
                            this.$set(this,'businessPicture',[{name:val.charter_url}]);
                        }
                        if(val.corporation_id_front){
                            this.$set(this,'IDFront',[{name:val.corporation_id_front}]);
                        }
                        if(val.corporation_id_contrary){
                            this.$set(this,'IDBack',[{name:val.corporation_id_contrary}]);
                        }
                    }
                }
            },
        },
        methods: {
            open_dialog(isOpen){
           
            },
            cancle() {
                this.show = false;
            },
            get_cat_pool(){
                this.$http(api_get_cat_pool,{name:'site_cat_pool'})
                    .then(res=>{
                        this.catPool=JSON.parse(res.data[0].setting);
                        console.log("猫池",this.catPool);
                    })
                    .catch(err=>{
                        console.log(err.message);
                    })
            },
            //账号参数
            fix_params_account({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    snText:keyword||"",
                    snType:"realname"
                };
            },
            //账号结果
            fix_result_account(res){
                return {
                    options: res.data.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
            keep_company_info(){
        
            },
            change_status(status) {            
                this.$confirm(`您将${status - 0 ? '启用':'停用'}？`, '是否继续', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res => {                    
                    this.$message({type: 'info',message: `已${status - 0?'启用':'停用'}`});                                     
                }).catch(res => {
                   if (status === 0) {
                       this.baseData.status = 1;
                   } else {
                       this.baseData.status = 0;
                   }                   
                });
            },
            // 确定关闭。
            close(){                
                // 请求保存数据, 保存成功后关闭对话框. 
                let data = clone(this.baseData);
                data.reg_time = datef('YYYY-MM-dd', data.reg_time / 1000); 
                data.reg_id = data.reg_id.value - 0;
                if (data.hasOwnProperty('reg_time_txt')) {
                    delete data.reg_time_txt;
                    delete data.reg_txt;
                }
                let params = {
                    id: data.id ? data.id : '', 
                    phone: data.phone,
                    operator: data.operator,
                    status: data.status,
                    reg_id: data.reg_id,
                    reg_time: data.reg_time,
                    cat_pool:data.cat_pool
                }                            
                this.$refs.baseForm.validate(valid => {                
                    if (valid) {                        
                        this.$http(api_operation__phone, params).then(res => {
                            this.$message({
                                message: res.message
                            });
                            this.show = false;                
                            this.$emit('refresh');
                        }).catch(err => {
                            this.$message({
                                message: err.message
                            });
                        })
                    } else {
                        return;
                    }
                });                
                
            },
        },
        props: {
            value:{},
            title:{},
            relationFlag: {},
            flag:{//0 add  1 look over  2 edit
                type:Number
            },
            baseData:{}
        },
        components: {
            scrollSelect:require('../../../components/scroll-select.vue').default,
        },
    }
</script>

