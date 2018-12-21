<template>
    <page-dialog v-model="show" size="large" title="操作日志" :close-on-click-modal="false" >
        <el-table
                :data="logData"
                style="width: 100%">
            <el-table-column
                    inline-template align="left"
                    label="操作日志">
                <div class='indent' v-if='row.remark.length>0' v-copy
                     v-for="(item,index) in row.remark"
                     :key="index"
                     :width="95">{{item}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="操作类型"
                    width="100">
                <ui-tip :content="row.type | typeFilter" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="操作人"
                    width="100">
                <ui-tip :content="row.operator" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="150"
                    label="操作时间">
                <ui-tip :content="row.create_time | timeFilter" :width="98"></ui-tip>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="show=false" size="mini">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .indent{
        text-indent:2em;
    }
</style>
<script>

    export default {
        data() {
            return {
                show:false
            }
        },
        filters:{
            timeFilter(val){
                return datef('YYYY-MM-dd HH:mm:ss', val);
            },
            typeFilter(val){
                switch (val){
                    case 0:
                        return '新增';
                    case 1:
                        return '修改';
                    case 2:
                        return '删除';
                    case 3:
                        return '排序';
                    default:
                        return '未知';
                }
            }
        },
        methods: {},
        watch: {
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit('input', val);
            },
        },
        props: {
            value:{},
            logData:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog').default,
            uiTip:require('@/components/ui-tip').default
        }
    }
</script>
