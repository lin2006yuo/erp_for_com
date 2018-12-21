<template>
    <div class="c-add-account">
        <page-dialog title="选择账号"
                     v-model="dialog" size="small"
                     :close-on-click-modal="false"
                     loading-text="正在添加数据，请稍等...">
            <el-select class="inline width-sm ml-sm"
                       ref="snType"
                       v-mouse-side.mousewheel="()=>{$refs.snType.visible=false}"
                       v-model="snType" filterable clearable>
                <el-option
                    v-for="item in snTypeList"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                ></el-option>
            </el-select>
            <el-input class="inline width-super"
                      @keyup.enter.native="search"
                      v-model="snText"></el-input>
            <el-button class="inline ml-sm" type="primary" size="mini" @click.native="search">搜索</el-button>
            <el-table
                class="scroll-bar mt-sm"
                :data="filterData"
                ref="table"
                highlight-current-row
                @selection-change="selection_change"
                @row-click="row_click">
                <el-table-column type="selection" width="35px"
                                 :selectable="set_disable"></el-table-column>
                <el-table-column label="账号简称" inline-template width="100">
                    <ui-tip :content="row.code" :width="98" v-copy></ui-tip>
                </el-table-column>
                <el-table-column label="平台账号" inline-template>
                    <ui-tip :content="row.account_name" :width="98" v-copy></ui-tip>
                </el-table-column>
                <el-table-column label="销售员" inline-template>
                    <div>{{row.realname | filtername}}</div>
                </el-table-column>
            </el-table>
            <div slot="footer">
                <el-button size="mini" type="primary"
                           @click.native="add_data">确定</el-button>
                <el-button size="mini" @click.native="dialog = false">关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>

    export default{
        data(){
            return {
                dialog:false,
                snTypeList:[
                    {label:"平台账号",value:"account_name"},
                    {label:"账号简称",value:"code"},
                ],
                snType:"code",
                snText:"",
                filterData:[],
                /*多选框  抛出的数据*/
                selectList:[],

            }
        },
        filters:{
            filtername(val){
                return val===null?"":val;
            },
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog  = val;
            },
            accountList(val){
                 this.filterData = val;
            },
        },
        methods:{
            /*点击行*/
            row_click(row,event,col){
                if(row.disabled)return;
                this.$refs.table.toggleRowSelection(row);
            },
            search(){
                let snText= this.snText.trim().toLocaleLowerCase();
                this.filterData=this.accountList.filter(row=>{
                    let code=row.code.toLocaleLowerCase();
                    let name=row.account_name.toLocaleLowerCase();
                    switch (this.snType){
                        case  "code":
                            if(code.indexOf(snText)===-1){
                                return false
                            }else {return true}
                            break;
                        case "account_name":
                            if(name.indexOf(snText)===-1){
                                return false
                            }else {return true}
                            break;
                    }

                })
            },
            add_data(){
            	if(!!this.selectList.length){
                    this.dialog = false;
                    this.$emit("add-data",this.selectList);
                }else{
            		this.$message({type:"info", message: "平台账号不能为空！"});
                }
            },
            /*多选  账号*/
            selection_change(val){
                this.selectList = val;
                this.$emit('selection-change',val);
            },
            set_disable(row){
                return !row.disabled
            },
        },
        props:{
            value:{},
            accountList:{
                type:Array,
                required:true
            },
        },
        components: {
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            uiTip:require('../../../../../components/ui-tip.vue').default,
        }
    }
</script>
