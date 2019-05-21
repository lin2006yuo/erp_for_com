<template>
    <page-dialog v-model="show" :title="title" width="690px">
        <div class="info-wrap">
            <el-form :model="form" ref="form" :rules="rules" label-width="145px">
                <el-form-item label="仓库：" prop="warehouse_id" required>
                    <div class="inline" style="width:95%">
                        <el-select v-model="form.warehouse_id"
                                   :disabled="flag===2||flag===3"
                                   placeholder="请选择仓库">
                            <el-option
                                v-for="item in warehouse_options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <template >
                    <el-form-item v-if="flag===2||flag===3" label="SKU：" prop="sku" required>
                        <div class="inline mr-xs" style="width:95%">
                            <el-input v-model="form.sku" disabled></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item v-else label="SKU：" prop="sku" required>
                        <div class="inline mr-xs" style="width:75%">
                            <el-input v-model="form.sku"
                                      placeholder="请先选择仓库"
                                      disabled>
                            </el-input>
                        </div>
                        <el-button type="primary"
                                   size="mini"
                                   :disabled="!form.warehouse_id"
                                   @click="addSku">添加SKU</el-button>
                    </el-form-item>
                </template>
                <el-form-item label="库存价(CNY)：" prop="inventory_price">
                    <div class="inline mr-xs" style="width:95%">
                        <el-input v-model="form.inventory_price" disabled ></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="最新一次采购价(CNY)：" prop="last_purchase_price">
                    <div class="inline mr-xs" style="width:95%">
                        <el-input v-model="form.last_purchase_price" disabled ></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="最新报价(CNY)：" prop="new_price">
                    <div class="inline mr-xs" style="width:95%">
                        <el-input v-model="form.new_price"  disabled></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="跌价类型(CNY)：" prop="discount_type" required>
                    <div class="inline" style="width:95%">
                        <el-select v-model="form.discount_type"
                                   placeholder="请选择"
                                   @change="(val)=>{ changeVal }"
                                   :disabled="flag===2||flag===3">
                            <el-option
                                v-for="item in discount_type_options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <template v-if="form.discount_type===1">
                    <el-form-item label="跌价金额(CNY)：" prop="discount_value" required>
                        <div class="inline" style="width:95%">
                            <el-input v-model="form.discount_value"
                                      type="number"
                                      :min="0"
                                      title=""
                                      :disabled="flag===2||flag===3">
                            </el-input>
                        </div>
                    </el-form-item>
                </template>
                <template v-if="form.discount_type===2">
                    <el-form-item label="跌价比例(%)：" prop="discount_value" required>
                        <div class="inline" style="width:95%">
                            <el-input v-model="form.discount_value"
                                      type="number"
                                      title=""
                                      :disabled="flag===2||flag===3"
                                      :min="1"
                                      :max="100">
                            </el-input>
                        </div>
                    </el-form-item>
                </template>
                <el-form-item label="跌价产品总数：" prop="discount_num">
                    <div class="inline mr-xs" style="width:95%">
                        <el-input v-model="form.discount_num"
                                  type="number"
                                  title=""
                                  :disabled="flag===2||flag===3">
                        </el-input>
                    </div>
                </el-form-item>
                <el-form-item label="有效时间：" required>
                    <el-date-picker class="inline "
                                    v-model="form.valid_time"
                                    type="datetime"
                                    :picker-options="pickerstart"
                                    placeholder="开始时间"
                                    :disabled="flag===2||flag===3">
                    </el-date-picker>
                    -
                    <el-date-picker class="inline "
                                    v-model="form.over_time"
                                    type="datetime"
                                    placeholder="结束时间"
                                    :picker-options="pickerend"
                                    :disabled="flag===2||flag===3">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                    <div class="inline " style="width:95%">
                        <el-input type="textarea"
                                  v-model="form.remark"
                                  :disabled="flag===2||flag===3">
                        </el-input>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <template v-if="flag!==1">
            <div class="mt-lg mb-xs">操作日志</div>
            <div class=" mb-md">
                <el-table :data="form.log"
                          border
                          style-width="100%">
                    <el-table-column
                        prop="create_time"
                        width="160px"
                        label="操作时间">
                    </el-table-column>
                    <el-table-column
                        prop="create"
                        label="操作人">
                    </el-table-column>
                    <el-table-column
                        prop="type"
                        label="操作状态">
                    </el-table-column>
                    <el-table-column
                        prop="remark"
                        label="操作内容"
                        width="300px">
                    </el-table-column>
                </el-table>
            </div>
        </template>
        <div slot="footer">
            <el-button v-if="flag===1" type="primary" @click="submit" > 提交审核 </el-button>
            <el-button v-if="flag===3" type="primary" @click="submit_pass" > 审核通过 </el-button>
            <el-button v-if="flag===3" type="primary" @click="submit_not_pass"> 审核未通过 </el-button>
            <el-button v-if="flag===4" type="primary" @click="submit_approval" > 提交审批 </el-button>
            <el-button v-if="flag===4" type="primary" @click="submit_cancel"> 作废 </el-button>
            <el-button v-if="flag===1" @click="show=false"> 取消 </el-button>
            <el-button v-if="flag!==1" @click="show=false"> 关闭 </el-button>
        </div>
        <add-goods v-model="addGoodsShow" @selected="addGoods"></add-goods>
        <page-dialog v-model="errorShow" :title="errorTitle" width="300px">
            <el-input type="textarea" v-model="errorMessage" placeholder="请输入原因,,,,,,"></el-input>
            <div slot="footer">
                <el-button size="mini" type="primary" @click="submit_error" :disabled="!errorMessage">提交</el-button>
                <el-button size="mini" @click="errorShow=false">取消</el-button>
            </div>
        </page-dialog>
    </page-dialog>
</template>

<script>
    import {api_warehouse_options,api_goods_discount_add,api_goods_discount_price,api_goods_discount_edit} from '@/api/subsidized-list.js'
    export default {
        name: "subsidized-sku",
        data(){
            var validator_discount_num = (rule,value,callback)=>{
              if(value){
                  if(Number(value)<0){
                      callback(new Error("跌价产品总数不能小于0"))
                  }
                  callback();
              }else{
                  callback();
              }
            };

            var validator_discount_value = (rule,value,callback)=>{
                if(value){
                   let type = this.form.discount_type;
                   switch(type){
                       case 1:
                           if(Number(value)<0){
                               callback(new Error('跌价金额不能小于0'))
                           }
                           callback();
                           break;
                       case 2:
                           if(Number(value)<0||Number(value)>100){
                               callback(new Error('跌价比例必须在0~100范围内'))
                           }
                           callback();
                           break;
                   }
                }else{
                    let name = this.form.discount_type===1?"跌价金额":"跌价比例";
                    callback(new Error(`${name} 不能为空 `))
                }
            }
            return {
                rules:{
                    discount_value:[
                        {validator:validator_discount_value,trigger:'blur'}
                    ],
                    discount_num:[
                        {validator:validator_discount_num,trigger:'blur'}
                    ]
                },
                show:this.value,
                value1:"",
                discount_type_options:[
                    {label:"跌价金额",value:1},
                    {label:"跌价比例",value:2}
                ],
                warehouse_options:[],
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.form.over_time){
                            if( (new Date(`${this.form.over_time}`)).getTime() < Date.now()){
                                return time.getTime()<(Date.now()-24*3600*1000)
                            }else{
                                return (time.getTime()>(new Date(`${this.form.over_time}`)).getTime())||(time.getTime()<Date.now()-24*3600*1000)
                            }
                        }else{
                            return time.getTime()< (Date.now()-24*3600*1000)
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.form.valid_time){
                            if((new Date(`${this.form.valid_time}`)).getTime()> Date.now()){
                                return time.getTime()<(new Date(`${this.form.valid_time}`).getTime()-24*3600*1000)
                            }else{
                                return time.getTime()<(Date.now()-24*3600*1000)
                            }

                        }else{
                            return time.getTime()< (Date.now()-24*3600*1000)
                        }
                    }
                },
                addGoodsShow:false,
                errorShow:false,
                errorTitle:"",
                errorMessage:"",
                errorFlag:0 // 1 审核不通过  2 作废
            }
        },
        created(){
            this.getWarehouseList();
        },
        methods:{
            submit(){
                this.$refs['form'].validate((valid)=>{
                    if(valid){
                        this.submit_data();
                    }
                })
            },
            submit_data(){
                let data = window.clone(this.form);
                data.valid_time && (data.valid_time=window.fdatetime(data.valid_time));
                data.over_time && (data.over_time = window.fdatetime(data.over_time));
                if(!data.warehouse_id){
                    this.$message({type:"error",message:"仓库不能为空"});
                    return;
                }
                if(!data.sku||!data.sku_id){
                    this.$message({type:"error",message:"SKU不能为空"});
                    return;
                }
                if(!data.discount_value){
                    let name = data.discount_type===1?"跌价金额":"跌价比例";
                    this.$message({type:"error",message:`${name}不能为空`});
                    return;
                }
                this.$http(api_goods_discount_add,data).then(res=>{
                    this.$message({type:"success",message:res.message});
                    this.show = false;
                    this.$emit('refresh')
                }).catch(error=>{
                    this.$message({type:"error",message:error.message||message});
                })
            },
            getWarehouseList(){
                this.$http(api_warehouse_options).then(res=>{
                    this.warehouse_options = res.map(val=>{
                        return {
                            label:val.name,
                            value:val.id
                        }
                    })
                }).catch(error=>{
                    this.$message({type:"error",message:error.message||error})
                })
            },
            addSku(){
                this.addGoodsShow = true;
            },
            addGoods(addForm){
                if(addForm[0].length>1){
                    this.$message({type:"warning",message:"当前SKU仅可选择一条,请重新选择"});
                    return ;
                }
                let sku = addForm[0][0];
                this.$set(this.form,"sku",sku.sku);
                this.$set(this.form,"sku_id",sku.sku_id);
                this.$set(this.form,"goods_id",sku.goods_id);
                this.$http(api_goods_discount_price,this.form.sku_id,this.form.warehouse_id).then(res=>{
                    this.$set(this.form,'discount_num',res.discount_num);
                    this.$set(this.form,'new_price',res.new_price);
                    this.$set(this.form,"inventory_price",res.inventory_price);
                    this.$set(this.form,'last_purchase_price',res.last_purchase_price);
                }).catch(error=>{
                    this.$message({type:"error",message:error.message||error});
                })
            },
            changeVal(){
                this.form.discount_value = "";
            },
            submit_pass(){  // 审核通过
                let data = window.clone(this.form);
                this.$set(data,'status',1);
                this.$http(api_goods_discount_edit,this.param.id,data).then(res=>{
                    this.$message({type:"success",message:res.message});
                    this.show = false;
                    this.$emit('refresh');
                }).catch(error=>{
                    this.$message({type:"error",message:error.message||error});
                })
            },
            submit_not_pass(){  //审核未通过
                this.errorShow = true;
                this.errorMessage = "";
                this.errorTitle = "审核不通过的原因";
                this.errorFlag = 1;
            },
            submit_error(){
                let data = window.clone(this.form);
                this.$set(data,"remark",this.errorMessage);
                switch(this.errorFlag){
                    case 1:
                        // 审核未通过原因提交
                        this.$set(data,'status',2);
                        break;
                    case 2:
                        // 作废原因提交
                        this.$set(data,'status',3);
                        break;
                }
                this.$http(api_goods_discount_edit,this.param.id,data).then(res=>{
                    this.$message({type:"success",message:res.message});
                    this.show = false;
                    this.errorShow =  false;
                    this.$emit('refresh');
                }).catch(error=>{
                    this.$message({type:"error",message:error.message||error});
                });
            },
            submit_approval(){  // 提交审批
                let data = window.clone(this.form);
                this.$set(data,'status',0);
                data.valid_time && (data.valid_time=window.fdatetime(data.valid_time));
                data.over_time && (data.over_time = window.fdatetime(data.over_time));
                this.$http(api_goods_discount_edit,this.param.id,data).then(res=>{
                    this.$message({type:"success",message:res.message});
                    this.show = false;
                    this.$emit('refresh');
                }).catch(error=>{
                    this.$message({type:"error",message:error.message||error});
                })
            },
            submit_cancel(){    // 作废
                this.errorShow = true;
                this.errorMessage = "";
                this.errorTitle = "作废的原因";
                this.errorFlag = 2;
            },
        },
        props:{
            value:{
                type:Boolean,
                required:true
            },
            title:{
                type:String,
                required:true
            },
            form:{
                type:Object,
                required:true
            },
            /*标记多种情况下的显示*/
            flag:{
                type:Number,
                required:true
            },
            param:{}
        },
        watch:{
            show(val,oldVal){
                this.$emit('input',val)
            },
            value(val,oldVal){
                if(val){
                    this.show = val
                }
            }
        },
        components:{
            "add-goods":require('@/view/procurement/plan/add-goods.vue').default,
        }
    }
</script>

<style lang="stylus" scoped>
.info-wrap{
    width:530px;
    margin:15px auto;
}
</style>
