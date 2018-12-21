<template>
    <div class="p-accounts">
        <page-dialog :title="$t('ymx-detail.selectAcc')" v-model="accountVisiable"
                     :close-on-click-modal="false"
                     @change="account_dialog">
            <el-row class="mb-sm ">
                <el-select v-model="snType" :placeholder="$t('ymx-detail.select')" class="inline" style="width: 100px">
                    <el-option
                            :key="i"
                            v-for="(item,i) in options"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input v-model="snText" class="inline" @keyup.enter.native="search"></el-input>
                <el-button @click="search" size="mini ml-sm" class="inline" type="primary">{{$t('ymx-detail.search')}}</el-button>
            </el-row>
            <el-table
                    @row-click="row_click"
                    :data="accountsFilter"
                    border
                    class="scroll-bar"
                    ref="table"
                    height="300"
                    style="width: 100%"
                    @select="select_row"
                    @select-all="select_all"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        :selectable="set_disable"
                        width="35">
                </el-table-column>
                <el-table-column
                        v-if="colShow"
                        prop="code"
                        :label="$t('ymx-detail.accName')">
                </el-table-column>
                <el-table-column
                        prop="realname"
                        :label="$t('ymx-detail.seller')">
                </el-table-column>
                <el-table-column
                    v-if="colPublish"
                    inline-template
                    label="是否刊登"
                    width="100">
                    <div>{{row.publish|filterPublish}}</div>
                </el-table-column>
                <el-table-column
                    v-if="showStore"
                    inline-template
                    label="店铺选择"
                    width="100">
                    <div @click.stop>
                        <el-select v-model="row.store_value">
                            <el-option v-for="(item, index) in row.shop" :key="index" :label="item.code" :value="item.id"></el-option>
                        </el-select>
                    </div>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <request-button req-key="url_post_publish_express_batch_copy"
                                :disabled="isRequest"
                                :timeout="timeout"
                                @click.native="save">{{$t('ymx-detail.confirm')}}</request-button>
                <el-button size="mini" @click.native="accountVisiable=false">{{$t('ymx-detail.close')}}</el-button>
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
                snType:"code",
                snText:"",
                accountVisiable:this.value,
                selected:[],
                options:[
                    {label: this.$t('ymx-detail.accName'),value:"code"},
                    {label: this.$t('ymx-detail.seller'),value:"realname"},
                ],
                accountsFilter:[],
            }
        },
        methods: {
            select_row(selection, row){
                this.$emit('select-row',row);
            },
            select_all(selection){
                if(!selection||selection.length<=0)return;
                this.$emit('select-all',selection);
            },
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
                this.$emit('handle-change',val);
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
                this.$emit("selected",this.selected);
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
                this.accountVisiable=val;
            },
            accountVisiable(val){
                this.$emit("input",val);
            },
            accounts(val){
                this.accountsFilter=val;
            },
        },
        props: {
            curChannel:{
                type:String,
                default(){
                    return ''
                }
            },
            timeout:{
                default(){
                    return 300
                }
            },
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
            },
            colPublish:{
                default(){
                    return true
                }
            },
            isRequest:{
                default(){
                    return false
                }
            }
        },
        components: {
            pageDialog: require("../../../../components/page-dialog.vue").default,
        }
    }
</script>
