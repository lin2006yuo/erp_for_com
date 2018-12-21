<template>
    <page-dialog title="选择服务器"
                 @open="open"
                 v-model="visible"
                 size="large"
                 class="p-account-information"
                 :close-on-click-modal="false">
        <el-row>
            <label>服务器名：</label>
            <el-input class="inline" v-model="serverData.name"></el-input>
            <el-button class="inline" size="mini" @click.native="search" type="primary">搜索</el-button>
        </el-row>
        <el-row>
            <el-table
                    class="scroll-bar mt-sm"
                    :height="540"
                    v-resize="{height:41}"
                    v-loading="loading"
                    element-loading-text="玩命加载中..."
                    :data="tableData"
                    highlight-current-row>
                <el-table-column width="50">
                    <template slot-scope="scope">
                        <el-radio v-model="serverRadio" :label="scope.row.id" @change.native="getServerRow(scope.$index,scope.row)">&nbsp</el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="服务器名">
                </el-table-column>
                <el-table-column prop="ip" label="IP地址">
                </el-table-column>
                <el-table-column prop="mac" label="MAC地址">
                </el-table-column>
                <el-table-column label="类型" inline-template>
                    <div>
                        <span>{{row.type | type_filter}}</span>
                    </div>
                </el-table-column>
            </el-table>
            <el-pagination
                    class="mt-sm"
                    style="float: right"
                    @size-change="handle_size_change"
                    @current-change="handle_current_change"
                    :current-page="serverData.page"
                    :page-sizes="[20, 50, 100, 200,500]"
                    :page-size="serverData.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-row>
        <div slot="footer">
            <el-button @click.native="confirm" type="primary" size="mini">确定</el-button>
            <el-button @click.native="visible = false" size="mini">取消</el-button>
        </div>
    </page-dialog>
</template>

<script>
    import {api_get_server} from '@/api/server-management'
    export default {
        data(){
            return{
                serverData: {
                    name:'',
                    page: 1,
                    pageSize: 20
                },
                serverRadio: '',
                visible: false,
                total: 1,
                loading: false,
                tableData: [],
                serverObj: ''
            }
        },
        filters:{
            type_filter(val){
                switch (val){
                    case 0:
                        return '虚拟机';
                        break;
                    case 1:
                        return '云服务';
                        break;
                    case 2:
                        return '超级浏览器';
                        break;
                }
            }
        },
        methods:{
            open(){
                this.serverData = {
                    name:'',
                    page: 1,
                    pageSize: 20
                };
                this.serverRadio = '';
                this.serverObj = '';
                this.init()
            },
            init(){
                this.loading = true;
                let data = clone(this.serverData);
                this.$http(api_get_server, data).then(res => {
                    this.loading = false;
                    this.tableData = res.data;
                    this.total = res.count
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            getServerRow(index, obj){
                this.serverObj = obj;
            },
            search(){
                this.init();
            },
            handle_size_change(val){
                this.serverData.page = val;
                this.init()
            },
            handle_current_change(val){
                this.serverData.page = val;
                this.init()
            },
            confirm(){
                this.visible = false;
                this.$emit('choose-server',this.serverObj);
            }
        },
        watch:{
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props:{
            value: {
                require: true,
                type: Boolean
            }
        },
        components:{
            pageDialog:require('@/components/page-dialog').default
        }
    }
</script>

<style scoped>

</style>