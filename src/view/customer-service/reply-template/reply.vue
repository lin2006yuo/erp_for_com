<template>
    <page class="p-reply">
        <page-dialog  :title="title" v-model="dialog"   :close-on-click-modal="false" @change="change_dialog">
            <el-form ref="form" :model="form" label-width="100px"  :rules="rules" >
                <el-form-item label="平台：" required  prop="channel_id">
                    <el-select v-model="form.channel_id" placeholder="请选择" class="inline" @change="change_channel">
                        <el-option
                                :key="item.value"
                                v-for="item in boxs"
                                :label="item.name"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模板编号：" required  prop="template_no">
                    <el-input v-model="form.template_no" class="inline" :disabled="changeNo"></el-input>
                </el-form-item>
                <el-form-item label="名称：" required prop="template_name" >
                    <el-input v-model="form.template_name" class="inline"></el-input>
                </el-form-item>
                <el-form-item label="分组：" required prop="group_id" >
                    <el-select v-model="form.group_id" placeholder="请选择" class="inline">
                        <el-option
                                :key="item.value"
                                v-for="item in teams"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <i class="el-icon-plus"  @click="add_team"></i>
                    <i class="el-icon-edit"  @click="mdf_team"></i>
                    <i class="el-icon-close"  @click="del_team"></i>
                        <page-dialog  v-model="teamVisable" :close-on-click-modal="false" :title="teamTitle">
                            <label>name:</label>
                            <el-input v-model="teamName" class="inline"></el-input>
                            <div slot="footer">
                                <el-button type="primary" size="mini" @click.native="team_confirm">确认</el-button>
                                <el-button  size="mini" @click.native="teamVisable = false">关闭</el-button>
                            </div>
                        </page-dialog>

                </el-form-item>
                <el-form-item label="备注：">
                    <el-input
                            type="textarea"
                            :rows="3"
                            placeholder="请输入内容"
                            v-model="form.remark">
                    </el-input>
                </el-form-item>
                <el-form-item label="内容："   required prop="content" >
                    <el-row class="field mb-xs">
                        <label>数据字段：</label>
                        <el-select v-model="content" placeholder="请选择" class="inline" @input="change_field">
                            <el-option
                                    :key="item.value"
                                    v-for="item in field"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-row>
                    <el-input
                            ref="textarea"
                            type="textarea"
                            :rows="7"
                            placeholder="请输入内容"
                            @blur="focus"
                            v-model="form.content">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" size="mini" @click.native="add_save" v-if="isAdd">确定</el-button>
                <el-button type="primary" size="mini" @click.native="confirm" v-else>确定</el-button>
                <el-button  size="mini" @click.native="dialog = false">关闭</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus">
    .p-reply{
        .field{
            background: #689DD3;
            height: 30px;
        }
    }
</style>
<script>
        import {api_reply_channel,api_reply_team,api_add_template,api_add_reply,api_update_reply,api_edit_template,api_update_template,api_del_template,api_reply_field} from "../../../api/reply-template"
    export default{
        data(){
            return{
                current:0,
                dialog:false,
                field:[],
                boxs:[],
                teams:[],
                title:"",
                isAdd:false,
                teamName:"",
                teamTitle:"",
                teamVisable:false,
                content:"",
                rules:{
                    channel_id:[{ required: true, message: '请选择平台', trigger: 'blur,change' ,type:"number"}],
                    template_no:[{ required: true, message: '请输入模板编号', trigger: 'blur' },],
                    template_name:[{ required: true, message: '请输入模板名称', trigger: 'blur' },],
                    group_id:[{ required: true, message: '请选择分组', trigger: 'blur' ,type:"number"},],
                    content:[{ required: true, message: '请输入内容', trigger: 'blur' ,},],
                }
            }
        },
        created(){
        },
        mounted(){
            this.get_channel();
        },
        computed:{
        },
        methods:{
            add_save(){
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http(api_add_reply,this.form).then(res=>{
                            this.$message({
                                type: 'success',
                                message: res.message||res
                            });
                            this.$set(this.form,'id',parseInt(res.id))
                            this.$emit('change-data',this.form,this.teams.find(row=>{
                                return row.value === this.form.group_id
                            }).label)
                            this.dialog=false;
                        }).catch(code=>{
                            this.$message({message:code.message||code,type:'error'});
                        })
                    } else {
                        return false;
                    }
                });
            },
            confirm(){
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http(api_update_reply,this.form.id,this.form).then(res=>{
                            this.$message({
                                type:'success',
                                message: res.message||res
                            });
                            this.$emit('change-data',this.form,this.teams.find(row=>{
                                return row.value === this.form.group_id
                            }).label);
                            this.dialog=false;
                        }).catch(code=>{
                            this.$message({type:"error",message: code.message || code})
                        })
                    } else {
                        return false;
                    }
                });


            },
            team_confirm(){
                if(this.teamTitle==="添加模板分组"){
                    let data={
                        template_type:this.form.template_type,
                        channel_id:this.form.channel_id,
                        group_name:this.teamName,
                    };
                    return this.$http(api_add_template,data).then(res=>{
                        this.$message({
                            type: 'success',
                            message: res.message||res
                        });
                        this.teamVisable=false;
                        this.change_channel();
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});
                    })
                }else if(this.teamTitle==="修改模板分组"){
                    let data={
                        template_type:this.form.template_type,
                        channel_id:this.form.channel_id,
                        group_name:this.teamName,
                    };
                    console.log("参数",data)
                    return this.$http(api_update_template,this.form.group_id,data).then(res=>{
                        this.$message({
                            type: 'success',
                            message: res.message||res
                        });
                        this.teamVisable=false;
                        this.change_channel();
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});
                    })
                }
            },
            //添加分组
            add_team(){
                if(!this.form.channel_id){
                    this.$message({type:"error",message:"请选择平台"})
                    return;
                }
                this.teamTitle="添加模板分组";
                this.teamVisable=true;
                this.teamName="";
            },
            //删除分组
            del_team(){
                    if(this.form.group_id){
                        this.$http(api_del_template,this.form.group_id).then(res=>{
                            this.$message({
                                type: 'success',
                                message: res.message||res
                            });
                            this.form.group_id="";
                            this.change_channel()
                        }).catch(code=>{
                            this.$message({message:code.message||code,type:'error'});
                        })
                    }else {
                        this.$message({type:"error",message:"请选择模板分组"})
                    }
            },
            //修改分组
            mdf_team(){
                if(this.form.group_id) {
                    this.teamTitle = "修改模板分组";
                    this.teamVisable = true;
                    this.$http(api_edit_template, this.form.group_id).then(res=> {
                        this.teamName = res.group_name;
                    }).catch(code=> {
                        console.log(code)
                    })
                }else {
                    this.$message({type:"error",message:"请选择要修改的模板分组"})
                }
            },
            //更改平台
            change_channel(){
                let data={
                    template_type:this.form.template_type,
                    channel_id:this.form.channel_id,
                };
                this.form.group_id='';
                this.content="";
                this.get_team(data);
               this.get_field(data);
            },
            //获取模板列表
            get_team(data){
                this.$http(api_reply_team,data).then(res=>{
                    this.teams=res.data.map(row=>{
                        return {
                            value:row.id,
                            label:row.group_name
                        }
                    })
                }).catch(code=>{
                    console.log(code)
                })
            },
            //获取平台
            get_channel(){
                this.boxs=[];
                this.$http(api_reply_channel).then(res=>{
                    this.boxs=res.map(row=>{
                        return {name:row.title,value:row.id}
                    });
                }).catch(code=>{
                    console.log(code)
                })
            },
            get_field(data){
                this.$http(api_reply_field,data).then(res=>{
                    this.field=res.data.map(row=>{
                        return {label:row.field_val,
                            value:row.field_key}
                    })
                }).catch(code=>{
                    console.log(code)
                })
            },
            change_field(){
                if(!this.current){
                    this.form.content+="${"+this.content+"}"
                }else {
                let head=this.form.content.substring(0,this.current);
                let foot=this.form.content.substring(this.current);
                    this.form.content=head+"${"+this.content+"}"+foot;
                }
            },
            focus(){
                var oTxt1 =this.$refs.textarea.$refs.textarea;
                this.current=0;
                if(oTxt1.selectionStart){
                    this.current= oTxt1.selectionStart;
                }
            },
            change_dialog(val){
                if(!val){
                    this.content="";
                    this.teams=[];
                    this.current=0;
                }
            }
        },
        filters:{
        },
        watch:{
            dialog(val){
              this.$emit("input",val)
            },
            value(val){
                this.dialog=val;
            }
        },
        props:{
            value:{},
            form:{
                require:true,
                type:Object,
            },
            changeNo:{}
        },
        components:{
            pageDialog:require("../../../components/page-dialog.vue").default,
        }
    }
</script>
