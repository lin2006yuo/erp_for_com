<template>
    <page>
        <el-card class="mb-sm">
            <el-button size="mini" @click.native="addVersion" type="primary">添加版本</el-button>
        </el-card>
        <el-card>
            <el-table :data="freleases" v-loading="loading" element-loading-text="玩命加载中...">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-table :data="props.row.items">
                            <el-table-column label="" inline-template width="48">
                                <span>&nbsp;</span>
                            </el-table-column>
                            <el-table-column property="type" label="类型" >
                            </el-table-column>
                            <el-table-column property="desc" label="描述">
                            </el-table-column>
                            <el-table-column property="at_roles" label="有关角色">
                            </el-table-column>
                            <el-table-column property="dev_authors" label="开发者">
                            </el-table-column>
                            <el-table-column label="" inline-template>
                                <span>&nbsp;</span>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column label="标题" property="title">
                </el-table-column>
                <el-table-column label="发布者" property="author">
                </el-table-column>
                <el-table-column label="版本号" property="version">
                </el-table-column>
                <el-table-column label="状态" inline-template>
                    <span>{{row.status|status}}</span>
                </el-table-column>
                <el-table-column label="操作" inline-template>
                    <div>
                        <span class="btn" v-for="operate in operates"
                              @click="action(row, operate)"
                        >
                            {{operate.label}}
                        </span>
                    </div>
                </el-table-column>
            </el-table>
        </el-card>
        <edit v-model="editShow" :mdf-id="mdfId" :mdf-title="mdfTitle"></edit>
        <version-info v-model="infoShow" @update="updateVersion"></version-info>
    </page>
</template>
<style lang="stylus">
    .el-table td{
        padding:0;
        .el-table td{
            padding:0 5px;
        }
    }
</style>
<script>

    import {api_list, api_remove} from '../../../api/release';
    export default{
        page:{},
        refresh(){
            this.init();
        },
        data(){
            return{
                mdfId:0,
                editShow:false,
                infoShow:false,
                loading:true,
                releases:[],
                mdfTitle:""
            }
        },
        filters:{
            status(val){
                switch (val){
                    case 1:return '已发布';
                    case 2:return '审核通过';
                    case 3:return '审核失败';
                    case 5:return '新增';
                }
            }
        },
        created(){
            this.init();
        },
        methods:{
            addVersion(){
                this.mdfTitle = '添加';
                this.editShow = true;
            },
            updateVersion(version){
                this.$set(this.releases, version.id, version);
            },
            action(row, operate){
                operate.action.call(this, row);
            },
            init(){
                this.loading = true;
                this.$http(api_list).then(res=>{
                    this.releases = res;
                    this.loading = false;
                }).catch(code =>{
                    this.$message({type:'error',message:code.message});
                    this.loading = false;
                })

            }
        },
        computed:{
            freleases(){
                return this.releases;
            },
            operates(){
                return [
                    {label:'编辑',action(row){
                        this.mdfId = row.id;
                        this.mdfTitle = '编辑';
                        this.editShow = true;
                    }},
                    {label:'删除',action(row){
                        this.$prompt('确定删除版本？', '确定输入YES', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            inputPattern: /^(yes|no)$/i,
                        }).then(({value}) => {
                            this.$http(api_remove, row.id).then(res => {
                                this.$message({
                                    type: 'success',
                                    message: res.message || res
                                });
                                const index = this.releases.indexOf(row);
                                this.releases.splice(index, 1);
                            }).catch(code => {
                                console.error(code);
                            })

                        }).catch(() => {
                        });
                    }},
                ]
            },
        },
        components:{
            edit:require('./edit.vue').default,
            versionInfo:require('./version-info.vue').default,
        }
    }
</script>
