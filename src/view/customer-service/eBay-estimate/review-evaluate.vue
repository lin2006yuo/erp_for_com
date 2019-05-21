<template>
    <div class="p-review-evaluate">
        <page-dialog :title="dialogData.titleName" size="small" v-model="dialog" :close-on-click-modal="false" @change="close_dialog">
            <div class="box-wripper">
                <div class="mb-sm" v-if="showAdd">
                    <el-radio class="radio" v-model="radio" label="1">好评</el-radio>
                </div>
                <div class="mb-sm" v-if="showAdd">
                    <el-checkbox v-model="is_random" label="随机从评选模块中挑选评选内容"></el-checkbox>
                </div>
                <div class="mb-sm" v-if="showAdd">
                    <label style="font-weight: bold;">选择评价模板</label>
                    <el-select v-model="template_id" placeholder="请选择评价模板" class="inline" @change="change_temp">
                        <el-option
                                :key="item.template_id"
                                v-for="item in template"
                                :label="item.template_name"
                                :value="item.template_id">
                        </el-option>
                    </el-select>
                </div>
                <div class="mb-sm">
                    <el-form label-width="74px" ref="form" :rules="rules">
                        <el-form-item  :label="dialogData.labelName" required>
                            <el-input class="inline" :maxlength="80" type="textarea" placeholder="输入内容限制80字以内" v-model="content" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div slot="footer">
                <el-button type="primary" size="mini" @click.native="submit" :disabled="content==''">确认</el-button>
                <el-button size="mini" @click.native="dialog = false;">关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .p-review-evaluate{
        .box-wripper{
            padding:10px 10px 20px;
            border:1px solid #BDCDDC;
            background-color:#F1F6FC;
        }
        .el-form-item__label{
            font-weight: bold;
        }
    }

</style>
<script>
    import {api_getTemplates,api_tplContent,api_respond,api_batch_comment,api_comment,api_getTemplate_content} from '../../../api/eBay-estimate'

    export default{
        data(){
            return {
                dialog:false,
                is_random:false,
                template_id:'',
                template:[],
                content:'',
                radio:'1',
                rules:{}

            }
        },
        created(){
        },
        mounted(){
            this.getTemplates()
        },
        methods: {
            //获取评价模板
            getTemplates(){
                let params = {
                    type:1,
                    channel_id:1,
                    template_type:2
                };
                this.$http(api_getTemplates,params).then(res=>{
                    this.template = res.data;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            //改变评价模板下拉框 获得评价内容放入textarea中
            change_temp(){
                if (!this.template_id) {
                    return;
                } else {
                    this.is_random = false;
                }
                let params = {
                    channel_id:1,
                    search_type:'evaluate',
                    template_id:this.template_id
                };
                this.getContent(params);
            },
            getContent(params){
                this.$http(api_getTemplate_content,params).then(res=>{
                    this.content = res.data;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            //确认提交
            submit(){
                if (this.showAdd) {
                    //批量回评
                    if (this.editData.transaction_id===0) {
                        let data = {
                            ids:this.selected_id.length<=0 ?'all':this.selected_id.join(','),
                            text:this.content,
                        };
                        this.$http(api_batch_comment,data).then(res=>{
                            this.$message({
                                message: res.message||res,
                                type: 'success'
                            });
                            this.$emit('change-data',data);
                            this.dialog = false;
                        }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
                    } else {
                        //单个回评
                        let comment = {
                            id:this.selected_id.join(','),
                            text:this.content,
                        };
                        this.$http(api_comment,comment).then(res=>{
                            this.$message({
                                message: res.message||res,
                                type: 'success'
                            });
                            let commentArr = this.selected_id.map(row=>{
                                let obj ={
                                    id:row,
                                }
                                return Object.assign(obj, comment)
                            })
                            this.$emit('change-data',commentArr);
                            this.dialog = false;
                        }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
                    }

                }else{
                    //追评
                    let params = {
                        id:this.selected_id,
                        text:this.content,
                        response_type:1
                    };
                    this.$http(api_respond,params).then(res=>{
                        this.$message({
                            message: res.message||res,
                            type: 'success'
                        });
                        this.$emit('review');
                        this.dialog = false;
                    }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
                }
            },
            //弹框关闭时 清空数据
            close_dialog(val){
                if (!val) {
                    this.is_random = false;
                    this.template_id = '';
                    this.content = '';
                    this.radio = '1';
                }
            }
        },
        filters: {},
        watch: {
            value(val){
                console.log('val',val);
                this.dialog=val;
            },
            dialog(val){
                this.$emit('input',val);
            },
            //监听 随机从评选模块中挑选评选内容 多选框 是否勾选
            is_random(val){
                if (val) {
                    // 勾选则调接口获取模板内容
                    this.template_id = '';
                    let params = {
                        channel_id:1,
                        search_type:'evaluate',
                        is_random:1
                    };
                    this.getContent(params);
                } else {
                    //清空
                    this.content = '';
                }
            }
        },
        computed: {},
        props: {
            value:{},
            editData:{},
            dialogData:{},
            showAdd:{},
            selected_id:{}
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
        }
    }
</script>
