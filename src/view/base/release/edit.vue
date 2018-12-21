<template>
    <page-dialog v-model="show" size="large" :title="mdfTitle">
        <el-card>
            <el-form label-width="120px">
                <el-form-item label="标题：">
                    <el-input v-model="title"></el-input>
                </el-form-item>
                <el-form-item label="发布者：">
                    <el-input v-model="author"></el-input>
                </el-form-item>
                <el-form-item label="版本号：">
                    <el-input v-model="version"></el-input>
                </el-form-item>
                <el-form-item label="类型：">
                    <el-select v-model="type">
                        <el-option v-for="type in vtypes"
                                   :key="type.value"
                                   :label="type.label"
                                   :value="type.value"
                        >

                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-select v-model="status">
                        <el-option v-for="status in vstatuses"
                                   :key="status.value"
                                   :label="status.label"
                                   :value="status.value"
                        >

                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发布时间：">
                    <el-date-picker type="datetime" placeholder="选择发布时间" v-model="release_time">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="版本明细：">
                    <el-table :data="items">
                        <el-table-column label="类型" inline-template>
                            <el-select v-model="row.type" class="inline">
                                <el-option v-for="type in types"
                                           :label="type.label"
                                           :value="type.value"
                                           :key="type.value"
                                ></el-option>
                            </el-select>
                        </el-table-column>
                        <el-table-column label="描述" inline-template>
                            <el-input type="textarea" v-model="row.desc" class="inline"></el-input>
                        </el-table-column>
                        <el-table-column label="相关角色" inline-template>
                            <at-roles v-model="row.at_roles" class="inline"></at-roles>
                        </el-table-column>
                        <el-table-column label="开发者" inline-template>
                            <el-input v-model="row.dev_authors" class="inline"></el-input>
                        </el-table-column>
                        <el-table-column label="操作" inline-template>
                            <el-button icon="close"
                                       type="danger"
                                       size="mini"
                                       @click.native="remove_item(row)"
                            ></el-button>
                        </el-table-column>
                    </el-table>
                    <el-button size="mini" type="primary" @click.native="add_item">添加</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <div slot="footer">
            <el-button @click.native="submit" size="mini" type="primary" :disabled="canSave">确定</el-button>
            <el-button @click.native="show=false" size="mini" type="primary">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>

    import {api_create,api_read,api_update} from '../../../api/release';
    export default{
        data(){
            return{
                show:this.value,
                title:'',
                author:'',
                version:'',
                type:'',
                status:'',
                vstatuses:[//1为已发布，2为审核通过，5为新增
                    {label:'已发布',value:1},
                    {label:'审核通过',value:2},
                    {label:'新增',value:5},
                ],
                release_time:'',
                dev_authors: '',
                at_roles: [],
                items:[],
                vtypes:[//1为紧急重要;2为重要;3紧急;4不紧不重要
                    {label:'紧急重要',value:1},
                    {label:'重要',value:2},
                    {label:'紧急',value:3},
                    {label:'不紧不重要',value:4},
                ],
                types:[
                    {label:'BUG',value:2},
                    {label:'NEW',value:1},
                    {label:'CHANGE',value:3},
                ]
            }
        },
        methods:{
            add_item(){
                this.items.push({
                    type:3,
                    desc:'',
                    at_roles:[],
                    dev_authors:''
                })
            },
            remove_item(row){
                const index = this.items.indexOf(row);
                this.items.splice(index, 1);
            },
            submit(){
                let params = {
                    author:this.author,
                    type:this.type,
                    title:this.title,
                    version:this.version,
                    status:this.status,
                    release_time:this.release_time.toString(),
                    items:this.items
                };
                let result = null;
                if(this.mdfId){
                    result = this.$http(api_update, this.mdfId, params)
                }else{
                    result = this.$http(api_create, params)
                }
                result.then(res=>{
                    this.$message(res.message);
                    this.show = false;
                    if(res.id){
                        params.id = res.id;
                        this.$emit('update', params)
                    }else{
                        params.id = this.mdfId.id;
                        this.$emit('update', params)
                    }
                }).catch(code => {
                    this.$mesage({message:code.message, type:'error'})
                })
            }
        },
        computed:{
            canSave(){
                if(!this.version){
                    return true;
                }
                if(!this.author){
                    return true;
                }
                if(!this.title){
                    return true;
                }
                if(!this.release_time){
                    return true;
                }
                return this.items.length <= 0;
            }
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
                if(!val){
                    this.author = '';
                    this.release_time = '';
                    this.title = '';
                    this.at_roles = [];
                    this.dev_authors = '';
                    this.items = [];
                }
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            mdfId:{
                required:true,
                type:Number
            },
            mdfTitle:{
                required:true,
                type:String
            }
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default,
            atRoles:require('../../../api-components/at-roles.vue').default
        }
    }
</script>
