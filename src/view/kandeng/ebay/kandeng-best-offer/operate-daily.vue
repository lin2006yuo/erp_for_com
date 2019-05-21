<template>
    <page-dialog v-model="show" size="small" title='BestOffer处理：操作日志'
                 class="p-batch-edit" :close-on-click-modal="false">
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
                prop="date"
                label="买家议价"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="卖家开价"
                width="180">
            </el-table-column>
            <el-table-column
                prop="address"
                label="操作事项">
            </el-table-column>
            <el-table-column
                prop="address"
                label="操作结果">
            </el-table-column>
            <el-table-column
                prop="address"
                label="操作时间">
            </el-table-column>
            <el-table-column
                prop="address"
                label="失败原因">
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close" >{{$t('common.confirm')}}</el-button>
            <el-button size="mini" @click.native="close" >{{$t('common.close')}}</el-button>
        </div>
    </page-dialog>
</template>

<script>
    export default {
        name: "operate-daily",
        data(){
            return{
                show:this.value,
                tableData:[],
            }
        },
        methods:{
          close(){
              this.show=false;
          }
        },
        props:{
            value:{

            },
        }
    }
</script>

<style scoped>

</style>
