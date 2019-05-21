<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="listData"
                 :rules="rules"
                 label-width="210px"
                 ref="listData">
            <el-form-item label="简称：" prop="code">
                <el-col :span="14">
                    <el-input v-model="listData.code" disabled></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="账号名称：" prop="account_name">
                <el-col :span="14">
                    <el-input v-model="listData.account_name" disabled></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取Fummart订单功能：">
                <el-col :span="14">
                    <el-select v-model="listData.download_order">
                        <el-option v-for="item in downloadList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="同步发货状态到Fummart功能：">
                <el-col :span="14">
                    <el-select v-model="listData.sync_delivery">
                        <el-option v-for="item in downloadList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取Listing数据：">
                <el-col :span="14">
                    <el-select v-model="listData.download_listing">
                        <el-option v-for="item in downloadList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="listUser" @click="keep">确 定</request-button>
            <el-button size="mini" @click.native="show=false">取 消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_put_funmart_account} from '@/api/funmart-account';
    export default{
        data(){
            return{
                show:this.value,
                rules:{
                    code:[
                        {required: true, message: '简称为必填项', trigger: 'change'}
                    ],
                    account_name:[
                        {required: true, message: '账号名称为必填项', trigger: 'change' }
                    ]
                },
            }
        },
        methods:{
            open(){

            },
            close(){
                Object.keys(this.listData).forEach(key=>{
                    this.listData[key] = "";
                });
            },
            keep(){
                this.$refs.listData.validate(valid=>{
                    if(valid){
                        this.$http(api_put_funmart_account,this.listData.id,this.listData).then(res=>{
                            this.$message({type: 'success', message: res.message || res});
                            this.$emit('submit');
                            this.show = false;
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message || code});
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('listUser', false);
                            }, 300)
                        });
                    }else{
                        this.$reqKey('listUser',false)
                    }
                })
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            title:{},
            listData:{},
            downloadList:{}
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>
