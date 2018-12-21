<template>
    <div class="c-goods-declare">
        <page-dialog v-model="dialog" :title="title" size="large" :close-on-click-modal="false">
            <el-form :model="form"
                     class="mt-sm"
                     ref="addEditform"
                     label-width="200px"
                     :rules="rules">
                <el-form-item label="SKU：" prop="sku">
                    <el-input v-model="form.sku"
                               class="long-input"
                              :disabled="handleName!=='add'">
                    </el-input>
                </el-form-item>
                <el-form-item label="申报价：" prop="declare_price">
                    <ui-limit-number v-model="form.declare_price"
                                      :disabled="isLook"
                                      class="long-input"
                                      :limit="2">
                    </ui-limit-number>
                </el-form-item>
                <el-form-item label="标题：" prop="title">
                    <el-input v-model="form.title"
                               class="long-input"
                               :disabled="isLook">
                    </el-input>
                </el-form-item>
                <el-form-item label="商品描述：" prop="desc">
                    <el-input v-model="form.desc"
                               class="long-input"
                               :disabled="isLook">
                    </el-input>
                </el-form-item>
                <el-form-item label="展示图片：" v-if="isLook">
                    <img :src="filterImg(form.thumb)" style="width:100px;height:100px">
                </el-form-item>
                <el-form-item label="图片列表：" v-if="thumbList.length > 0 && !isLook && !isAdd" prop="thumb">
                    <ul>
                        <li v-for="(item, index) in thumbList" :key="index" class="fl allli" @click="setMain(item)">
                            <div class="mian-pic" v-if="form.path === item.path"></div>
                            <img v-lazy="item.thumb" style="width: 100px;height: 100px;">
                            <p class="tool">设置为展示图片</p>
                        </li>
                    </ul>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <!--添加页面按钮-->
                    <request-button v-if="handleName!=='look'"
                               class="inline"
                               req-key="addEditName"
                               @click="add">{{comName}}</request-button>
                    <el-button size="mini"
                               v-if="handleName!=='look'"
                               class="inline"
                               @click.native="dialog = false">取消</el-button>
                <!--查看页面按钮-->
                <el-button size="mini"
                           v-if="handleName==='look'"
                           @click.native="dialog = false"
                           class="inline" >关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .c-goods-declare{
        .allli{
            height:100px;
            width:100px;
            display: inline-block;
            position:relative;
            border: 1px solid #CFCFCF;
            transition:all .3s ease;
            color: white;
            &:hover{
                cursor: pointer;
            }
            &:hover .tool{
                height:30px;
            }
        }
        .tool {
            position: absolute;
            bottom:-14px;
            left: 0;
            width: 100%;
            height: 0;
            background-color: rgba(0, 0, 0, .5);
            text-align: center;
            overflow :hidden;
            transition:all .3s ease;
        }
        .long-input{
            width: 600px !important;
        }
    }
</style>
<script>
    import {api_add_goods_declare,
        api_update_goods_declare} from '../../../api/goods-declare'
    export default {
        data() {
            return {
                dialog:this.value,
                rules:{
                    sku:[
                        {required:true,message:"sku为必填项",trigger:'change'}
                    ],
                    declare_price:[
                        {required:true,message:"申报价为必填项",trigger:'change'}
                    ],
                    desc:[
                        {required:true,message:"描述为必填项",trigger:'change'}
                    ],
                    title:[
                        {required:true,message:"标题为必填项",trigger:'change'}
                    ],
                    thumb:[
                        {required:true,message:"请选择要展示的图片",trigger:'change'}
                    ]
                },
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        computed:{
            isAdd(){
                return this.handleName==='add';
            },
            isLook(){
                return this.handleName==='look';
            },
            comName(){
                if(!this.handleName)return;
                if(this.handleName==='add'){
                    return '添加';
                }else if(this.handleName==='edit'){
                    return '更新';
                }
            },

        },
        filter:{

        },
        methods:{
            filterImg(val){
                return val.replace('_60x60.','_100x100.');
            },
            add(){
                this.$refs.addEditform.validate((b)=>{
                    if(b){
                        let cloneForm = clone(this.form);
                        if(this.handleName==='edit'){
                            delete cloneForm.sku;
                        }
                        if(this.handleName==='edit'){
                            this.$http(api_update_goods_declare,cloneForm.id,cloneForm).then(res=>{
                                this.dialog = false;
                                this.$message({type:"success",message:res.message||res});
                                this.$emit('edit-update', cloneForm);
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message||code});
                            }).finally(()=>{
                                setTimeout(() => {
                                    this.$reqKey('addEditName', false);
                                }, 300)
                            });
                        }else{
                            this.$http(api_add_goods_declare,cloneForm).then(res=>{
                                this.dialog = false;
                                this.$message({type:"success",message:res.message||res});
                                this.$emit('edit-update',res.data[0]);
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message||code});
                            }).finally(()=>{
                                setTimeout(() => {
                                    this.$reqKey('addEditName', false);
                                }, 300)
                            });
                        }
                    }else{
                        setTimeout(() => {
                            this.$reqKey('addEditName', false);
                        }, 300)
                    }
                });
            },
            setMain(item){
                this.form.path = item.path;
                this.$forceUpdate();
            }
        },
        props:{
            value:{},
            form:{
                required:true,
                type:Object
            },
            title:{},
            handleName:{
                required:true,
                type:String
            },
            thumbList:{}
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            uiLimitNumber:require('../../../components/ui-limit-number.vue').default,
        }
    }
</script>
