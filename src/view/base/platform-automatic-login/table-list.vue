<template>
    <div>
        <el-table :data="tableData.lists" border  class="mb-sm scroll-bar"  v-loading="loading"
                  v-resize="{height:41}"
                  element-loading-text="玩命加载中..."
                  @selection-change="selection_change"
                  style="width: 100%"
                  tooltip-effect="dark"
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column  label="ID" width="85" prop="id">

            </el-table-column>
            <el-table-column  label="平台" prop="channel_name">

            </el-table-column>
            <el-table-column  label="站点" >
                <template slot-scope="scope">
                    <span v-if="!!scope.row.channel_site">{{scope.row.channel_site}}</span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column  label="网站地址"  prop="website_url" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="是否为主网址">
                <template slot-scope="scope">
                    <span v-if="scope.row.first_site === 1" class="green">√</span>
                </template>
            </el-table-column>
            <el-table-column  label="添加时间">
                <template slot-scope="scope">
                    <span>{{scope.row.create_time|fdatetime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="更新人" prop="creator_id" inline-template>
                <span v-if="row.updater_id==='-'">
                    {{row.creator_id}}
                </span>
                <span v-else>
                    {{row.updater_id}}
                </span>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <div>
                    <span class="operate" @click="site(row,row.first_site)">{{row.first_site ? '取消主网址':'设为主网址'}}</span>
                    &nbsp;|&nbsp;
                    <span class="operate"  @click="edit(row)">编辑</span>
                    &nbsp;|&nbsp;
                    <span class="operate" @click="del(row)">删除</span>
                </div>
            </el-table-column>
        </el-table>
    </div>
</template>
<style scoped>
    .green {
        color: green;
    }
    .gray{
        color: gray;
    }
    .disabled{
        pointer-events:none;
    }
</style>
<script>
    import {api_node_first_site} from '@/api/platform-automatic-login'

    export default {
        data(){
            return{
                title:'',
                setType:''
            }
        },
        computed: {
            emptyText() {
                return this.firstTime ? '请查询数据' : '暂无数据'
            }
        },
        methods: {
            selection_change(val){

            },
            del(val){
                this.$emit('del',val)
            },
            edit(val){
                this.$emit('edit',val)
            },
            site(row,val){
                if(val){
                    this.title = `你将${row.channel_name}平台取消主网址，确认此操作吗？`;
                    this.setType = 0;
                }else {
                    this.title = `你将${row.channel_name}平台设置为主网址，确认此操作吗？`;
                    this.setType = 1;
                }
                let data = {
                    id:row.id,
                    setType:this.setType
                }
                this.$confirm(`${this.title}`,'提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    this.$http(api_node_first_site,data).then(res=>{
                        this.$emit('submit');
                        this.$message({type: 'success', message:res.message || res});
                    }).catch(err=>{
                        console.log(err)
                    })
                }).catch(()=>{
                    this.$message({type: 'info', message: '已取消设置'});
                })
            }
        },
        filters:{
            fdatetime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val)
            }
        },
        props: {
            tableData: {

            },
            loading: {
                type: Boolean,
                default: false
            },
            firstTime: {
                type: Boolean,
                default: true
            }
        },
    }
</script>