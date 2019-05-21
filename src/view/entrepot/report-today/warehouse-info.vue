<template>
    <ui-card class="form-item">
        <span slot="header">
            <img src="../../../assets/u1830.png" class="title-img ml-xs" @click="test">
            <span class="title-text">{{tableTitle}}</span>
        </span>
        <el-table
                :data="tableDataOne"
                class="scroll-bar"
                highlight-current-row="">
            <el-table-column
                    v-for="(item, index) in warehouseColumnB"
                    :key="`${item.value}-${index}-${item.label}`"
                    inline-template
                    :label="item.label">
                <div>
                    <ui-tip v-if='typeof item.value ==="string"' :content="row[item.value]"
                        :is-operate="item.operate" :width="98" @click.native="look_detail(row,item)"></ui-tip>
                    <div v-else>
                        <span :title="`今天待拣货的拣货单数${row['unPickPicking']}`">{{row['unPickPicking']}}</span>
                        <span :title="`全部待拣货的拣货单数${row['allPickPicking']}`">({{row['allPickPicking']}})</span>
                    </div>
                </div>
            </el-table-column>
        </el-table>
        <el-table
                :data="tableDataTwo"
                class="scroll-bar"
                highlightCurrentRow>
            <el-table-column
                    v-for="(item, index) in warehouseColumnE"
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
            test(){
                console.log(this.tableData,'tableData');
            },
            look_detail(row, item){
                if(item.operate){
                    this.$emit('look-detail', row, item);
                }
            }
        },
        props: {
            tableTitle:{},
            tableColumns:{},
            tableDataTwo:{},
            tableDataOne:{},
            warehouseColumnB:{},
            warehouseColumnE:{},
        },
        components: {
            uiCard: require('@/components/ui-card').default,
            uiTip:require('@/components/ui-tip').default
        }
    }
</script>
