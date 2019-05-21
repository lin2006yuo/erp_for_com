<template>
    <el-row class="c-look-over">
        <page-dialog :title="title" v-model="lookDialog"
                     :size="dialogSize"
                     :close-on-click-modal="false">
                <el-form v-model="lookForm" label-width="100px">
                    <el-row>
                        <el-col :span="15">
                            <el-form-item label="用户名：">
                                <el-input v-model="lookForm.username" auto-complete="off" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="15">
                            <el-form-item label="职务：">
                                <el-input v-model="lookForm.username" auto-complete="off" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="15">
                            <el-form-item label="部门：" class="mr-supper">
                                <label-select :list="options" v-model="lookForm.department_id" :edit="true" placeholder="请选择部门" ></label-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="15">
                            <el-form-item label="Email：" class="mr-supper">
                                <el-input v-model="lookForm.email"  :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="ml-xs">
                            <label>添加邮箱后请注意查收激活邮件</label>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="15">
                            <el-form-item label="姓名：" class="mr-supper">
                                <el-input v-model="lookForm.realname"  :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="15">
                            <el-form-item label="手机号：" class="mr-supper">
                                <el-input v-model="lookForm.mobile"  :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="15">
                            <el-form-item label="状态：">
                                <el-radio-group v-model="lookForm.status">
                                    <el-radio :label="1" size="small" disabled >启用</el-radio>
                                    <el-radio :label="0" size="samll" disabled >禁用</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button  type="primary" size="mini" @click.native="lookDialog=false">关闭</el-button>
                </span>
        </page-dialog>
    </el-row>
</template>
<style>

</style>
<script>
    import card from '../../../components/card.vue'
    import pageDialog from '../../../components/page-dialog.vue'
    import {api_department_role} from '../../../api/user-management'
    export default{
        data(){
            return{
                options:[],
                dialogSize:"small",
                lookDialog:false,
            }
        },
        created(){
            this.init();
        },
        computed:{
            title(){
                return "查看"+this.lookForm.username+"用户信息";
            }
        },
        methods:{
//            -------------------------------  获取部门 和 角色
            init(){
                this.$http(api_department_role).then(res=>{
                    this.options = res.department;
                }).catch(code=>{
                    console.log(code);
                });
            }
//            ---------------------------------
        },
        mounted(){
            this.lookDialog = this.value;
        },
        watch:{
            lookDialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.lookDialog = val;
            }
        },
        props:{
            lookForm:{
                required:true,
                type:Object
            },
            value:{}
        },
        components:{
            pageDialog,
            card,
            labelSelect:require('../../../components/label-select.vue').default
        }
    }

</script>
