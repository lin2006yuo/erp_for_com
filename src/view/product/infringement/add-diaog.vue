<template>
    <page-dialog
        width="800px"
        @close="close"
        @open="open"
        v-model="tort_dialog"
        :title="title">
        <el-form :model="public" :rules="rules" ref="public" label-width="80px" class="demo-ruleForm formbox">
            <el-form-item label="SPU：" prop="spu">
                <el-input v-model="public.spu" style="width:200px" placeholder="请输入SPU" :disabled="edit||look"></el-input>
            </el-form-item>
            <el-form-item label="平台：" prop="channel_id" >
                <super-select
                    style="width:200px"
                    v-model="public.channel_id"
                    @change="change"
                    placeholder="请选择平台"
                    :options="platform"
                    storageKey="platform"
                ></super-select>
            </el-form-item>
            <el-form-item label="站点："  prop="site_code" ref="siteCode">
                <super-select
                    style="width:200px"
                    v-model="public.site_code"
                    :options="platformchildrenTypeArr"
                    :placeholder="stie_placeholder"
                    :disabled="platformchildrenTypeArr.length<=0"
                    storageKey="platformchildrenTypeArr"
                ></super-select>
            </el-form-item>
            <el-form-item label="账号简称：" prop="account_id" >
                <super-select
                    style="width:200px"
                    v-model="public.account_id"
                    placeholder="请选择账号简称"
                    :options="account"
                    :disabled="account.length<=0"
                    storageKey="tortAccount"
                ></super-select>
            </el-form-item>
            <el-form-item label="侵权时间：" prop="tort_time">
                <el-date-picker v-model="public.tort_time" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="侵权类型："  prop="tort_type">
                <el-select v-model="public.tort_type" clearable placeholder="请选择侵权类型" style="width:200px">
                    <el-option
                        v-for="item in infringementSearchArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="侵权描述：" prop="remark">
                <el-input type="textarea" autosize v-model="public.remark" style="width:400px;" :autosize="{ minRows: 5}" placeholder="请输入侵权描述"></el-input>
            </el-form-item>
            <el-form-item label="侵权邮件：" prop="email_content" >
                <editor id="10"
                        :content="public.email_content"
                        :items="curItems"
                        bodyClass="new-ke-kindeditor"
                        :filterMode="false"
                        :loadStyleMode="false"
                        @on-content-change="onContentChange">
                </editor>
                <el-button type="primary ml-xxs" size="mini" class="inline"
                           @click.native="add_img_local">添加图片
                </el-button>
                <input type="file" ref="input"
                       hidden @change="handleChange"
                       :multiple="true"
                       accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
            </el-form-item>
        </el-form>
        <div class="block" style="text-align: right;margin-right: 50px;">
            <request-button
                class="inline"
                req-key="apiUpdate"
                @click="add_chack"
                :timeout='num'>确定</request-button>
            <el-button  size="mini" class="inline"
                       @click.native="close">取消
            </el-button>
        </div>
    </page-dialog>
</template>

<script>
    import {
        api_account_list
    } from '@/api/order-local';
    import {api_add_tort_emailphote} from '@/api/product';
    export default {
        data(){
            var date = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('时间不能为空'));
                }
                let now_time=new Date().getTime();
                    if (new Date(value).getTime()>now_time) {
                        callback(new Error('时间不能大于当前时间'));
                    } else {
                        callback();
                    }
            };
          return{
              tort_dialog: this.value,
              curItems: [
                  'source', '|', 'undo', 'redo', '|', 'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
                  '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'indent', 'outdent', 'hr', 'removeformat', '|'
                  , 'link', 'unlink', 'table',
              ],
              site_code:'site_code',
              rules: {
                  spu: [{required: true, message: '请输入SPU'}],
                  channel_id: [{required: true, message: '平台必填'}],
                  site_code: [{required: true, message: '站点必填'}],
                  account_id: [{required: true, message: '账号简称必填'}],
                  tort_time: [{ validator: date, trigger: 'blur',required:true}],
                  tort_type: [{required: true, message: '侵权类型必填'}],
                  remark: [{required: true, message: '侵权描述必填'}],
                  email_content: [{require: false}]
              },
              platformchildrenTypeArr: [],
              account:[],
              infringementSearchArr:[{label:'图片侵权',value:'图片侵权'},{label:'商标侵权',value:'商标侵权'},{label:'著作权侵权',value:'著作权侵权'},{label:'外观设计侵权',value:'外观设计侵权'},{label:'禁限售产品',value:'禁限售产品'},{label:'其他知识产权侵权',value:"其他知识产权侵权"}],
              now_value:null,
              stie_placeholder:"请选择站点",
              img_arr:[],
          }
        },
        methods:{
            add_chack(){
                this.$refs['public'].validate((valid) => {
                    if (valid) {
                        this.Loading=true;
                        this.$reqKey(`apiUpdate`, true);
                        if(this.edit){
                            this.$emit('edit',this.public,this.img_arr)
                        }else{
                            this.$emit('addCheck',this.public,this.img_arr);
                        }
                    } else {
                        this.$reqKey(`apiUpdate`, false);
                        return false;
                    }
                });
            },
            change(channel_id){
                if(this.now_value!=null){
                    this.public.site_code='';
                    this.public.tort_account='';
                }
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    this.platformchildrenTypeArr = [...res.site];
                    this.account=[...res.account];
                    if(this.platformchildrenTypeArr.length==0){
                        this.rules.site_code[0].required=false;
                        this.stie_placeholder="该平台没有站点";
                        this.$refs.siteCode.validateState = '';
                    }else{
                        this.rules.site_code[0].required=true;
                        this.stie_placeholder="请选择站点"
                    }
                    if(this.account.length==0){
                        this.rules.account_id[0].required=false;
                    }else{
                        this.rules.account_id[0].required=true;
                    }
                    this.now_value=channel_id;
                }).catch(code=>{
                    console.log(code);
                })
            },
            open(){
                this.$reqKey(`apiUpdate`, false);
                if(this.edit){
                    this.change(this.public.channel_id);
                }
                this.img_arr=[];
            },
            close(){
                this.tort_dialog=false;
                this.platformchildrenTypeArr=[];
                this.account=[];
                this.now_value=null;
                this.$emit('close');
            },
            handleChange(ev){
                const files = ev.target.files;
                if (!files) {
                    return;
                }
                let fileArr = Array.prototype.slice.call(files);
                fileArr.forEach((file, index) => {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e) => {
                        let imgs = e.target.result;
                        if(imgs){
                            this.$http(api_add_tort_emailphote,{content:imgs}).then(res=>{
                                this.img_arr.push({unique_code:res.unique_code,path:res.path});
                                let pa=res.path.replace('/srv/www/erp_admin/public',"");
                                let img = `<img src="${config.apiHost}${pa}"  style='width:500px;'/>`;
                                KindEditor.insertHtml(`#10`, img);
                            }).catch(code=>{
                                this.$message({
                                    type:'error',
                                    message:code.message || code
                                });
                            });
                        }
                    }
                });
            },
            onContentChange(val){
                this.$emit('onchange',val);
            },
            add_img_local(){
                this.$refs.input.click();
            },
        },
        watch:{
            value(val){
                this.tort_dialog = val;
            },
            tort_dialog(val){
                this.$emit('input',val)
            },
        },
        computed:{
            num(){
                return 5000
            },
        },
        props:{
            value:Boolean,
            title:{
                required: true,
                type: String
            },
            public:{
                require:true,
                type:Object
            },
            platform:{
                require:true,
                type:Array
            },
            edit:{
                require:true,
                type:Boolean,
            },
            look:{
                default(){
                    return false;
                }
            }
        },
        components:{
            pageDialog:require("@/components/page-dialog").default,
            RequestButton: require('@/global-components/request-button').default,
        }
    }
</script>

<style scoped lang="stylus">
    .formbox{
        width: 750px;
        margin 25px auto;
    }
    .block{
        text-align right;
        margin-right 50px;
    }
</style>
