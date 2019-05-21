<template>
    <page-dialog title="添加参数"
                 v-model="show"
                 width="40%">
        <el-table :data="paramData"
                  align="center"
                  class="mt-sm"
                  ref="table"
                  @selection-change="$emit('select-change',$event)"
                  @row-click="row_click">
            <el-table-column type="selection"
                             width="50">
            </el-table-column>
            <el-table-column label="参数名称"
                             show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="bold-font">{{scope.row.title}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini"
                       @click.native="$emit('submit')">确定
            </el-button>
            <el-button size="mini" @click.native="show=false">取 消</el-button>
        </div>
    </page-dialog>
</template>

<script>
    export default {
        name: "add-platform-param",
        data() {
            return {
                show:this.value,
            }
        },
        watch: {
            show(val){
                this.$emit('input',val);
            },
            value(val){
                this.show=val;
            }
        },
        methods: {
            row_click(row, event, column){
                if(column.type==='selection')return;
                this.$refs.table.toggleRowSelection(row);
            }
        },
        props: {
            value:{
                type:Boolean,
                default:false
            },
            paramData:Array
        },
    }
</script>

