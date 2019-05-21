<template>
    <page-dialog :title="title" v-model="show" width="850px" :close-on-click-modal="false">
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
                prop="channel_name"
                label="平台">
            </el-table-column>
            <el-table-column
                prop="site_code"
                label="站点">
            </el-table-column>
            <el-table-column
                prop="account_name"
                label="账号">
            </el-table-column>
            <el-table-column
                label="侵权时间">
                <template slot-scope="scope">
                    {{new Date(scope.row.tort_time*1000).toLocaleDateString()}}
                </template>
            </el-table-column>
            <el-table-column
                prop="tort_type"
                label="侵权类型">
            </el-table-column>
            <el-table-column
                width="260px"
                style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
                prop="remark"
                label="侵权描述">
            </el-table-column>
            <el-table-column
                prop="creator"
                label="添加人">
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer" v-if="lookTip">
            <span>该spu存在侵权记录，是否继续？</span>
            <el-button  size="mini" type="primary" @click="goOn">继 续</el-button>
            <el-button  size="mini" @click="show=false">关  闭</el-button>
        </div>
    </page-dialog>
</template>

<style lang="stylus" scoped>

</style>
<script>
    export default {
        data(){
            return {
                show:this.value,
            }
        },
        methods:{
            goOn(){
                this.$emit('fanseright')
            },
        },
        computed:{
            title(){
                return `${this.spuName}侵权记录`
            }
        },
        components:{
            pageDialog: require('@/components/page-dialog.vue').default,
        },
        watch:{
            value(val){
                this.show=val;
            },
            show(val){
                this.$emit('input',val);
            }
        },
        props:{
            lookTip:{
                type:Boolean,
                default() {
                    return false;
                }
            },
            value: {
                required: true,
                type: Boolean
            },
            tableData:{
                required: true,
                type:Array
            },
            spuName:{
                type:String
            }
        }
    }
</script>

