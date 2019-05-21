<template>
    <page-dialog :title="titleName" v-model="formVisible"
                 @open="open"
                 class="p-d-add-form-department"
                 size="small" :close-on-click-modal="false">
        <el-form :model="formData" :rules="rules"
                 ref="formData" label-width="160px">
            <el-form-item label="部门职能：" required>
                <el-col :span="20">
                    <el-select v-model="formData.job"
                               placeholder="请选择"
                               filterable
                               @change="change_job"
                               v-if="isEdit">
                        <el-option
                                :key="item.code"
                                v-for="item in codes"
                                :label="item.remark"
                                :value="item.code">
                        </el-option>
                    </el-select>
                    <div v-else>{{codeRemark}}</div>
                </el-col>
            </el-form-item>

            <el-form-item label="部门类型：" required>
                <el-col :span="20">
                    <el-radio-group :disabled="!isEdit" v-model="formData.type" @change="change_type">
                        <el-radio v-for='res in typeList' :key='res.id' :label='res.id'>{{res.name}}</el-radio>
                    </el-radio-group>
                </el-col>
            </el-form-item>
            <el-form-item label="上级部门：">
                <el-col :span="20">
                    <tree-dialog  v-model="formData.pid"
                                  :tree="superior"
                                  :dbclick="true"
                                  v-if="isEdit"
                                  dialogSize="large" title="上级部门" ></tree-dialog>
                    <div v-else>{{formData.department|deparmentFilter}}</div>
                </el-col>
            </el-form-item>

            <el-form-item label="部门/组名称：" prop="name">
                <el-col :span="20">
                    <el-input v-model="formData.name" v-if="isEdit"></el-input>
                    <div v-else>{{formData.name}}</div>
                </el-col>
            </el-form-item>

            <el-form-item label="部门/组负责人：" prop="leader_id" required>
                <template  v-for="(item,index) in formData.leader_id">
                    <div>

                        <!--<ui-params-->
                            <!--class="inline"-->
                            <!--style="width: 100px"-->
                            <!--v-model="item.user_id"-->
                            <!--type="department-name-group1"-->
                            <!--:options="options"-->
                            <!--:key="item.user_id"-->
                           <!--&gt;-->
                        <!--</ui-params>-->
                        <super-select
                            class="inline department-manage-width"
                            v-model="item.user_id"
                            :options="options"
                            :backfill="backfill"
                            :storageKey="`department-manage${item.user_id}`"
                            :data-index="`department-manage${item.user_id}`"
                          >
                        </super-select>


                        <div v-if="!isEdit" class="inline">{{com_user(item)}}</div>
                        <el-select v-model="item.job_id"
                                   v-if="isEdit"
                                   filterable
                                   clearable
                                   :placeholder="comPlaceholder"
                                   :disabled="jobList.length<=0"
                                   class="inline width-lg">
                            <el-option v-for="item in jobList"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>
                        <div v-if="!isEdit" class="inline">({{com_job(item)}})</div>
                        <div v-if="isEdit" class="inline">
                            <div v-if="index===0" class="add-icon inline" @click="add_leader"></div>
                            <div v-if="formData.leader_id.length!=1" class="delete-icon inline" @click="delete_leader(index)"></div>
                        </div>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="部门/组描述：">
                <el-col :span="20">
                    <el-input v-model="formData.remark" v-if="isEdit"></el-input>
                    <div v-else>{{formData.remark}}</div>
                </el-col>
            </el-form-item>
            <el-form-item label="所属平台：">
                <el-col :span="20">
                    <el-select clearable v-model="formData.channel_id" placeholder="请选择" :disabled="!isEdit">
                        <el-option v-for="item of platforms"
                                :label="item.label"
                                :value="item.value"
                                :key="item.value">
                        </el-option>
                    </el-select>
                </el-col>   
            </el-form-item>
            <el-form-item label="部门标签：">
                <el-col :span="20">
                    <el-col :span="17" style="position: relative;">
                        <el-input :placeholder="tagPlaceholder"
                                  type="textarea"
                                  :rows="2"
                                  :disabled="tagIDs.length===0 || !isEdit">
                        </el-input>
                        <div class="tag-group">
                            <el-tag  v-for="tag in formData.tag_name"
                                     v-if="!!formData.name"
                                     :key="tag.id"
                                     :closable="isEdit"
                                     type="primary"
                                     :close-transition="false"
                                     @close="tag_close(tag)">
                                {{tag.name}}
                            </el-tag>
                        </div>
                    </el-col>
                    <el-col :span="7">
                        <el-button class="add-tag"
                                   type="primary"
                                   size="mini"
                                   :disabled="!formData.name || !isEdit"
                                   @click.native="add_tag">
                            添加部门标签
                        </el-button>
                    </el-col>
                </el-col>
            </el-form-item>
            <el-form-item label="状态：">
                <el-col :span="20">
                    <el-radio-group v-model="formData.status" :disabled="!isEdit">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">停用</el-radio>
                    </el-radio-group>
                </el-col>
            </el-form-item>
        </el-form>
        <!--添加标签-->
        <add-tag v-model="addTag" :title="tagTitle" :selectedTags="formData.tag_name" @tag-select="tag_select"></add-tag>
        <div slot="footer" class="dialog-footer">
            <div v-if="isEdit" style="display: inline;">
                <request-button req-key="addSub" @click="add_sub" v-if="markId==0">确定</request-button>
                <request-button req-key="updateSub" @click="update_sub" v-else>确定</request-button>
                <el-button size="mini" @click.native="formVisible = false">取消</el-button>
            </div>
            <el-button size="mini" @click.native="formVisible = false" v-else>关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .p-add-form{
        .padd-span{
            display: inline-block;
        }
    }

    .p-d-add-form-department {
        .delete-icon {
            position: static;
            border-radius: 8px;
            // background: url('../../../assets/delete(2).png') no-repeat center;
        }
        .add-icon {
            background: url('../../../assets/add2.png') no-repeat center;
        }
        .add-icon, .delete-icon, .get-more {
            width: 20px;
            height: 20px;
            display: inline-block;
            vertical-align: middle;
            transition: all .2s;
            cursor:pointer
        }
        .tag-group{
            position:absolute;
            top:0;
            left:5px;
            height:48px;
            overflow-y:scroll;
            margin-right:2px;
        }
        .add-tag{
            padding:6px 6px;
            margin-left :4px;
        }
    }
    .department-manage-width{
        width 100px;
    }
</style>
<script>
    import pageDialog from '../../../components/page-dialog.vue';
    import {
        depart_getDepartment,
        api_job_code,depart_getUser,
        depart_add,depart_update,
        depart_list,
        api_department_type,
        depart_code,
        api_get_channel,
        api_super_select
        } from '../../../api/department';
    export default{
        data(){
            var check = (rule, value, callback) => {
                setTimeout(() => {
                    if (!value) {
                        callback(new Error('不能为空'));
                    }else{
                        callback();
                    }
                }, 1000);
            };
            return {
                typeList:[],
                jobList:[],
                userList:[],
                codes:[],
                formVisible:false,
                superior:{},
                principals:[],
                rules:{
                    name:[
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    leader_id:[
                        { validator: check, trigger: 'blur'}
                    ]
                },
                platforms:[],
                storageKey: "department",
                options:[],
                tagIDs:[],
                addTag:false,
                tagTitle:'',
                backfill: true,
            }
        },
        mounted(){
            this.get_code();
            this.get_user();
            this.get_department_type();
            this.get_department(this.formData.type);
            this.get_channel();
        //  获取这个remoteRequestHttp
            this.selectOptions();
        },
        methods:{

            /** 部门组负责人。 */
            selectOptions() {
                let params ={
                    snText:""
                };
                this.$http(api_super_select, params).then(res => {
                    this.options = res.userList.map(row=>{
                        return {
                            label:row.username,
                            value:row.id,
                        }
                    });
                });
            },
            get_department_type(){
                this.$http(api_department_type).then(res => {
                    this.typeList = res;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
            open(){
                console.log("formData:",this.formData);
                this.jobList = [];
                this.tagIDs=[];
                this.formData.tag_name.forEach(tag=>{
                    this.tagIDs.push(tag.department_tag_id);
                })
            },
            get_department(val){
                this.superior={};
                let params = {
                    type:val,
                    is_superior:1,
                };
                this.$http(depart_list,params).then(res=>{
                    if(res instanceof Array) return;
                    this.superior=res;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                });
            },
            get_channel(){
                this.$http(api_get_channel)
                    .then(res=>{
                        this.platforms=res;
                    });
            },
            change_type(val){
                this.get_job();
                this.get_department(val);
            },
            change_job(){
                this.get_job();
            },
            com_user(item){
                let curLable = "暂无数据";
                if(this.principals&&this.principals.length>0){
                    let curUser = this.principals.find(row=>{return row.value === item.user_id});
                    if(!!curUser) curLable = curUser.label;
                }
                return curLable
            },
            get_user(){
                this.$http(depart_getUser,{snText:''}).then(res=>{
                    this.principals=res.userList.map(row=>{
                        return {
                            label:row.username,
                            value:row.id
                        }
                    });
                }).catch(code=>{console.log(code)})
            },
            com_job(item){
                let curLable = '暂无数据';
                if(this.jobList&&this.jobList.length>0){
                    let curJob = this.jobList.find(row=>{return row.value === item.job_id});
                    if(!!curJob) curLable =  curJob.label;
                }
                return curLable;
            },
            add_leader(){
                let cur = {user_id:'',job_id:''};
                this.formData.leader_id.push(cur);
            },
            delete_leader(index){
                this.formData.leader_id.splice(index, 1);
            },
            fixAccount(res){
                return res.userList.map(row=>{
                    return {
                        label:row.username,
                        value:row.id,
                    }
                });
            },
            //部门代码
            get_code(){
                this.$http(api_job_code,{type:0}).then(res=>{
                    this.codes = res
                    // .map(item => {
                    //     return {label:item.remark, value:item.code}
                    // });
                }).catch(code=>{
                    console.log("code",code);
                })
            },
            //获取职务
            get_job(){
                this.jobList = [];
                this.formData.leader_id.forEach(row=>{
                    row.job_id = '';
                });
                let parmas ={
                    type:1,
                    code:this.formData.job,
                    department_type:this.formData.type,
                };
                this.$http(api_job_code,parmas).then(res=>{
                    this.jobList = res.map(row=>{
                        return {
                            label:row.remark,
                            value:row.id
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
            add_style(item){
                let padd=item.depth*20;
                let color=item.depth==0?"green":((item.depth==1)?"black":"red");
                return {
                    paddingLeft:`${padd}px`,
                    color:color,
                }
            },
            add_sub(){
                let code = "";
                let curObj = this.codes.find(row=>row.code===this.formData.job);
                if(!!curObj) code = curObj.remark;

                Reflect.deleteProperty(this.formData,"tag_name");
                // console.log("jobList:",this.jobList);
                // console.log("leader_id",this.formData.leader_id);
                for(let i=0;i<this.formData.leader_id.length;i++){
                    if(this.formData.leader_id[i].user_id===''||this.formData.leader_id[i].job_id===''){
                        this.$message({type:"warning",message:'部门/组负责人不能为空'});
                        return;
                    }
                }
                let leader_name = this.formData.leader_id.map(row=>{
                    let userObj = this.principals.find(res=>{return res.value===row.user_id});
                    let jobObj = this.jobList.find(res=>{return res.value===row.job_id});
                    // console.log("userObj:",userObj);
                    // console.log("jobObj:",jobObj);
                    return {name:userObj.label,job:jobObj.label}
                });
                let userIds = [];
                this.formData.leader_id.forEach(row=>{
                    userIds.push(row.user_id);
                });
                userIds = [...new Set(userIds)];
                if(userIds.length>0&&this.formData.leader_id.length>0){
                	if(userIds.length !== this.formData.leader_id.length){
                		this.$message({type:'warning',message:`部门/组负责人不能是同一个人!`});
                		return ;
                    }
                }
                this.$http(depart_add,this.formData).then(res=>{
                    this.$message(res.message || res);
                    this.formVisible=false;
                    this.$emit('add-depart', res.data.id, Object.assign(clone(this.formData), {code, leader_name}))
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code});
                    this.$reqKey('addSub', false);
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('addSub', false);
                    }, 300)
                })
            },
            update_sub(){
                let userIds = [];
                Reflect.deleteProperty(this.formData,"tag_name");

                this.formData.leader_id.forEach(row=>{
                    userIds.push(row.user_id);
                });
                userIds = [...new Set(userIds)];
                for(let i=0;i<this.formData.leader_id.length;i++){
                    if(this.formData.leader_id[i].user_id===''||this.formData.leader_id[i].job_id===''){
                        this.$message({type:"warning",message:'部门/组负责人不能为空'});
                        return;
                    }
                }
                if(userIds.length>0&&this.formData.leader_id.length>0){
                    if(userIds.length !== this.formData.leader_id.length){
                        this.$message({type:'warning',message:`部门/组负责人不能是同一个负责人!`});
                        return ;
                    }
                }
                if(!this.formData.pid) this.formData.pid=0;
                this.$http(depart_update,this.markId,this.formData).then(res=>{
                    this.$message({type: "success", message: res.message || res});
                    this.formVisible=false;
                    this.$emit('refresh');
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('updateSub', false);
                    }, 300)
                })
            },
            //删除标签
            tag_close(tag){
                let index=this.formData.tag_name.findIndex(item=>{
                    return item.department_tag_id===tag.department_tag_id;
                });
                this.formData.tag_name.splice(index,1);
                this.tagIDs.splice(this.tagIDs.indexOf(tag.department_tag_id),1);
                this.formData.tag_ids=this.tagIDs;
            },
            add_tag(){
                this.tagTitle=`给部门：${this.formData.name} 添加部门标签`;
                this.addTag=true;
            },
            //添加选择的标签
            tag_select(tags){
                // debugger;
                tags.forEach(tag=>{
                    //已存在的标签不再重复添加
                    let find=this.formData.tag_name.find(item=>{
                        return item.department_tag_id===tag.id;
                    });
                    if(!find){
                        let tagInfo={department_tag_id:tag.id,name:tag.name};//两个接口获取到的标签id字段名不一致，须做转换(id=>department_tag_id)
                        this.formData.tag_name.push(tagInfo);
                        this.tagIDs.push(tag.id);
                    }
                });
                this.formData.tag_ids=this.tagIDs;
            }
        },
        filters:{
            statusFilter(val){
                if(val==0){
                    return '停用'
                }else {
                    return '启用'
                }
            },
            deparmentFilter(val){
                if(val){
                    return val;
                }else{
                    return '-无-'
                }
            }
        },
        watch:{
            formVisible(val){
                this.$emit('input',val)
            },
            value(val){
                this.formVisible=val;

            },
        },
        computed:{
            comPlaceholder(){
                if(this.formData.job===""){
                    return '请先选择部门职能';
                }else if(!!this.formData.job&&this.jobList.length<=0){
                    return '暂无数据';
                }else{
                    return '请选择职位';
                }
            },
            codeRemark(){
                let cur = this.codes.find(row=>{return row.code===this.formData.job});
                if(!!cur)return cur.remark;
                return '暂无数据';
            },
            isSave(){
                if(!this.formData.name){
                    return true
                }
                if(!this.leader_id){
                    return true
                }
                if(!this.job){
                    return true
                }
                if(this.type===''){
                    return true
                }
                return false
            },
            tagPlaceholder(){
                if(this.formData.name){
                    if(this.tagIDs.length===0){return "请选择";}
                    else{return ""}
                }
                else return "请先填写部门/组名称";
            }
        },
        props:{
            value:{},
            formData:{
                required:true,
                type:Object
            },
            titleName:{
                required:true,
                type:String
            },
            isEdit:{
                required:true,
                type:Boolean
            },
            markId:{
                required:true,
                type:Number
            },
        },
        components: {
            pageDialog,
            categories:require('../../product/manager/categories.vue').default,
            paramAccount:require('../../../api-components/param-account.vue').default,
            treeDialog:require('../../../api-components/tree-dialog.vue').default,
            requestButton:require('../../../global-components/request-button').default,
            uiParams:require("../../../components/ui-params.vue").default,
            addTag:require("./add-tag").default
        }
    }
</script>
