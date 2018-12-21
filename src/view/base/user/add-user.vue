<template>
    <page-dialog class="c-add-category" title="添加新用户"
                 @open="open"
                 v-model="addDialog" :size="addSize" :close-on-click-modal="false">
        <div>
            <card label="用户基本信息">
                <el-form :model="addForm" ref="addForm" :rules="rules" label-width="180px">
                    <el-row>
                        <el-col :span="spanWidth">
                            <el-form-item label="用户名：" prop="username">
                                <el-input v-model="addForm.username"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="spanWidth">
                            <el-form-item label="职务：">
                                <el-select v-model="addForm.job"
                                           @change="change_job"
                                           filterable clearable
                                           placeholder="请选择职务">
                                    <el-option
                                            :key="item.value"
                                            v-for="item in departmentCode"
                                            :label="item.label"
                                            :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="spanWidth">
                            <el-form-item label="密码：" prop="password">
                                <el-input v-model="addForm.password" class="inline" style="width:83%"></el-input>
                                <el-button class="inline ml-xs" type="primary" size="mini" @click.native="create_password">生成密码</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="spanWidth">
                            <el-form-item label="部门/职位："  required>
                                <div v-for="(item,index) in addForm.department_id" :key="`${item.id}${index}`">
                                    <tree-dialog v-model="item.id"
                                                 @skip="skip(item,$event)"
                                                 @last="skip(item,$event)"
                                                 :tree="muiSelects"
                                                 class="inline"
                                                 style="width:43%"
                                                 dialogSize="large"
                                                 title="部门信息"></tree-dialog>
                                    <el-select v-model="item.job_id"
                                               class="inline"
                                               :disabled="!item.jobList||item.jobList.length<=0"
                                               :placeholder="com_placeholder(item)"
                                               style="width:43%"
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
                                             v-if="addForm.department_id.length!==1"
                                             @click="delete_department(index)"></div>
                                        <div class="add-icon"
                                             @click="add_department"
                                             v-if="addForm.department_id.length===1||index===(addForm.department_id.length-1)"></div>
                                    </div>
                                </div>

                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="8">
                        <el-col :span="spanWidth">
                            <el-form-item label="Email："  prop="email">
                                <el-input v-model="addForm.email"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="surplus">
                            <label>添加邮箱后请注意查收激活邮件</label>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="spanWidth">
                            <el-form-item label="姓名："  prop="realname">
                                <el-input v-model="addForm.realname"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="spanWidth">
                            <el-form-item label="手机号："  prop="mobile">
                                <el-input v-model="addForm.mobile"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="spanWidth">
                            <el-form-item label="工号：" prop="job_number">
                                <el-input v-model="addForm.job_number"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="spanWidth">
                            <el-form-item label="状态：">
                                <el-radio-group v-model="addForm.status">
                                    <el-radio :label="1" size="small">启用</el-radio>
                                    <el-radio :label="0" size="samll">禁用</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </card>
            <card label="角色">
                <el-row style="margin-left:100px">
                    <el-checkbox-group  class="card" v-model="role_id" @change="select_role">
                        <el-col :span="6"  v-for="item in roleList" :key="item.name">
                            <el-checkbox :label="item.id">{{item.name}}</el-checkbox>
                        </el-col>
                    </el-checkbox-group>
                </el-row>
            </card>
        </div>
        <span slot="footer" class="dialog-footer">
                <request-button req-key="addUser" @click="add(addForm)">确定</request-button>
                <el-button size="mini" @click.native="undo">取 消</el-button>
            </span>
    </page-dialog>
</template>
<style lang="stylus">
</style>
<script>
    import card from '../../../components/card.vue';
    import pageDialog from '../../../components/page-dialog.vue'
    import {api_add_user,api_department_role,api_get_department,api_department_code} from "../../../api/user-management";
    import {phone,email} from '../../../define/validator_reg'
    export default{
        data(){
            let checkNameber = (rule,value,callback)=>{
                if(value){
                    return !phone.test(value) ? callback(new Error("号码格式输入有误，请重新输入!")) : callback();
                }else{
                    callback();
                }
            };
            let checkEmail = (rule,value,callback)=>{
                if(value){
                    return !email.test(value)? callback(new Error("邮箱格式输入有误，请重新输入!")) : callback();
                }else{
                    callback();
                }
            };
            return {
                spanWidth:15,
                dialogTableVisible:false,
                lastName:"",
                role_id:[],
                addDialog:false,
                options:[],
                roleList:[],
                active:0,
                isReady:true,
                addSize:"large",
                rules:{
                    username:[
                        {required:true,message:"用户名不能为空",trigger:"blur change"}
                    ],
                    password:[
                        {required:true,message:"密码不能为空",trigger:"blur change"}
                    ],
                    department_id:[
                        {required:true,message:"部门不能为空",trigger:"blur change"},
                    ],
                    realname:[
                        {required:true,message:"姓名不能为空",trigger:"blur change"}
                    ],
                    email:[
                        {required:true,message:"邮箱不能为空",trigger:"blur change"},
                        {validator:checkEmail,trigger: 'blur change'}
                    ],
                    mobile:[
                        {required:true,message:"手机号不能为空",trigger:"blur change"},
                        {validator:checkNameber,trigger:"blur change"},
                    ],
                    job_number:[
                        {required:true,message:"工号不能为空",trigger:"blur change"},
                    ]
                }
            }
        },
        created(){

        },
        mounted(){
            this.addDialog = this.value;
        },
        watch:{
          addDialog(val){
              this.$emit("input",val);
          },
          value(val){
              this.addDialog = val;
          },
        },
        computed:{
            surplus(){
                return 24-this.spanWidth;
            },
        },
        methods:{
            open(){
                this.role_id = [];
                this.lastName="";
                this.init();
            },
            com_placeholder(item){
                if(!item.id||!this.addForm.job){
                    return "请先选择职务和部门";
                }else if(item.id&&this.addForm.job&&item.jobList&&item.jobList.length<=0){
                    return '暂无数据'
                }else{
                    return '请选择职位'
                }
            },
            skip(item,val){
                this.get_jobList(val,this.addForm.job,item);
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
                this.$http(api_department_code,params).then(res=>{
                    let objList = res.map(row=>{
                        return{
                            label:row.remark,
                            value:row.id
                        }
                    });
                    item.jobList = objList;
                }).catch(code=>{
                    console.log(code);
                });
            },
            change_job(val){
                this.addForm.department_id.forEach(row=>{
                    row.job_id='';
                    this.get_jobList(row.id,this.addForm.job,row);
                });
            },
            show_department(){
                this.dialogTableVisible = true;
            },
            add_department(){
                this.addForm.department_id.push({id:"",job_id:""});
            },
            delete_department(index){
                this.addForm.department_id.splice(index,1);
            },
//            获取 部门 和 角色；
            init(){
                this.get_role();
            },
//            添加部门列表样式
            add_style(item){
                let padd=item.depth*20;
                return {
                    paddingLeft:`${padd}px`,
                }
            },
//            获取角色
            get_role(){
                this.$http(api_department_role).then(res=>{
                    this.roleList=res.roleList;
                }).catch(code=>{
                    console.log(code);
                });
            },
            undo(){
                this.addDialog = false;
            },
//            -----------------------------------------------  选择角色
            select_role(val){
                this.addForm.role_id = val.join(",");
            },
//            -----------------------------------------------  添加
            add(addForm){
                this.$refs.addForm.validate((valid)=>{
                    if(valid){
                        this.$http(api_add_user,this.addForm).then(res=>{
                            this.$message({type: "success", message: res.message || res});
                            this.addDialog = false;
                            const role = this.role_id.map(id =>{
                                return this.roleList.find(r=>r.id===id).name;
                            }).join(',');
                            let department = [];
                            addForm.department_id.forEach(row=>{
                                if(!!row.jobList) delete row.jobList;
                                if(!!this.muiSelects[row]){
                                    let curName = this.muiSelects[row].name_path;
                                    department.push(curName);
                                }
                            });
                            this.$emit("add",Object.assign({role,department},addForm));
                        }).catch(code=>{
                            this.$message({type: "error", message: code.message || code})
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('addUser', false);
                            }, 300)
                        });
                    }else{
                        this.$reqKey('addUser',false)
                    }
                })
            },
//            -----------------------------------------------  生成密码
            create_password(){
                this.addForm.password = Math.floor(Math.random()*(1000000000-10000000+1)+10000000)+"_";
            },
        },
        props:{
          value:{},
          addForm:{
              required:true,
              type:Object
          },
          departmentCode:{
              required:true,
              type:Array
          },
          muiSelects:{
              required:true,
              type:Object
          },
          departmentList:{
              required:true,
              type:Array
          },
        },
        components: {
            card,
            pageDialog,
            uiSelect:require('../../../components/ui-select.vue').default,
            showDepartment:require('./show-department.vue').default,
            treeDialog:require("../../../api-components/tree-dialog.vue").default,
            requestButton:require('../../../global-components/request-button').default
        }
    }
</script>

