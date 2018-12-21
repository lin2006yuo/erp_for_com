<template>
    <div class="p-accounts">
        <page-dialog title="选择账号" v-model="accountVisable" :close-on-click-modal="false" @change="account_dialog">
            <el-row class="mb-sm ">
                <el-select v-model="snType" placeholder="请选择" class="inline" style="width: 100px">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-input v-model="snText" class="inline"></el-input>
                <el-button @click="search" size="mini" type="primary">搜索</el-button>
            </el-row>
            <el-table
                @row-click="row_click"
                :data="accountsFilter"
                border
                class="scroll-bar"
                ref="table"
                height="300"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    :selectable="set_disable"
                    width="35">
                </el-table-column>
                <el-table-column
                    v-if="colShow"
                    prop="code"
                    label="账号简称"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="account_name"
                    label="平台账号"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="realname"
                    label="销售员"
                    width="150">
                </el-table-column>
                <el-table-column
                    v-if="colShow"
                    inline-template
                    label="是否刊登"
                    width="100">
                    <div>{{row.publish|filterPublish}}</div>
                </el-table-column>
                <el-table-column
                    v-if="showStore"
                    inline-template
                    label="店铺选择"
                    width="200">
                    <div @click.stop>
                        <el-select v-model="row.store_value">
                            <el-option v-for="(item, index) in row.shop" :key="index" :label="item.shop_name" :value="item.id"></el-option>
                        </el-select>
                    </div>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="save" type="primary">确定</el-button>
                <el-button size="mini" @click.native="accountVisable=false">关 闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return {
                snType:"account_name",
                snText:"",
                accountVisable:false,
                selected:[],
                options:[
                    {label:"平台账号",value:"account_name"},
                    {label:"销售员",value:"realname"},
                ],
                accountsFilter:[],
            }
        },
        created(){
        },
        mounted(){
        },
        computed: {

        },
        methods: {
            //点击搜索
            search(){
                this.snText= this.snText.trim().toLocaleLowerCase();
                this.accountsFilter=this.accounts.filter(row=>{
                    let code=row.account_name.toLocaleLowerCase();
                    let name=row.realname;
                    switch (this.snType){
                        case  "account_name":
                            if(code.indexOf(this.snText)===-1){
                                return false
                            }else {return true}
                            break;
                        case "realname":
                            if(name.indexOf(this.snText)===-1){
                                return false
                            }else {return true}
                            break;
                    }

                })
            },
            handleSelectionChange(val){
                this.selected=val;
            },
            //单行点击选择
            row_click(row,event,col){
                if(row.disabled){
                    return;
                }
                this.$refs.table.toggleRowSelection(row);
            },
            //点保存
            save(){
                let find = this.selected.find(item=>{
                   return item.store_value === ''
                });
                if(!find){
                    this.accountVisable=false;
                    this.$emit("selected",this.selected)
                }else {
                    this.$message({
                        type: 'info',
                        message: `账号【${find.code}】未选择对应的店铺`
                    })
                }

            },
            // 设置是否可以点击
            set_disable(row){
                return !row.disabled
            },
            //弹框打开关闭触发
            account_dialog(val){
                if(!val){
                    this.selected=[];
                    this.snType="code";
                    this.snText="";
                }
            },
            get_store(index, value, bool){
                if(bool){
                    this.$emit('get-store',index, value)
                }
            }
        },
        filters:{
            filterPublish(val){
                return val?'已刊登':'未刊登';
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
            showStore:{
                default(){
                    return false
                }
            },
            colShow:{
                default(){
                    return true
                }
            }
        },
        components: {
            pageDialog: require("../../../../components/page-dialog.vue").default,
        }
    }
</script>
