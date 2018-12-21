<template>
    <div class="p-accounts">
        <page-dialog title="选择账号"
                     :loading="loading"
                     v-model="accountVisable"
                     :close-on-click-modal="false"
                     width="650px"
                     @change="account_dialog">
            <el-row class="mb-sm ">
                <el-select v-model="snType" placeholder="请选择" class="inline" style="width: 100px">
                    <el-option
                            v-for="item in options"
                            :label="item.label"
                            :key="item.value"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input v-model="snText" class="inline"></el-input>
                <el-button @click="search" size="mini" type="primary" class="inline">搜索</el-button>
            </el-row>
            <el-table
                    @row-click="row_click"
                    :data="comAccounts"
                    border
                    ref="table"
                    height="300"
                    style="width: 100%"
                    class="scroll-bar"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        :selectable="set_disable"
                        width="35">
                </el-table-column>
                <el-table-column
                        prop="code"
                        label="账号简称"
                        width="150">
                </el-table-column>
                <el-table-column
                        inline-template
                        label="平台账号">
                    <ui-tip :content="row.account_name" :width="95"></ui-tip>
                </el-table-column>
                <el-table-column
                        prop="realname"
                        label="销售员"
                        width="100">
                </el-table-column>
                <el-table-column
                        inline-template
                        label="是否刊登"
                        width="100">
                    <div>{{row.publish|filterPublish}}</div>
                </el-table-column>
            </el-table>
            <el-pagination
                    class="fr mt-sm"
                    @size-change="handle_size_change"
                    @current-change="handle_current_change"
                    :current-page="page"
                    :page-size="pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="save" type="primary">确定</el-button>
                <el-button size="mini" @click.native="accountVisable=false">关 闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus" scoped>
    table{
        width: 100%;
        font-size: 1.2rem;
        box-sizing: border-box;
        border-collapse: collapse;
        border-left: 1px solid #e0e6ed;
        border-top: 1px solid #e0e6ed;
        word-break:break-all;
        th {
            background: #EFF2F7;
        }

        tbody tr:hover {
            background-color: rgba(0, 0, 239, 0.15);
        }
        td, th {
            padding: 0 5px;
            height: 26px;
        //line-height:25px;
            text-align: center;
            box-sizing: border-box;
            border-right: 1px solid #e0e6ed;
            border-bottom: 1px solid #e0e6ed;
        }

    }
    .item{
        height:40px;
    }
</style>
<script>
    export default{
        data(){
            return {
                pageSize:15,
                page:1,
                total:0,
                snType:"code",
                snText:"",
                accountVisable:false,
                selected:[],
                options:[
                    {label:"全部",value:""},
                    {label:"账号简称",value:"code"},
                    {label:"账号",value:"account"},
                    {label:"销售员",value:"sale"},
                ],
                accountsFilter:[],
            }
        },
        filters:{
            filterPublish(val){
                return val?'已刊登':'未刊登';
            }
        },
        computed:{
            comAccounts:{
                get(){
                    let cur = [];
                    this.accountsFilter.forEach((row,index)=>{
                        if(index < this.page * this.pageSize && index >= (this.page - 1) * this.pageSize){
                            cur.push(row);
                        }
                    })
                    this.total = this.accountsFilter.length;
                    return cur;
                }
            },
        },
        methods: {
            handle_size_change(size){
                this.pageSize = size;
            },
            handle_current_change(page){
                this.page = page;
            },
            loaded_methods(val){
                console.log(val,'loaded_methods');
            },
            search(){
                this.snText= this.snText.trim().toLocaleLowerCase();
                    this.accountsFilter=this.accounts.filter(row=>{
                        let code=row.code.toLocaleLowerCase();
                        let name=row.account_name.toLocaleLowerCase();
                        let realname;
                        if(!row.realname){
                            realname=''
                        }else{
                            realname =row.realname.toLocaleLowerCase();
                        }
                        switch (this.snType){
                            case  "code":
                                if(code.indexOf(this.snText)===-1){
                                    return false
                                }else {return true}
                                break;
                            case "account":
                                if(name.indexOf(this.snText)===-1){
                                    return false
                                }else {return true}
                                break;
                            case "sale":
                                if(realname.indexOf(this.snText)===-1){
                                    return false
                                }else {return true}
                                break;
                            case "":
                                if(realname.indexOf(this.snText)===-1&&name.indexOf(this.snText)===-1&&code.indexOf(this.snText)===-1){
                                    return false
                                }else {
                                    return true
                                }
                        }

                    })
            },
            handleSelectionChange(val){
                this.selected=val;
            },
            save(){
                this.accountVisable=false;
                this.$emit("selected",this.selected)
            },
            set_disable(row){
                return !row.disabled
            },
            row_click(row,event,col){
                if(row.disabled){
                    return;
                }
                this.$refs.table.toggleRowSelection(row);
            },
            account_dialog(val){
                if(!val){
                    this.selected=[];
                    this.snType="code";
                    this.snText="";
                }
            }
        },
        watch: {
            value(val){
                this.accountVisable=val
            },
            accountVisable(val){
                this.$emit("input",val)
            },
            accounts(val){
                this.accountsFilter=val;
            },
        },
        props: {
            value:{},
            accounts:{
                require:true,
                type:Array
            },
            loading:{
                require:true,
                type:Boolean
            }
        },
        components: {
            pageDialog: require("../../../../components/page-dialog.vue").default,
            uiTip:require('../../../../components/ui-tip.vue').default,
        }
    }
</script>
