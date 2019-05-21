<template>
    <page-dialog
        v-model="dialog"
        :title="$t('ymx-list.assignmentBatchSwitch')"
        width="650px"
        @close="close"
    >
        <label class="ml-sm">{{$t('ymx-list.switchCell')}}：</label>
        <super-select
            class="inline s-width-default"
            v-model="seller"
            :options="seller_arr"
            @change="seller_change"
            storageKey="seller_arr"
        ></super-select>
        <label class="ml-sm">{{$t('ymx-list.sitchaAcount')}}：</label>
        <super-select
            class="inline s-width-default"
            v-model="code"
            :options="code_arr"
            @change="code_change"
            storageKey="code_arr"
        >
        </super-select>
        <el-table
            :data="tableData"
            border
            style="width: 100%;margin-top: 10px;">
            <el-table-column
                prop="spu"
                :label="$t('ymx-list.localspu')"
                width="100px"
            >
            </el-table-column>
            <el-table-column
                prop="code"
                :label="$t('ymx-list.account')"
                width="120px"
            >
            </el-table-column>
            <el-table-column
                prop="seller_name"
                :label="$t('ymx-list.seller')">
            </el-table-column>
            <el-table-column
                :label="$t('ymx-list.switchCell')" width="140px">
                <template slot-scope="scope">
                    <super-select
                        class="inline s-width-default"
                        v-model="scope.row.seller_id"
                        :options="seller_arr"
                        :storageKey="scope.row.seller_name"
                    ></super-select>
                </template>
            </el-table-column>
            <el-table-column
                :label="$t('ymx-list.sitchaAcount')" width="140px">
                <template slot-scope="scope">
                    <super-select
                        class="inline s-width-default"
                        v-model="scope.row.account_id"
                        :options="code_arr"
                        :storageKey="scope.row.code">
                    </super-select>
                </template>
            </el-table-column>
        </el-table>
        <div style="position: absolute;right: 30px;bottom: 15px;">
            <el-button
                class="inline"
                size="mini"
                @click.native="is_chack"
                type="primary"
            >确定</el-button>
            <el-button  size="mini" class="inline"
                        @click.native="close">取消
            </el-button>
        </div>
    </page-dialog>
</template>

<script>
    import {api_amazon_task} from '../../../../api/amazon-publish-list';
    import {api_member_list} from "@/api/member"
    export default {
        data(){
          return{
              dialog:false,
              seller:'',
              code:'',
              code_arr:[],
          }
        },
        mounted(){

        },
        methods:{
            seller_change(val){
                this.tableData.forEach(row=>{
                    row.seller_id=this.seller;
                });
                this.$http(api_member_list,{snText:val,snType:"sales",channel_id:2}).then(res=>{
                    this.code_arr=res.data.map(row=>{
                        return{
                            label:row.code,
                            value:row.account_id
                        }
                    })
                });
                this.code='';
                this.code_change();
            },
            code_change(){
                this.tableData.forEach(row=>{
                    row.account_id=this.code;
                })
            },
            is_chack(){
                for(let i of this.tableData){
                    if(i.seller_id==''){
                        return this.$message({type:'info',message:`【${i.code}】`+this.$t("ymx-list.isSwitchCell")})
                    }
                    if(i.account_id==''){
                        return this.$message({type:"info",message:`【${i.code}】`+this.$t("ymx-list.isSitchaAcount")})
                    }
                }
               this.$http(api_amazon_task,{data:this.tableData}).then(res=>{
                   this.$message({type:"success",message:res.message});
                   this.dialog=false;
                   this.$emit("init")
               }).catch(err=>{
                   this.$message({type:'error',message:err.message});
               })
            },
            close(){
                this.dialog=false;
                this.seller='';
                this.code='';
                this.tableData.forEach(row=>{
                    row.seller_id='';
                    row.account_id='';
                });
            }
        },
        watch:{
            value(val){
                this.dialog=val;
            },
            dialog(val){
                this.$emit('input',val)
            }
        },
        props:{
            value:{},
            tableData:{
                type:Array,
                required:true
            },
            seller_arr:{},
        },
        components:{
            pageDialog:require("@/components/page-dialog.vue").default,
        }
    }
</script>

<style scoped>

</style>
