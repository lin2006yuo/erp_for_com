<template>
    <page-dialog :title="title"
                 v-model="editDialog"
                 :size="editSize"
                 :loading="loading"
                 @open="open"
                 :close-on-click-modal="false">
        <card label="用户基本信息" >
            <el-form :model="editForm" ref="editForm" :rules="rules" label-width="180px" >
                <el-row>
                    <el-col :span="spanWidth">
                        <el-form-item label="用户名：" prop="username">
                            <ui-input v-model="editForm.username" auto-complete="off" :edit="!isLook"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="spanWidth">
                        <el-form-item label="职务：">
                            <label-select v-if="isLook" v-model="editForm.job" :lists="departmentCode" :edit="!isLook"></label-select>
                            <el-select v-else
                                       v-model="editForm.job"
                                       @change="change_job"
                                       placeholder="请选择职务"
                                       filterable clearable>
                                <el-option
                                        :key="item.value"
                                        v-for="item in departmentCode"
                                        :label="item.label"
                                        :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="spanWidth">
                        <el-form-item label="部门/职位："  required>
                            <div v-if="editForm.department_id&&editForm.department_id.length>0"
                                 v-for="(item,index) in editForm.department_id"
                                 :key="`${item.id}${index}`">
                                <tree-dialog v-model="item.id"
                                             @skip="skip(item,$event)"
                                             @last="skip(item,$event)"
                                             :tree="muiSelects"
                                             class="inline"
                                             style="width:43%"
                                             :is-look="isLook"
                                             dialogSize="large"
                                             title="部门信息"></tree-dialog>
                                <el-select v-model="item.job_id"
                                           class="inline"
                                           :placeholder="com_holder(item)"
                                           style="width:43%"
                                           :disabled="isLook"
                                           filterable clearable>
                                    <el-option
                                            v-for="res in item.jobList"
                                            :label="res.label"
                                            :value="res.value"
                                            :key="res.value"
                                    ></el-option>
                                </el-select>
                                <div class="inline" style="width:10%">
                                    <div class="delete-icon"
                                         v-if="editForm.department_id.length!==1"
                                         @click="delete_department(index)"></div>
                                    <div class="add-icon"
                                         @click="add_department"
                                         v-if="editForm.department_id.length===1||index===(editForm.department_id.length-1)"></div>
                                </div>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="8">
                    <el-col :span="spanWidth">
                        <el-form-item label="Email："  prop="email">
                            <ui-input v-model="editForm.email" :edit="!isLook"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="surplus" v-if="!isLook">
                        <label>添加邮箱后请注意查收激活邮件</label>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="spanWidth">
                        <el-form-item label="姓名："  prop="realname">
                            <ui-input v-model="editForm.realname" :edit="!isLook"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="spanWidth">
                        <el-form-item label="手机号："  prop="mobile">
                            <ui-input v-model="editForm.mobile" :edit="!isLook"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="spanWidth">
                        <el-form-item label="工号：" prop="job_number">
                            <ui-input v-model="editForm.job_number" :edit="!isLook"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="spanWidth">
                        <el-form-item label="状态：">
                            <el-radio-group v-model="editForm.status">
                                <el-radio :label="1" size="small"  :disabled="isLook">启用</el-radio>
                                <el-radio :label="0" size="samll"  :disabled="isLook">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </card>
        <card label="角色">
            <el-row style="margin-left:100px">
                <el-checkbox-group  class="row-role-list card" v-model="role_ids">
                    <el-col :span="6"  v-for="item in roleList" :key="item.name">
                        <el-checkbox class="role-list" :label="item.id" :disabled="isLook">{{item.name}}</el-checkbox>
                    </el-col>
                </el-checkbox-group>
            </el-row>
        </card>
        <div slot="footer" class="dialog-footer">
            <el-button v-if="isLook" size="mini" @click.native="close">关闭</el-button>
            <div v-else>
                <request-button req-key="editUpdate" @click="update(editForm)">确定</request-button>
                <el-button  size="mini" @click.native="cancel">取消</el-button>
            </div>
        </div>
    </page-dialog>
</template>
<style>

</style>
<script>
    import pageDialog from '../../../components/page-dialog.vue';
    import card from '../../../components/card.vue';
    import {api_department_role,api_update,api_get_department,api_department_code} from '../../../api/user-management';
    import {phone,email} from '../../../define/validator_reg'
    export default{
        data(){
            let checkPhone = (rule,val,callback)=>{
                if(val){
                    return !phone.test(val)?callback(new Error("号码格式输入有误，请重新输入！")):callback();
                }else{
                    callback();
                }
            };
            let checkEmail = (rule,val,callback)=>{
                if(val){
                    return !email.test(val)?callback(new Error("邮箱格式输入有误，请重新输入！")):callback();
                }else{
                    callback();
                }
            };
            return{
                dialogTableVisible:false,
                spanWidth:15,
                editDialog:false,
                editSize:"large",
                options:[],
                roleList:[],
                role_ids:[],
                roles:'',
                rules:{
                    username:[
                        {required:true,message:"用户名不能为空",trigger:"blur"}
                    ],
//                    department_id:[
//                        {required:true,type:"number",message:"部门不能为空",trigger:"blur"},
//                    ],
                    realname:[
                        {required:true,message:"姓名不能为空",trigger:"blur"}
                    ],
                    email:[
                        {required:true,message:"邮箱不能为空",trigger:"blur"},
                        {validator:checkEmail,trigger: 'blur'}
                    ],
                    mobile:[
                        {required:true,message:"手机号不能为空",trigger:"blur"},
                        {validator:checkPhone,trigger: 'blur'}
                    ],
                    job_number:[
                        {required:true,message:"工号不能为空",trigger:"blur change"},
                    ]
                }
            }
        },
        created(){
            this.init();
        },
        mounted(){
            this.editDialog = this.value;
        },
        watch:{
            'editForm.roleList':{
                deep:true,
                handler(val){
                    this.role_ids = val.map(res=>res.id);
                }
            },
            editDialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.editDialog = val;
            }
        },
        computed:{
            surplus(){
                return 24-this.spanWidth;
            },

        },
        methods:{
            open(){
                this.editForm.department_id.forEach((item, index)=>{
                    this.get_jobList(item.id,this.editForm.job,item);
                    if(item.job_id === 0){
                        this.editForm.department_id[index].job_id = '';
                        if(!item.id) return item.id='';
                        this.get_jobList(item.id,this.editForm.job,item);
                    }
                });
            },
            com_holder(item){
                if(!item.id||!this.editForm.job){
                    return "请先选择职务和部门";
                }else if(item.id&&item.jobList&&item.jobList.length<=0){
                    return "暂无数据";
                }else{
                    return '请选择职位';
                }
            },
            add_department(){
                this.editForm.department_id.push({id:"",job_id:""});
            },
            delete_department(index){
                this.editForm.department_id.splice(index,1);
            },
            change_job(val){
                this.editForm.department_id.forEach(row=>{
                    row.job_id='';
                    this.get_jobList(row.id,this.editForm.job,row);
                });
            },
            show_department(){
                this.dialogTableVisible = true;
            },
            skip(item,val){
                this.get_jobList(val,this.editForm.job,item);
            },
            init(){
              this.get_role();
              this.get_department();
            },
//            获取部门
            get_department(){
                this.$http(api_get_department).then(res=>{
                    let data = [];
                    function pends(data,i,all) {
                        let length = data.length;
                        data[length - 1].depth = i;
                        if (data[length - 1].child_ids.length > 0) {
                            i++;
                            data[length - 1].child_ids.forEach(id=> {
                                data.push(all[id])
                                if (all[id].child_ids.length > 0) {
                                    pends(data, i, all)
                                }
                            })
                        }
                    }
                    res.child_ids.forEach(id=>{
                        data.push(res[id]);
                        pends(data,0,res)
                    });
                    this.options = data;
                }).catch(code=>{

                })
            },
//            获取角色
            get_role(){
                this.$http(api_department_role).then(res=>{
                    this.roleList = res.roleList;
                }).catch(code=>{
                    console.log(code);
                })
            },
//            添加部门样式
            add_style(item){
                let padd=item.depth*20;
                return {
                    paddingLeft:`${padd}px`,
                }
            },
//            手机号码验证
            temp(val){
                if(val){
                    let myreg = /^1[2345678]\d{9}$/;
                    if(!myreg.test(val)){
                        this.$message({
                            type:"warning",
                            message:"手机号码格式有误，请重新输入"
                        })
                        return false;
                    }else{
                        return true;
                    }
                }else{
                    return true;
                }
            },
//           -------------------------------  更新
            update(form){
                 this.$refs.editForm.validate((valid)=>{
                     if(valid){
                         form.department_id.forEach(row=>{
                             if(!!row.jobList) delete row.jobList;
                         });
                         let params = {
                             username:form.username,
                             realname:form.realname,
                             job_number:form.job_number,
                             email:form.email,
                             job:form.job,
                             status:form.status,
                             role_id:this.role_ids.join(','),
                             mobile:form.mobile,
                             department_id:form.department_id
                         };
                         this.$http(api_update,form.id,params).then(res=>{
                             this.$message({
                                 type:"success",
                                 message:res.message||res
                             });
                             this.editDialog = false;
                         }).catch(code=>{
                             this.$message({type:'error',message:code.message||code});
                         }).finally(()=>{
                             setTimeout(() => {
                                 this.$reqKey('editUpdate', false);
                             }, 300)
                         });
                     }else{
                         this.$reqKey('editUpdate', false);
                     }
                 })
            },
//            ----------------------------  关闭
            close(){
                this.editDialog = false;
            },
//            ----------------------------  取消
            cancel(){
                this.editDialog = false;
            },
            get_jobList(val,job,item){
                if(!!item.hasOwnProperty('jobList')){
                    item.jobList = [];
                }else{
                    this.$set(item,'jobList',[]);
                }
                if(!job)return;
                let cur = this.departmentList.find(res=>res.id===val);
                if(!cur)return;
                let params = {
                    type:1,
                    code:job,
                    department_type:cur.type,
                };
                return  this.$http(api_department_code,params).then(res=>{
                    let objList = res.map(row=>{
                        return{
                            label:row.remark,
                            value:row.id
                        }
                    });
                    item.jobList = objList;
                    console.log(objList,'objList');
                }).catch(code=>{
                    console.log(code);
                });
            },
        },
        props:{
            loading:{
                required:true,
                type:Boolean,
            },
            editForm:{
                required:true,
                type:Object
            },
            isLook:{
                required:true,
                type:Boolean
            },
            title:{
                requied:true,
                type:String,
            },
            value:{},
            //职务
            departmentCode:{
                requied:true,
            },
            muiSelects:{
                requied:true,
                type:Object
            },
            departmentList:{
                requied:true,
                type:Array
            },
        },
        components:{
            pageDialog,
            card,
            uiInput:require('../../../components/ui-input.vue').default,
            uiSelect:require('../../../components/ui-select.vue').default,
            labelSelect:require('../../../components/label-select.vue').default,
            showDepartment:require('./show-department.vue').default,
            treeDialog:require("../../../api-components/tree-dialog.vue").default
        }
    }

</script>
