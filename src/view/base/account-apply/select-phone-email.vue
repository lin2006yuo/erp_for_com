<template>
    <page-dialog :title="`选择注册${title}`"
                 v-model="show"
                 width="80%"
                 :close-on-click-modal="false"
                 @change="open_dialog">
        <el-row class="mt-xs mb-xs ml-sm">
            <label-item :label=label>
                <el-input v-model.trim="search.value"
                          @keyup.native.enter="$emit('current-search',title)">
                </el-input>
            </label-item>
            <el-button type="primary" size="mini" @click.native="$emit('current-search',title)">搜索</el-button>
        </el-row>
        <el-table :data="tableData"
                  border
                  highlight-current-row
                  class="scroll-bar"
                  @row-click="row_click">
            <el-table-column label="单选" width="60">
                <template slot-scope="scope">
                    <el-radio class="radio" v-model="singleCheck"
                              :label="scope.row.id"
                              @change.native="change(scope.row)">&nbsp</el-radio>
                </template>
            </el-table-column>
            <el-table-column v-if="title==='邮箱'"
                             label="邮箱号"
                             prop="email"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    show-overflow-tooltip
                    label="手机号"
                    prop="phone">
            </el-table-column>
            <el-table-column v-if="title==='手机号'"
                             label="手机号运营公司"
                             prop="operator_txt">
            </el-table-column>
            <el-table-column label="注册人"
                             prop="reg_txt">
            </el-table-column>
            <el-table-column
                    label="注册日期"
                    show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{title==='手机号'?scope.row.reg_time_txt:scope.row.reg_time_date}}</span>
                </template>
            </el-table-column>
        </el-table>
        <el-row class="mt-xs" style="height: 35px">
            <el-pagination class="fr"
                           @size-change="$emit('change-size',$event,title)"
                           @current-change="$emit('change-page',$event,title)"
                           :current-page="search.page"
                           :page-sizes="[20, 50, 100, 200]"
                           :page-size="search.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="count">
            </el-pagination>
        </el-row>
        <el-row slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" @click.native="submit">确定</el-button>
            <el-button size="mini" @click="show=false">取消</el-button>
        </el-row>
    </page-dialog>
</template>

<style lang="stylus" scoped>

</style>

<script>
    export default {
        name: "select-phone-email",
        data() {
            return {
                show:this.value,
                singleCheck:'',
                exportObj:{}
            }
        },
        computed: {
            label(){
                return this.title==='手机号'?'手机号：':'邮箱：';
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
            open_dialog(isOpen){
                if(isOpen){
                    this.singleCheck='';
                    this.exportObj={};
                }
            },
            change(row){
                this.exportObj=row;
            },
            row_click(row, event, column){
                this.singleCheck=row.id;
                this.exportObj=row;
            },
            submit(){
                if(!this.singleCheck){
                    return this.$message({type:'warning',message:`请先选择${this.title==='手机号'?'手机号':'邮箱'}`});
                }
                this.$emit('submit',this.exportObj);
            }
        },
        props: {
            value:{},
            title:{},
            current:{},//当前传进来的手机号或邮箱,
            search:{},
            tableData:{
                type:Array
            },
            count:{
                type:Number
            }
        },
        components: {
            labelItem:require('@/components/label-item.vue').default,
        },
    }
</script>

