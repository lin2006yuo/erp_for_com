<template>
    <div>
        <page-dialog :title="$t('ymx-list.spuInfringement')" v-model="show" width="750px" :close-on-click-modal="false">
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                    prop="channel"
                    :label="$t('ymx-list.channel')"
                >
                </el-table-column>
                <el-table-column
                    prop="site_code"
                    :label="$t('ymx-list.site')"
                >
                </el-table-column>
                <el-table-column
                    prop="account_name"
                    :label="$t('ymx-list.userName')">
                </el-table-column>
                <el-table-column
                    :label="$t('ymx-list.time')">
                    <template slot-scope="scope">
                        {{new Date(scope.row.tort_time*1000).toLocaleDateString()}}
                    </template>
                </el-table-column>
                <el-table-column
                    width="260px"
                    style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
                    prop="remark"
                    :label="$t('ymx-list.infringementDescribe')">
                </el-table-column>
            </el-table>
            <div slot="footer">
                <span>{{`${$t('ymx-list.hint')} ?`}}</span>
                <el-button type="primary" @click="submitInfo">{{$t('common.go')}}</el-button>
                <el-button @click="show = false">{{$t('common.cancel')}}</el-button>
            </div>
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
            submitInfo(){
                this.$emit("submit-info");
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
            }
        }
    }
    </script>
