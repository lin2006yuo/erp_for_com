<template>
    <page-dialog :title="title" v-model="show" size="large" @open="open" @cloce="cloce" :close-on-cilck-modal="false">
        <el-form :model="form"
                 label-width="190px"
                 :rules="rules">
            <el-form-item label="添加时间：">
                <span>{{form.create_time|fdatetime}}</span>
            </el-form-item>
            <el-form-item label="更新时间：" v-if="form.updater_id!=='-'">
                <span>{{form.update_time |fdatetime}}</span>
            </el-form-item>
            <el-form-item label="添加人：" v-if="form.updater_id==='-'">
                <span>{{form.creator_id}}</span>
            </el-form-item>
            <el-form-item label="更新人：" v-else>
                <span>{{form.updater_id}}</span>
            </el-form-item>
            <el-form-item label="平台：" prop="channel_id">
                <el-select v-model="form.channel_id"  class="width" @change="change">
                    <el-option v-for="item in channelList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item >
                <div style="display: flex;margin-left: -44px">
                    <span class="red" v-if="!(channel_change===false&&site_change)&&!site_change">*</span>&nbsp;<span>站点：</span>
                    <el-select :disabled="siteOptions.length<=1"
                               class="width"
                               filterable clearable
                               v-model="form.channel_site" @change="select">
                        <el-option v-for="item in siteOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-form-item>
            <div :class="{error_box:true}" v-if="site_error">站点为必填项</div>
            <el-form-item label="网站地址：" prop="website_url">
                <el-col :span="7">
                    <el-input v-model="form.website_url"></el-input>
                </el-col>
            </el-form-item>
        </el-form>
        <div style="height: 70px;">
            <el-row v-for="(item,index) in cloneNode" :key="index">
                <div class="innerbox mlf">
                    <div class="innerbox">
                        <span v-if="index===0" class="red">*</span ><span :class="{mgf:index!==0}">节点：</span>
                        <el-input  class="select-w" v-model="item.node"></el-input>
                    </div>
                    <div class="innerbox ml-sm">
                        <span>节点值：</span>
                        <el-input class="select-w" v-model="item.node_value"></el-input>
                    </div>
                    <label class="inline ml-sm">解析类型：</label>
                    <el-select v-model="item.parsing_type"  class="select-w" >
                        <el-option v-for="item in typeList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                    <label class="inline ml-sm">是否提交：</label>
                    <el-select v-model="item.is_submit"  class="select-w" >
                        <el-option v-for="item in sub"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                    <label class="inline ml-sm" v-if="index===0"><img src="../../../assets/add2.png" alt="" @click="add"></label>
                    <label class="inline ml-sm" v-if="index!==0"><img src="../../../assets/delete.png" alt="" @click="del(index)"></label>
                </div>
            </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="sure">确定</el-button>
            <el-button size="mini" @click.native="cloce">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .error_box{
        color: #FF6A3C;
        width: 100%;
        margin-top: -10px;
        line-height: 14px;
        font-size: 14px;
        margin-left: 188px
    }
    .border{
        border: 1px solid #FF6A3C;
        border-radius: 2px;
    }
    .width{
        width: 260px;
    }
    .mlf{
        margin-left: 148px;
    }
    .innerbox{
        display: flex;
        align-items: center;
    }
    .select-w{
        width: 124px;
    }
</style>
<script>
    import {api_get_channel,api_account_list,api_automatic_update} from '../../../api/platform-automatic-login'
    export default{
        refresh(){
            this.siteOptions=[{label:"",value:""}];
        },
        data(){
            return{
                channel_change:false,
                site_change:false,
                site_s:false,
                site_error:false,
                node:[
                    {
                        node:'',
                        node_value:'',
                        parsing_type:0,
                        is_submit:0
                    },
                ],
                channelList:[],
                siteOptions:[{label:"",value:""}],
                show:this.value,
                typeList:[
                    {label:'正常解析',value:0},
                    {label:'JQ解析',value:1},
                    {label:'Xpath解析',value:2}
                ],
                sub:[
                    {label:'是',value:1},
                    {label:'否',value:0}
                ],
                rules:{
                    channel_id:[
                        {required: true, message: '平台为必填项', trigger: 'change',type:'number'}
                    ],
                },
            }
        },
        methods:{
            add(){
                this.node.push({node:'',node_value:'',parsing_type:0,is_submit:0})
            },
            del(index){
                this.node.splice(index,1)
            },
            select(val){
                if(!!val){
                    this.site_error = false;
                    this.site_s = true
                }else {
                    this.site_s = false;
                    this.site_error = true
                }
            },
            change(){
                this.form.channel_site = '';
            },
            sure(){
                let data ={};
                data.channel_id = this.form.channel_id;
                data.channel_site = this.form.channel_site;
                data.website_url =this.form.website_url;
                data.node_info = this.cloneNode;
                let bolen;
                data.node_info.forEach((row,index,arr)=>{
                    if(arr[0].node===''||arr[0].node_value===''){
                        bolen = true
                    }else {
                        bolen = false
                    }
                });
                if(bolen){
                    this.$message(({message:'节点和节点值必填',type:'error',duration:1500}))
                }else if(this.channel_change&&this.site_s ||this.channel_change&&!!this.form.channel_site){
                    data.node_info = this.node.filter(row=>{
                        return !!row.node||row.node_value
                    });
                    this.$http(api_automatic_update,this.form.id,data).then(res=>{
                        this.$message(({message:res.message||message,type:'success',duration:1500}))
                        setTimeout(()=>{
                            this.show = false;
                            this.$emit('search');
                        },1500);
                    }).catch(code=>{
                        this.$message(({message:code.message||message,type:'warning',duration:1500}))
                    })
                }else if(this.channel_change&&this.site_change){
                    data.node_info = this.node.filter(row=>{
                        return !!row.node||row.node_value
                    });
                    this.$http(api_automatic_update,this.form.id,data).then(res=>{
                        this.$message(({message:res.message||message,type:'success',duration:1500}))
                        setTimeout(()=>{
                            this.show = false;
                            this.$emit('search');
                        },1500);
                    }).catch(code=>{
                        this.$message(({message:code.message||message,type:'warning',duration:1500}))
                    })
                }else if(this.channel_change===false&&this.site_change){
                    data.node_info = this.node.filter(row=>{
                        return !!row.node||row.node_value
                    });
                    this.$http(api_automatic_update,this.form.id,data).then(res=>{
                        this.$message(({message:res.message||message,type:'success',duration:1500}))
                        setTimeout(()=>{
                            this.show = false;
                            this.$emit('search');
                        },1500);
                    }).catch(code=>{
                        this.$message(({message:code.message||message,type:'warning',duration:1500}))
                    })
                } else  if(this.channel_change&&this.site_s===false){
                    this.site_error = true
                }

            },
            open(){
                this.channel_remote();
                this.site_error =false
            },
            cloce(){
                this.show=false
            },
            channel_remote(){
                this.$http(api_get_channel,{}).then(res=>{
                    this.channelList = res;
                }).catch(code=>{
                    this.$message({message:code.message, type:'error'});
                });
            },
            get_site(channel_id){
                if(!channel_id)return this.siteOptions = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.site.length<=0){
                        this.site_change = true;
                        this.siteOptions = [{label:"该平台暂无站点",value:""}]
                        this.site_error = false
                    }else{
                        res = res.site;
                        this.site_change = false;
                        this.channel_change = true;
                        this.siteOptions = [{label:"请选择",value:""},...res];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        computed:{
            cloneNode(){
                if(!!this.form.node_info)return this.node = this.form.node_info;
                else {
                    return this.node
                }
            }
        },
        filters:{
            fdatetime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val)
            }
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            },
            "form.channel_id"(val) {
                this.siteOptions = [{label: "", value: ""}];
                this.get_site(val);
            },
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            title:{
                type:String
            },
            form:{}
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
            selectRemote:require('@/components/select-remote.vue').default,
        }
    }
</script>
