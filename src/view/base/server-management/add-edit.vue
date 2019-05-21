<template>
    <div>
        <page-dialog :title="action.title"
                     size="small"
                     v-model="visible"
                     @change="open_dialog"
                     @open="open"
                     :close-on-click-modal="false">
            <el-form :model="serverData" label-width="120px" >
                <el-form-item label="类型：" >
                    <el-col :span="12">
                        <el-select v-model="serverData.type" @change="change_type" :disabled="isDisabled">
                            <el-option
                                    v-for="item in typeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
            </el-form>
            <!--***这里分开写的原因是类型切换的时候：1，dom没有更新仍然会有error信息显示，2，验证时会出现遗漏或者未输入也验证通过-->
            <div v-for="item in actionShow" :key="item.id">
                <component :is="item.component"
                           :form="serverData"
                           :title="action.title"
                           :type="action.type"
                           ref="server">
                </component>
            </div>
            <div slot="footer" class="dialog-footer">
                <request-button @click="submit" req-key="addEditServer">确 定</request-button>
                <el-button size="mini" @click.native="visible = false">取 消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_add_server, api_update_server} from '../../../api/server-management';
    import {actions} from './action';
    export default {
        data(){
            return {
                visible: false,
                typeList:[
                    {label:'虚拟机', value:0},
                    {label:'云服务', value:1},
                    {label:'超级浏览器', value:2},
                    {label:'代理', value:3},
                ],
                actions,
            }
        },
        methods: {
            open_dialog(isOpen){
                if(isOpen){
                    this.actions.forEach(row=>{
                        this.$set(row,'show',false);
                    });
                    if(this.action.type ==='add'){
                        this.actions[0].show=true
                    }else if(this.action.type === 'edit'){
                        this.actions[this.serverData.type].show=true;
                    }
                }
            },
            change_type(val){
                this.actions.forEach((row,index)=>{
                    if(val===index){
                        row.show=true
                    }else{
                        row.show=false;
                    }
                });
            },
            open(){
                this.oldPassword = window.clone(this.serverData.password);
            },
            submit(){
                let validator=this.$refs.server[0].validator;
                if(validator){
                    let valid=this.$refs.server[0].validator();
                    if(valid){
                        let param={
                            type:this.serverData.type,
                            name:this.serverData.name,
                            ip:this.serverData.ip,
                            admin:this.serverData.admin,
                            password:this.serverData.password,
                            user_agent:this.serverData.user_agent
                        };
                        switch (this.serverData.type){
                            case 0:
                                Object.assign(param,{
                                    ip_type:this.serverData.ip_type,
                                    network_ip:this.serverData.network_ip,
                                    mac:this.serverData.mac,
                                    domain:this.serverData.domain,
                                    admin:this.serverData.admin,
                                    password:this.serverData.password,
                                    reporting_cycle:this.serverData.reporting_cycle,
                                    thread_quantity:this.serverData.thread_quantity,
                                    gateway:this.serverData.gateway,
                                    proxy_ip:this.serverData.proxy_ip,
                                    proxy_agent:this.serverData.proxy_agent,
                                    proxy_port:this.serverData.proxy_port,
                                    proxy_user_name:this.serverData.proxy_user_name,
                                    proxy_user_password:this.serverData.proxy_user_password
                                });
                                break;
                            case 1||2:
                                break;
                            case 3:
                                Object.assign(param,{
                                    proxy_ip:this.serverData.proxy_ip,
                                    proxy_agent:this.serverData.proxy_agent,
                                    proxy_port:this.serverData.proxy_port,
                                    proxy_user_name:this.serverData.proxy_user_name,
                                    proxy_user_password:this.serverData.proxy_user_password
                                });
                                break;
                        }
                        switch (this.action.type){
                            case 'add':
                                this.$http(api_add_server,param).then(res=>{
                                    this.$message({type:"success",message:res.message||res});
                                    this.visible = false;
                                    this.$emit('update');
                                }).catch( error =>{
                                    error&&this.$message({type:'error', message:error.message||error});
                                });
                                break;
                            case 'edit':
                                this.$http(api_update_server,this.serverData.id,param).then(res=>{
                                    this.$message({type:"success",message:res.message||res});
                                    this.visible = false;
                                    this.$emit('update');
                                }).catch( error =>{
                                    error&&this.$message({type:'error', message:error.message||error});
                                });
                                break;
                        }
                    }
                }
                this.$reqKey('addEditServer',false);
            },
        },
        computed: {
            actionShow(){
                return this.actions.filter(row=>row.show);
            },
            isDisabled(){
                return this.action.title.includes('编辑');
            },
        },
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
            action:{},
        },
        components: {
            requestButton:require('../../../global-components/request-button').default,
        },
    }
</script>
