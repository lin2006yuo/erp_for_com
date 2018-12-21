<template>
    <div class="p-add-list">
        <page-dialog  v-model="addVisable" size="large"  title="新建采购单" @change="change_dialog" :close-on-click-modal="false">
            <card  label="基本信息" class="mt-sm">
                <el-form   ref="form1" :model="addData" label-width="120px"  :rules="rules">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="采购仓库："      prop="warehouse_id" required>
                                <el-select v-model="addData.warehouse_id" placeholder="请选择" class="default-width" @change="change_depot">
                                    <el-option
                                            :key="item.id"
                                            v-for="item in depots"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="采购人员："   prop="purchase_id" required>
                                <el-select v-model="addData.purchase_id" placeholder="请选择" class="default-width">
                                    <el-option
                                            :key="item.id"
                                            v-for="item in buyers"
                                            :label="item.realname"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="供应商："   prop="supplier_id" required>
                                <scroll v-model="addData.supplier_id" class="inline default-width" textAlign="left" :remote="url_supplier" :fix-params="fix_params"></scroll>
                              <!--  <el-select v-model="addData.supplier_id" placeholder="请选择" class="default-width">
                                    <el-option
                                            v-for="item in suppliers"
                                            :label="item.company_name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>-->
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="实际应付货款：">
                                <span>{{payment}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="币种：">
                                <span>人民币</span>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="实际已付款：">
                                <span>0元</span>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-form-item label="货款：">
                            <span>{{payment}}</span>
                        </el-form-item>
                    </el-row>
                </el-form>
            </card>
            <card  label="物流信息"  class="mt-sm">
                <el-form  :model="addData" label-width="120px"  ref="form2"   :rules="rules" >
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="运输方式："   prop="shipping_type"    required>
                                <el-select v-model="addData.shipping_type" placeholder="请选择"  class="default-width">
                                    <el-option
                                            :key="item.id"
                                            v-for="item in transports"
                                            :label="item.shortname"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="外部流水号：">
                                <el-input v-model="serial" class="default-width"  disabled ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="跟踪号：">
                                <el-input v-model="track"  class="default-width"   disabled ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="预计到达日期：">
                                        <el-date-picker
                                                v-model="addData.expect_arrive_date"
                                                type="date"
                                                placeholder="选择日期"
                                                :picker-options="pickerOptions0"
                                        >
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="运费：">
                                        <el-input v-model="addData.shipping_cost" ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-form>
            </card>
            <card  label="商品信息"  class="mt-sm">
                <div  class="ml-lg mb-xs">
                    <el-button type="primary" size="mini" @click="add_goods" >添加商品</el-button>
                    <!--<el-button type="primary"  size="mini">EXCEL导入</el-button>-->
                </div>
                <table class="template">
                    <tr>
                        <th style="width:50px;">图片</th>
                        <th style="width:130px;">货号(SKU)/货品名称</th>
                        <th style="width:60px;">可用库存</th>
                        <th  style="width:115px;">上次数量/采购数量</th>
                        <th>到货数量/入库数量</th>
                        <th style="width:110px;">采购单价（CNY）</th>
                        <th> 最新采购单价（CNY）</th>
                        <th> 商品重量（G） </th>
                        <th> 当前供应商最新报价（CNY）</th>
                        <th>是否为替换品</th>
                        <th style="width:50px;">操作</th>
                    </tr>
                    <tbody>
                    <tr v-for="(item,index) in addList">
                        <td> <img  :src="item.thumb" height="30px" width="30px"></td>
                        <td>{{item.sku_name}}</td>
                        <td>{{item.available_qty}}</td>
                        <td>
                            <span> {{item.purchase_qty}}</span>/
                            <el-input v-model="item.qty"></el-input>
                        </td>
                        <td>0|0</td>
                        <!--<td> <el-input v-model="item.purchase_price"></el-input></td>-->
                        <td>{{item.supplie_price}}</td><!--2017/3/29修改-->
                        <td>{{item.supplie_price}}</td>
                        <td>{{item.weight}}</td>
                        <td>{{item.supplie_price}}</td>
                        <td>  <el-select v-model="item.is_replace" placeholder="请选择">
                            <el-option
                                    :key="item.value"
                                    v-for="item in options"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select></td>
                        <td><div @click="del_sku(index)" class="del">删除</div></td>
                    </tr>
                    </tbody>
                </table>

            </card>


            <add-goods v-model="addlistVisable"   @add-goods="selected"></add-goods>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini"   @click="save">保  存</el-button>
                <el-button  size="mini" @click=" cancel">取 消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .p-add-list{
        .page-dialog .dialog__body{

        }
        .template{
            font-size: 10px;
        }
        .default-width{
            width: 50%;
        }
        .other-width{
            width: 20%;
        }
        .del{
            cursor: pointer;
            &:hover{
                background: #FF4949;
                color: #ffffff;
            }
        }



    }
</style>
<script>
    import card from "../../../components/card.vue"
    import pageDialog from "../../../components/page-dialog.vue"
    import addGoods from "../../../api-components/add-goods.vue"
    import {publish_edit_depot,publish_edit_user,publish_edit_supplier,publish_edit_carrier,api_publish_add_sku,api_publish_add_pur} from "../../../api/purchase"
    export default{
        data(){
            return{
                url_supplier:config.apiHost+'supplier-offer/supplier',
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }},
                addVisable:false,
                addlistVisable:false,
                serial:"",
                track:"",
                addList:[],
                options:[
                    {label:"是",value:1},
                    {label:"否",value:0},
                ],
                depots:[],
                buyers:[],
                selects:[],
                transports:[],
                addData:{
                    warehouse_id:"",
                    purchase_id:"",
                    supplier_id:"",
                    shipping_type:"",
                    shipping_cost:"",
                    expect_arrive_date:"",
                    sku_json:{},
                },
                rules:{
                    warehouse_id:[{ required: true, message: '仓库不能为空', trigger: 'change' ,type:"number"}],
                    purchase_id:[{ required: true, message: '采购人员不能为空', trigger: 'change', type:"number" }],
                    supplier_id:[{ required: true, message: '供应商不能为空', trigger: 'change' , type:"number"}],
                    shipping_type:[{ required: true, message: '运输方式不能为空', trigger: 'change',type:"number"  }],
                },

            }
        },
        created(){
        },
        mounted(){

        },
        computed:{
            payment(){
                let count=0;
                for(let i=0;i<this.addList.length;i++){
                    count+=Number(this.addList[i].qty)*Number(this.addList[i].supplie_price)
                }
                count+=Number(this.addData.shipping_cost);
                return count
            }
        },
        methods:{
            //获取所有仓库
            depot_init(){
                this.$http(publish_edit_depot).then(res=>{
                    this.depots=res;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            },
            //  获取所有采购人员
            purer_init(){
                this.buyers=[];
                this.$http(publish_edit_user).then(res=>{
                    this.buyers=res;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            },
            //供应商初始化
            /*supplier_init(){
                this.$http(publish_edit_supplier).then(res=>{
                    this.suppliers=res.data;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })

            },*/
            fix_params({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    content:keyword,
                };
            },
            //改变仓库 获取物流方式
            change_depot(i){
                this.addData.shipping_type="";
                this.$http(publish_edit_carrier,{warehouse_id:i}).then(res=>{
                    this.transports=res.data;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })

            },

            keep(){
                let   data=this.clone(this.addData);
                if(data.expect_arrive_date){
                    data.expect_arrive_date=this.addData.expect_arrive_date.getTime()/1000
                }else {
                    delete data.expect_arrive_date
                }
                let add = {};
                this.addList.forEach(row=>{
                    add[row.sku_id] = {purchase_price:row.purchase_price,
                        purchase_qty:row.qty,
                        is_replace:row.is_replace
                    };
                })
                data.sku_json = {add};

                this.$http(api_publish_add_pur,data).then(res=>{
                    this.addVisable=false;
                    this.$message({
                        type:'success',
                        message:res.message || res
                    });
                    this.$emit("update");
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            },
            //保存
            save(){
                // 判断上半部分 3个必填
                let isKeep= false;
                this.$refs.form1.validate((valid)=>{
                    if (valid) {
                        isKeep= true
                    } else {
                        return;
            }
            });
                //判断运输方式必填
                let isCheck= false;
                this.$refs.form2.validate((valid)=>{
                    if (valid) {
                        isCheck= true
                    } else {
                        return ;
                    }
                });
                console.log(this.addList);
                //添加商品必填
                if(this.addList.length==0){
                    this.$message({
                        message: '请添加商品信息！',
                        type: 'warning'
                    });
                    return
                }
                isKeep&&isCheck&&this.keep()
            },
            //对象深度克隆
            clone(obj) {
                var o;
                if (typeof obj == "object") {
                    if (obj === null) {
                        o = null;
                    } else {
                        if (obj instanceof Array) {
                            o = [];
                            for (var i = 0, len = obj.length; i < len; i++) {
                                o.push(this.clone(obj[i]));
                            }
                        } else {
                            o = {};
                            for (var j in obj) {
                                o[j] = this.clone(obj[j]);
                            }
                        }
                    }
                } else {
                    o = obj;
                }
                return o;
            },
            //添加商品
            add_goods(){
                this.addlistVisable=true
            },
            //取消
            cancel(){
              this.addVisable=false
            },
            //添加商品
            selected(sels){
                sels.forEach(row=>{
                    if(this.selects.indexOf(row.id)===-1){
                    this.selects.push(row.id)
                    this.add_sku_init({
                        sku_id:row.id,
                        supplier_id:"",
                    }).then(finalRow=>{
                        this.addList.push(finalRow);
                }).catch(code=>{
                        this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
                }else {
                    this.$message({
                        type:"error",
                        message:`SKU为：${row.sku} 已存在`
                    })
                }
                })

            },

            //删除sku
            del_sku(index){
                let id=Number(this.addList[index].sku_id);
                let i=this.selects.indexOf(id);
                this.selects.splice(i,1)
                this.addList.splice(index,1);
            },
            //请求数据
            add_sku_init(data){
                return this.$http(api_publish_add_sku,data).then(res=>{
                    res = Object.assign(res, {purchase_price:res.price, qty:"",is_replace:0});
                    return Promise.resolve(res);
                });
            },
            //开启时 将下拉框数据请求回来
            change_dialog(val){
                if(val){
                    this.depot_init();
                    this.purer_init();
                   /* this.supplier_init();*/
                }else {
                    this.selects=[];
                    this.addList=[];
                    this.addData={
                        warehouse_id:"",
                        purchase_id:"",
                        supplier_id:"",
                        shipping_type:"",
                        shipping_cost:"",
                        expect_arrive_date:"",
                        sku_json:{},
                    }
                }
            }
        },
        filters:{
        },
        watch:{
            value(val){
                this.addVisable=val
            },
            addVisable(val){
                this.$emit("input",val)
            }
        },
        props:{
            value:{},
        },
        components:{
            card,
            pageDialog,
            addGoods,
            scroll:require('../../../components/scroll.vue').default
        }
    }
</script>
