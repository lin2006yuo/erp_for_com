<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="addList"
                 label-width="160px"
                 ref="addList"
                 :rules="rules">
            <el-form-item label="服务器IP地址：">
                <el-input class="inline" v-model="addList.ip_address" disabled></el-input>
                <el-button type="primary" size="mini" class="ml-sm" @click.native="dialogShow = true">选择服务器</el-button>
            </el-form-item>
            <el-form-item label="登录邮箱：" prop="wf_account">
                <el-col :span="18">
                    <el-input v-model="addList.wf_account"
                              class="inline"
                              placeholder="请输入邮箱账号"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="登录密码：" prop="wf_password">
                <el-col :span="18">
                    <el-input v-model="addList.wf_password"
                              ref="pwd"
                              type="password"
                              class="inline"
                              placeholder="请输入"></el-input>
                    <img src="../../../../assets/eye.svg"
                         @mouseup="backPassword('pwd')"
                         @mousedown="lookPassword('pwd')"
                         style="vertical-align: middle;width: 20px;height: 20px;">
                </el-col>
            </el-form-item>
            <el-form-item label="密保答案：">
                <el-col :span="18">
                    <el-input v-model="addList.encrypted_answers"
                              type="text"
                              class="inline"
                              placeholder="请输入"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="持有人姓名：" prop="belong">
                <el-col :span="18">
                    <el-input v-model="addList.belong"
                              class="inline"
                              placeholder="请输入"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="操作人：" prop="operator_id">
                <el-col :span="18">
                    <super-select
                            class="inline"
                            v-model="addList.operator_id"
                            :storage-key="`operatoridCreator`"
                            :options="creatorData">
                    </super-select>
                </el-col>
            </el-form-item>
            <choose-server v-model="dialogShow" @choose-server="choose_server"></choose-server>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="submitWF" @click.native="keep" type="primary">确定</request-button>
            <el-button size="mini" @click.native="show=false">取 消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_worldfirst_add} from '@/api/worldfirst'
    export default{
        data(){
            return{
                show:this.value,
                rules:{
                    wf_account:[{required: true, message: '登录邮箱为必填项', trigger: 'blur'}],
                    wf_password:[{required: true, message: '登录密码为必填项', trigger: 'blur'}],
                    belong:[{required: true, message: '持有人姓名为必填项', trigger: 'blur'}],
                    operator_id:[{required: true, message: '操作人为必选项', trigger:"change",type:"number"}],
                },
                dialogShow: false
            }
        },
        methods:{
            open(){

            },
            close(){
                Object.keys(this.addList).forEach(key=>{
                    this.addList[key] = "";
                });
            },
            keep(){
                this.$refs.addList.validate((bool)=>{
                    if(bool){
                        this.$http(api_worldfirst_add,this.addList).then(succ=>{
                            this.$message({type:'success', message:succ.message||succ});
                            this.$emit('submit');
                            this.show = false;
                        }).catch(fail=>{
                            this.$message({type:'error', message:fail.message||fail});
                            this.show = true;
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('submitWF', false);
                            }, 300)
                        })
                    }else{
                        this.$reqKey('submitWF', false);
                    }
                })
            },
            //选择服务器
            choose_server(obj){
                this.addList.ip_address = obj.ip;
                this.addList.ip_name=obj.name;
                this.addList.server_id=obj.id;
            },
            lookPassword(type){
                this.$refs[type].$refs.input.type = 'text';
            },
            backPassword(type){
                this.$refs[type].$refs.input.type = 'password';
            }
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
            addList:{},
            title:{},
            creatorData:{}
        },
        components:{
            chooseServer:require('../paypal/choose-server').default,
            pageDialog:require('@/components/page-dialog.vue').default
        }
    }
</script>