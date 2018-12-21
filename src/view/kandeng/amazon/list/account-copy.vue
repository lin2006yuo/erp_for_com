<template>
    <div class="p-accounts">
        <page-dialog :title="$t('ymx-list.bCopyTip3')" v-model="accountVisable"
                     :close-on-click-modal="false"
                     @open="open"
                     @change="account_dialog">
            <el-row class="mb-sm">
                <el-select v-model="snType" :placeholder="$t('ymx-list.ps')" class="inline" style="width: 100px">
                    <el-option
                            :key="i"
                            v-for="(item,i) in options"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input v-model="snText" class="inline" @keyup.enter.native="search"></el-input>
                <el-button @click="search" size="mini ml-sm" class="inline" type="primary">{{$t('common.search')}}</el-button>
            </el-row>
            <el-table
                    @row-click="row_click"
                    :data="accountsFilter"
                    border
                    class="scroll-bar"
                    ref="table"
                    height="300"
                    style="width: 100%"
                    v-loading="loading"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="35">
                </el-table-column>
                <el-table-column
                        prop="code"
                        :label="$t('ymx-list.account')">
                </el-table-column>
                <el-table-column
                        prop="realname"
                        :label="$t('ymx-list.seller')">
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <request-button req-key="accountSave" :disabled="isRequest" @click.native="save">{{$t('common.confirm')}}</request-button>
                <el-button size="mini" @click.native="accountVisable=false">{{$t('common.cancel')}}</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_amazon_account} from '../../../../api/amazon-publish-list';
    export default{
        data(){
            return {
                snType:"code",
                snText:"",
                accountVisable:false,
                selected:[],
                options:[
                    {label:this.$t('ymx-list.account'),value:"code"},
                    {label:this.$t('ymx-list.seller'),value:"realname"},
                ],
                accountsFilter:[],
                accounts:[],
                loading:false
            }
        },
        methods: {
            open(){
                this.get_account();
            },
            // 获取账号
            get_account() {
                this.loading = true;
                this.$http(api_get_amazon_account).then(res => {
                    res.forEach(row => {
                        this.$set(row, 'disabled', false);
                    });
                    let list = res.filter(row=>this.siteList.includes(row.site));
                    this.accounts = list;
                    this.loading = false;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                    this.loading = false;
                })
            },
            //点击搜索
            search(){
                this.snText= this.snText.trim().toLocaleLowerCase();
                this.accountsFilter=this.accounts.filter(row=>{
                    let code=row.code.toLocaleLowerCase();
                    let name=row.realname.toLocaleLowerCase();
                    switch (this.snType){
                        case  "code":
                            return code.indexOf(this.snText)!==-1;
                        case "realname":
                            return name.indexOf(this.snText)!==-1;
                        case "":
                            return row
                    }
                })
            },
            handleSelectionChange(val){
                this.selected=val;
                this.$emit('handle-change',val);
            },
            //单行点击选择
            row_click(row,event,col){
                this.$refs.table.toggleRowSelection(row);
            },
            //点保存
            save(){
                this.$emit("selected",this.selected)
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
                return val?this.$t('ymx-list.pubed'):this.$t('ymx-list.unPub');
            }
        },
        watch: {
            value(val){
                this.accountVisable=val;
                if(val){
                }
            },
            accountVisable(val){
                this.$emit("input",val);
            },
            accounts(val){
                this.accountsFilter=val;
            },
        },
        props: {
            value:{},
            isRequest:{
                default(){
                    return false
                }
            },
            siteList:{
                required:true
            }
        },
        components: {
            pageDialog: require("../../../../components/page-dialog.vue").default,
        }
    }
</script>
