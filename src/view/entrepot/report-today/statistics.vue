<template>
    <ui-card class="form-item">
        <span slot="header">
            <img src="../../../assets/u1830.png" class="title-img ml-xs">
            <span class="title-text">{{tableTitle}}</span>
        </span>
        <el-table
                :data="tableData"
                class="scroll-bar"
                highlight-current-row>
            <el-table-column
                    v-for="(item, index) in tableColumns"
                    :key="`${item.value}-${index}-${item.label}`"
                    inline-template
                    :label="item.label">
                <ui-tip :content="row[item.value]" :is-operate="item.operate" :width="98" @click.native="look_detail(row,item)"></ui-tip>
            </el-table-column>
        </el-table>
    </ui-card>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {}
        },
        methods: {
            look_detail(row, item){
                if(item.operate){
                    this.$emit('look-detail', row, item);
                }
            }
        },
        props: {
            tableTitle:{},
            tableColumns:{},
            tableData:{},
        },
        components: {
            uiCard: require('@/components/ui-card').default,
            uiTip:require('@/components/ui-tip').default
        }
    }
</script>
