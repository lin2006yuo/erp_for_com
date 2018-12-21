<template>
    <div>
        <page-dialog :title="action.title"
                     size="small"
                     v-model="visible"
                     @open="open"
                     :close-on-click-modal="false">
            <el-form :model="serverData">
                <el-form-item label="类型：" label-width="100px">
                    <el-col :span="12">
                        <el-select v-model="serverData.type" >
                            <el-option
                                    v-for="item in typeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="IP类型：" label-width="100px">
                    <el-col :span="12">
                        <el-select v-model="serverData.ip_type" placeholder="请选择" @change="change" :disabled="serverData.type!==0">
                            <el-option
                                    v-for="item in ipTypeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="外网IP：" label-width="100px">
                    <el-col :span="12">
                        <el-input v-model="serverData.network_ip" :disabled="disable||serverData.ip_type===1||serverData.type!==0"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="服务器名：" label-width="100px" required>
                    <el-col :span="12">
                        <el-input v-model="serverData.name" ></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="IP地址：" label-width="100px" required>
                    <el-col :span="12">
                        <el-input v-model="serverData.ip"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="MAC地址：" label-width="100px" required>
                    <el-col :span="12">
                        <el-input v-model="serverData.mac" :disabled="serverData.type!==0"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="域名：" label-width="100px">
                    <el-col :span="12">
                        <el-input v-model="serverData.domain" :disabled="serverData.type!==0"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="管理员名称：" label-width="100px">
                    <el-col :span="12">
                        <el-input v-model="serverData.admin" :disabled="serverData.type!==0"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="密码：" label-width="100px">
                    <el-col :span="12">
                        <el-input v-model="serverData.password" type="password" :disabled="serverData.type!==0"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="上报周期：" label-width="100px">
                    <el-col :span="12">
                        <integer-input v-model="serverData.reporting_cycle" :min="1" :disabled="serverData.type!==0"></integer-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <request-button @click="sure" req-key="addEditServer">确 定</request-button>
                <el-button size="mini" @click.native="visible = false">取 消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_add_server, api_update_server} from '../../../api/server-management'
    export default {
        data(){
            return {
                visible: false,
                disable:false,
                typeList:[
                    {label:'虚拟机', value:0},
                    {label:'云服务', value:1},
                    {label:'超级浏览器', value:2},

                ],
                ipTypeList:[
                    {label:'静态', value:0},
                    {label:'动态', value:1}
                ],
                oldPassword:''
            }
        },
        mounted(){
        },
        methods: {
            change(val){
                if(!!val){
                    this.disable = true
                }else {
                    this.disable = false
                }
            },
            open(){
                this.oldPassword = window.clone(this.serverData.password);
            },
            sure(){
                if(this.serverData.mac.indexOf(':') !== -1){
                    let arr = this.serverData.mac.split(':');
                    this.serverData.mac = arr.join('-');
                }
                this.serverData.mac = this.serverData.mac.toUpperCase();
                let temp =  /[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}/;
                let exp=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                if(exp.test(this.serverData.ip)){
                    if(temp.test(this.serverData.mac)||this.serverData.type!==0){
                        let data = {
                            id: this.serverData.id,
                            name: this.serverData.name,
                            ip: this.serverData.ip,
                            mac: this.serverData.mac,
                            domain:this.serverData.domain,
                            type: this.serverData.type,
                            admin: this.serverData.admin,
                            password: this.serverData.password,
                            reporting_cycle: this.serverData.reporting_cycle,
                            network_ip: this.serverData.network_ip,
                            ip_type: this.serverData.ip_type
                        };
                        if(this.action.type === 'add'){
                            delete data.id;
                            this.$http(api_add_server, data).then(res=>{
                                this.visible = false;
                                this.$message({type:"success",message:res.message||res});
                                this.$emit('add-update',res.id,data);
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message || code});
                            }).finally(()=>{
                                setTimeout(() => {
                                    this.$reqKey('addEditServer', false);
                                    this.$emit('search')
                                }, 300)
                            });
                        } else if(this.action.type === 'edit'){
                            this.$http(api_update_server, this.serverData.id, data).then(res=>{
                                this.visible = false;
                                this.$message({type:"success",message:res.message||res});
                                this.$set(data,'create_time',this.serverData.create_time);
                                this.$emit('edit-update',this.serverData.id,data);
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message || code});
                            }).finally(()=>{
                                setTimeout(() => {
                                    this.$reqKey('addEditServer', false);
                                    this.$emit('search')
                                }, 300)
                            });
                        }
                        // if(this.serverData.ip_type === 0&&this.serverData.network_ip === ''){
                        //     this.$reqKey('addEditServer', false);
                        //     this.$message({type:"error",message:'IP类型为静态时，外网IP为必填项'})
                        // }else{
                        //
                        // }

                    } else {
                        this.$reqKey('addEditServer', false);
                        this.$message({type:"error",message:'请输入正确的MAC地址'})
                    }
                } else {
                    this.$reqKey('addEditServer', false);
                    this.$message({type:"error",message:'请输入正确的ip地址'})
                }
            }
        },
        computed: {},
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value:{},
            serverData:{},
            action:{}
        },
        components: {
            pageDialog:require("../../../components/page-dialog.vue").default,
            requestButton:require('../../../global-components/request-button').default,
            integerInput:require('../../../components/integer-input.vue').default,
        },
    }
</script>
