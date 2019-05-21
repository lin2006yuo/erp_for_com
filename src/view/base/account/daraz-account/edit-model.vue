<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="listData"
                 :rules="rules"
                 label-width="210px"
                 ref="listData">
            <el-form-item label="简称：" prop="code">
                <el-col :span="14">
                    <el-input v-model="listData.code"disabled ></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="账号名称：" prop="name">
                <el-col :span="14">
                    <el-input v-model="listData.name" disabled></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="站点：" prop="site">
                <el-col :span="14">
                    <el-select v-model="listData.site"
                               filterable clearable
                               disabled
                               placeholder="请选择">
                        <el-option v-for="item in siteList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取Daraz订单功能：">
                <el-col :span="14">
                    <el-select v-model="listData.download_order">
                        <el-option v-for="item in downloadList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="同步发货状态到Daraz功能：">
                <el-col :span="14">
                    <el-select v-model="listData.sync_delivery">
                        <el-option v-for="item in downloadList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取Listing数据：">
                <el-col :span="14">
                    <el-select v-model="listData.download_listing">
                        <el-option v-for="item in downloadList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="listUser" @click="keep">确 定</request-button>
            <el-button size="mini" @click.native="show=false">取 消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    export default{
        data(){
            return{
                show:this.value,
                rules:{
                    code:[
                        {required: true, message: '简称为必填项', trigger: 'change'}
                    ],
                    name:[
                        {required: true, message: '账号名称为必填项', trigger: 'change' }
                    ],
                    site:[
                        {required: true, message: '站点为必选', trigger: 'change' }
                    ]
                },
            }
        },
        methods:{
            open(){
            
            },
            close(){
                Object.keys(this.listData).forEach(key=>{
                    this.listData[key] = "";
                });
            },
            keep(){
                this.$refs.listData.validate(valid=>{
                    if(valid){
                        this.$emit('submit',this.listData);
                    }else{
                        this.$reqKey('listUser',false)
                    }
                })
            },
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
            title:{},
            listData:{},
            downloadList:{},
            siteList:{}
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>
