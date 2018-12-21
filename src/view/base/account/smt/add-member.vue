<template>
    <div class="c-add-member">
        <page-dialog  :title="`给账号：${accountName}添加成员`"
                      @open="open"
                      v-model="dialog" size="small" :close-on-click-modal="false" >
            <el-form v-for="row in data" :key="row.id" :model="row" label-width="120px">
                <el-form-item label="平台：">
                    <div>{{channelTitle}}</div>
                </el-form-item>
                <el-form-item label="账号：">
                    <div>{{accountName}}</div>
                </el-form-item>
                <el-form-item label="销售员/仓库类型：">
                    <template v-for="(item,index) in row.info">
                        <param-account
                                class="inline"
                                ref="paramSale"
                                v-model="item.seller_id"
                                :param="{type:'sales',data:{content:''}}"
                                :fixUrl="true"
                                :fixResult="sale_fix_result"
                                type="memberShipSales"
                                url="get|user/:type/staffs">
                        </param-account>
                        <el-select class="inline" v-model="item.warehouse_type" clearable filterable>
                            <el-option
                                    :key="res.value"
                                    v-for="res in warehouseTypeList"
                                    :label="res.label"
                                    :value="res.value"
                                    :disabled="res.disabled"></el-option>
                        </el-select>
                        <div v-if="isAdd" class="mt-xs inline" @click="add_more(row)">
                            <img src="../../../../assets/add2.png">
                        </div>
                        <div v-if="index===1" class="inline mt-xs" @click="new_delete(row,index)">
                            <img src="../../../../assets/delete(2).png">
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="客服：">
                    <param-account
                        ref="paramCustomer"
                        v-model="row.customer_id"
                        :param="{type:'customer',data:{content:''}}"
                        :fixUrl="true"
                        :fixResult="sale_fix_result"
                        type="memberShipCustomer"
                        url="get|user/:type/staffs">
                    </param-account>
                </el-form-item>
            </el-form>
            <div slot = "footer">
                <request-button :request="save">确定</request-button>
                <el-button size="mini" @click.native="cancel">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_product_person,api_product_channel}from '../../../../api/product-class';
    import {api_member_update,api_member_del,api_add_member} from '../../../../api/member';
    export default{
        data(){
            return {
                rowId:"",
                dialog:this.value,
                warehouseTypeLists:[
//                    0-所有 1-本地 2-海外
                    {label:"全部",value:0,disabled:false},
                    {label:"本地",value:1,disabled:false},
                    {label:"海外",value:2,disabled:false},
                ],
                serviceList:[],
                oldCustomerList:[],
                firstSellerList:[],
                channelList:[],

            }
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
            },
        },
        created(){
            this.get_channel();
        },
        computed:{
            channelTitle(){
                let str = '';
                if(this.data.length>0&&this.channelList.length>0){
                    let cur = this.channelList.find(res=>{return res.value===this.data[0].channel_id});
                    if(!!cur){
                        str = cur.label;
                    }
                    return str;
                }else{
                    return str;
                }
            },
            warehouseTypeList(){
                if(this.data.length>0){
                    let def = this.warehouseTypeLists.find(row=>{return row.value===0});
                    return this.warehouseTypeLists.map(row=>{
                        this.data.map(res=>{
                            if(res.info.length===2){
                                def.disabled = true;
                            }
                            let cur = res.info.find(re=>{return re.warehouse_type===row.value});
                            row.disabled = !!cur;
                        });
                        return row;
                    })
                }
            },
            isAdd(){
                let cur  = true;
                if(this.data.length>0){
                    this.data.map(row=>{
                        let def = row.info.find(res=>{return res.warehouse_type===0});
                        if(row.info.length===2 || def){
                            cur  = false;
                        }
                    });
                    return cur;
                }else{
                    return cur;
                }
            },
        },
        methods:{
            open(){
                this.rowId ="";
            },
            sale_fix_result(res){
                return  res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
            add_more(row){
                let cur = {
                    seller_id:"",
                    warehouse_type:"",
                };
                if(!!this.rowId)cur.id = this.rowId;
                row.info.push(cur);
            },
            new_delete(row,index){
                if(row.info[index].id){
                    this.rowId = row.info[index].id;
                }
                row.info.splice(index,1);
            },
            save(){
                let cur = window.clone(this.data);
                delete cur[0].id;
                delete cur[0].create_time;
                delete cur[0].code;
                if(this.data[0].id){
                    /*有ID存在，调用更新接口*/
                    return this.$http(api_member_update,this.data[0].id,cur[0]).then(res=>{
                        this.$message({type: "success", message: res.message || res})
                        this.dialog = false;
                        return Promise.resolve()
                    }).catch(code=>{
                        this.$message({type:'error',message:code.message||code});
                    })
                }else{
                    /*否则，调用添加接口*/
                    return this.$http(api_add_member,{detail:cur}).then(res=>{
                        this.$message({type: "success", message: res.message || res});
                        this.dialog = false;
                        return Promise.resolve()
                    }).catch(code=>{
                        this.$message({type:'error',message:code.message||code});
                    })
                }
            },
            cancel(){
                this.dialog = false;
            },
            cur_delete(){
                this.$confirm(`您将删除此信息，确认此操作吗?`,'提示',{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=>{
                    this.$http(api_member_del,this.data[0].id).then(res=>{
                        this.$message({type: "success", message: res.message || res})
                    }).catch(code=>{
                        this.$message({type:'error',message:code.message||code});
                    });
                        this.dialog = false;
                }).catch(()=>{
                    this.$message({
                        type:"info",
                        message:"已取消"
                    })
                })
            },
//            ------------------------------    api
            get_seller(){
                this.$http(api_product_person,{type:"sales"},{content: ""}).then(res=>{
                    this.firstSellerList = res.map(row=>{
                        return {
                            value:row.id,
                            label:row.realname,
                        };
                        row.disabled = false;
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_channel(){
                this.$http(api_product_channel).then(res=>{
                    this.channelList = res;
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        props:{
            value:{},
            accountName:{
                required:true,
                type:String
            },
            data:{
                required:true,
                type:Array
            },
            loading:{
                required:true,
                type:Boolean
            },
        },
        components: {
            pageDialog:require("../../../../components/page-dialog.vue").default,
            paramAccount:require('../../../../api-components/param-account.vue').default,
            requestButton:require('../../../../global-components/request-button').default
        }
    }
</script>
