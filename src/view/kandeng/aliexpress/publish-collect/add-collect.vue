<template>
    <div class="p-accounts">
        <page-dialog title="选择要认领的账号" v-model="accountVisable" :close-on-click-modal="false" @change="account_dialog">
            <el-row class="mb-sm ">
                <el-select v-model="snType" placeholder="请选择" class="inline" style="width: 100px">
                    <el-option
                            :key="item.value"
                            v-for="item in options"
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
                        prop="code"
                        label="账号简称">
                </el-table-column>
                <el-table-column
                    prop="account_name"
                    label="平台账号">
                </el-table-column>
                <el-table-column
                        prop="realname"
                        label="销售员">
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
    import {
        api_publish_collect_claim
    } from '../../../../api/publish-collect'

    export default{
        data(){
            return {
                snType:"code",
                snText:"",
                accountVisable:false,
                selected:[],
                options:[
                    {label:"账号简称",value:"code"},
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
                        let code=row.code.toLocaleLowerCase();
                        let name=row.realname.toLocaleLowerCase();
                        switch (this.snType){
                            case  "code":
                                if(code.indexOf(this.snText)===-1){
                                    return false
                                }else {return true}
                                break;
                            case "realname":
                                if(name.indexOf(this.snText)===-1){
                                    return false
                                }else {return true}
                                break;
                            case "":
                                if(name.indexOf(this.snText)===-1&&code.indexOf(this.snText)===-1){
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
            //单行点击选择
            row_click(row,event,col){
                if(row.disabled){
                    return;
                }
                this.$refs.table.toggleRowSelection(row);
            },
            //点保存
            save(){
            	if(!this.selected.length){
                    this.$message({type:"warning",message:'请选择要认领的账号！'});
                    return;
                }
                this.$confirm(`确认认领到已勾选账号吗`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                    	id:this.selectData.id,
                        goods_id: this.selectData.goods_id,
                        account_id: this.selected.map(x=>{return x.account_id}).join(","),
                        channel_id: this.selectData.channel_id,
                    };
                    this.$http(api_publish_collect_claim,data).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.accountVisable=false;
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    });

                }).catch(() => {
                    this.accountVisable=false;
                    this.$message({
                        type: 'info',
                        message: '已取消认领'
                    });
                });
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
                    console.log('emit');
                    this.$emit('get-store',index, value)
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
            selectData:{
            	require:true,
                type:Object
            }
        },
        components: {
            pageDialog: require("../../../../components/page-dialog.vue").default,
        }
    }
</script>
