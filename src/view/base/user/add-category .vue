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
                                <el-select v-model="addForm.job" filterable clearable placeholder="请选择职务" >
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
                                <el-input v-model="addForm.password"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-button class="inline ml-xs" type="primary" size="mini" @click.native="create_password">生成密码</el-button>
                    </el-row>
                    <el-row>
                        <el-col :span="spanWidth">
                            <el-form-item label="部门：" class="mr-supper" required>
                                <tree-dialog v-model="addForm.department_id" :tree="muiSelects" dialogSize="large" title="部门信息"></tree-dialog>
                                <!--<el-input @focus="show_department" v-model="lastName" placeholder="点击选择部门..."></el-input>-->
                                <!--<show-department-->
                                        <!--ref="department"-->
                                        <!--v-model="dialogTableVisible"-->
                                        <!--:mui-selects="muiSelects"-->
                                        <!--:categories_id="addForm.department_id "-->
                                        <!--@skip="skip"></show-department>-->
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="8">
                        <el-col :span="spanWidth">
                            <el-form-item label="Email：" class="mr-supper" prop="email">
                                <el-input v-model="addForm.email"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="surplus">
                            <label>添加邮箱后请注意查收激活邮件</label>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="spanWidth">
                            <el-form-item label="姓名：" class="mr-supper" prop="realname">
                                <el-input v-model="addForm.realname"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="spanWidth">
                            <el-form-item label="手机号：" class="mr-supper" prop="mobile">
                                <el-input v-model="addForm.mobile"></el-input>
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
                <request-button req-key="addCategory" @click="add(addForm)">确定</request-button>
                <el-button size="mini" @click.native="undo">取 消</el-button>
        </span>
    </page-dialog>
</template>
<style lang="stylus">
</style>
<script>
    import card from '../../../components/card.vue';
    import pageDialog from '../../../components/page-dialog.vue'
    import {api_add_user,api_department_role,api_get_department} from "../../../api/user-management";
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
            }
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
            show_department(){
                this.dialogTableVisible = true;
            },
            skip(name,id){
                this.lastName = name;
                this.addForm.department_id = id;
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
//            获取部门
//            get_department(){
//                this.$http(api_get_department).then(res=>{
//                    this.muiSelects = res;
//                    let data = [];
//                    function pends(data,i,all) {
//                        let length = data.length;
//                        data[length - 1].depth = i;
//                        if (data[length - 1].child_ids.length > 0) {
//                            i++;
//                            data[length - 1].child_ids.forEach(id=> {
//                                data.push(all[id])
//                                if (all[id].child_ids.length > 0) {
//                                    pends(data, i, all)
//                                }
//                            })
//                        }
//                    }
//                    res.child_ids.forEach(id=>{
//                        data.push(res[id]);
//                        pends(data,0,res)
//                    })
//                    this.options=data;
//                }).catch(code=>{
//                    console.log(code);
//                })
//            },
//            -----------------------------------------------  取消
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
                            this.$message({type: "success", message: res.message || res})
                            this.addDialog = false;
                            this.$emit("add",this.addForm);
                        }).catch(code=>{
                            this.$message({type: "error", message: code.message || code})
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('addCategory',false)
                            }, 300)
                        });
                    }else{
                        this.$reqKey('addCategory',false)
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
          }
        },
        components: {
            card,
            pageDialog,
            uiSelect:require('../../../components/ui-select.vue').default,
            showDepartment:require('./show-department.vue').default,
            treeDialog:require("../../../api-components/tree-dialog.vue")
        }
    }
</script>

