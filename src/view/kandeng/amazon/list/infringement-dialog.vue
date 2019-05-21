<template>
    <div>
        <page-dialog :title="title+$t('ymx-list.spuInfringement')" v-model="show" width="750px" :close-on-click-modal="false">
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                    prop="channel"
                    label="平台"
                >
                </el-table-column>
                <el-table-column
                    prop="site_code"
                    label="站点"
                >
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
                    width="245px"
                    style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
                    prop="remark"
                    label="侵权描述">
                </el-table-column>
                <el-table-column
                    prop="realname"
                    label="添加人">
                </el-table-column>
            </el-table>
        </page-dialog>
    </div>
</template>

<style lang="stylus">

</style>
<script>
    export default {
        data(){
            return {
                show:this.value,
            }
        },
        methods:{

        },
        components:{
            pageDialog: require('@/components/page-dialog.vue').default,
        },
        watch:{
          value(val){
              this.show=val;
          },
          show(val){
              this.$emit('change-show',val);
          }
        },
        props:{
            value: {
                required: true,
                type: Boolean
            },
            tableData:{
                required: true,
                type:Array
            },
            title:{

            }
        }
    }
</script>

