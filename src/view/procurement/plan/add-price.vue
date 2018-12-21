    <template>
        <div class="c-add-price">
            <page-dialog title="添加新报价" v-model="priceBox" size="large" :close-on-click-modal="false">
                <div style="height: auto;">
                    <el-table
                      :data="supplierData"
                      highlight-current-row
                    >
                    <el-table-column label="SKU" inline-template>
                      <span>{{row.sku}}</span>
                    </el-table-column>
                    <el-table-column label="名称" inline-template>
                      <span>{{row.name}}</span>
                    </el-table-column>
                    <el-table-column label="新增报价" inline-template align="left">
                        <div>
                          <el-row class="mt-mini" v-for="(item,index) in row.section"
                                  :key="index"
                                  :gutter="4">
                            <el-col :span="11">
                              <input class="el-input__inner inline" placeholder="最小数量" style="width:84px"
                                     v-model="item.min_quantity" type="number" min="0"
                                     onkeyup="this.value=this.value.replace(/\D/g,'')"
                                     onafterpaste="this.value=this.value.replace(/\D/g,'')"/>
                              —
                              <input class="el-input__inner inline" placeholder="最大数量" style="width:84px"
                                     v-model="item.max_quantity" type="number" min="0"
                                     onkeyup="this.value=this.value.replace(/\D/g,'')"
                                     onafterpaste="this.value=this.value.replace(/\D/g,'')"/>
                            </el-col>
                            <el-col :span="4">
                              <input class="el-input__inner" v-model="item.price"
                                     onkeyup="if(isNaN(value))execCommand('undo')"
                                     placeholder="报价"
                                     onafterpaste="if(isNaN(value))execCommand('undo')">
                            </el-col>
                            <el-col :span="7" v-if="index===0">
                              <el-select v-model="row.currency_code">
                                <el-option :key="item.value" v-for="item in currencyList"
                                           :value="item.value" :label="item.label"
                                           :disabled="item.disabled"></el-option>
                              </el-select>
                            </el-col>
                            <el-col :span="2" v-if="index===0">
                              <div class="mt-mini ml-sm" @click="add_section(row,index)">
                                <img src="../../../assets/add2.png">
                              </div>
                            </el-col>
                            <el-col :span="2" v-if="index>0">
                              <div class="mt-mini ml-sm" @click="delete_section(row,index)">
                                <img src="../../../assets/delete(2).png">
                              </div>
                            </el-col>
                          </el-row>
                          <el-input class="mt-mini" placeholder="请添加链接" v-model="row.link"></el-input>
                          <div>
                            <el-row v-for="(item,index) in row.cycle" :key="index" class="mt-mini">
                              <el-col :span="12">
                                <el-select v-model="item.warehouse_id" placeholder="请选择仓库">
                                  <el-option v-for="it in warehouseList"
                                             :value="it.value"  :key="item.value"
                                             :label="it.label"></el-option>
                                </el-select>
                              </el-col>
                              <el-col :span="10">
                                <input class="el-input__inner" placeholder="交货周期" v-model="item.delivery_days"
                                       type="number" min="0"
                                       onkeyup="this.value=this.value.replace(/\D/g,'')"
                                       onafterpaste="this.value=this.value.replace(/\D/g,'')">
                              </el-col>
                              <el-col :span="2" v-if="index===0">
                                <div class="mt-mini" style="margin-left:15px" @click="add_cycle(row)">
                                  <img src="../../../assets/add2.png" alt="">
                                </div>
                              </el-col>
                              <el-col :span="2" v-if="index>0">
                                <div class="mt-mini" style="margin-left:15px" @click="delete_cycle(row,index)">
                                  <img src="../../../assets/delete(2).png" alt="">
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                        </div>
                      </el-table-column>
                  </el-table>
                  </div>
              <div slot="footer" class="dialog-footer">
                  <el-button size="mini" type="primary" @click="confirm">确定</el-button>
                  <el-button size="mini" @click.native="priceBox=false">取消</el-button>
              </div>
            </page-dialog>
        </div>
    </template>
    <style lang="stylus">
        .c-add-price{
            .el-icon-plus:hover{
              cursor: pointer;
              color: #008BCE;
            }
        }
    </style>
    <script>
      import {
        api_get_sku
      } from '../../../api/purchase';
      import {
        api_get_warehouse,
        api_add_supplier_offer,
      } from "../../../api/supplier-quote";

      import pageDialog from '../../../components/page-dialog.vue'
        export default{
            page:{
                devinfo:{
                    frontEnd:'黎宏珍;张舵',
                    backEnd:'杨伟权;谭斌',
                    createTime:'2017-6-15',
                    updateTime:'2017-8-22'
                }
            },
            data(){
                return{
                  priceBox:false,
                  skuText:'',
                  warehouseList:[]
                }
            },
            methods:{
              api_get_warehouse(){
                this.$http(api_get_warehouse).then(res => {
                  this.warehouseList = res.map(row => {
                    return {
                      label: row.name,
                      value: Number(row.id),
                    }
                  });
                });
              },
              confirm(){
                  if(this.supplierData[0].section.length===1){
                      if(this.supplierData[0].section[0].max_quantity==='' && this.supplierData[0].section[0].max_quantity===''&&this.supplierData[0].section[0].price===''){
                        this.supplierData[0].isEmpty = 1;
                      }
                  }
                  console.log(this.supplierData,'this.supplierData');
                this.$http(api_add_supplier_offer, {goods: this.supplierData}).then(res=>{
                    this.$message({type:"success",message:res.message || res});
                    this.priceBox = false;
                    this.$emit('confirm',this.supplierData[0]);
                }).catch(code=>{
                  this.$message({type:"error",message:code.message || code});
                })

              },
              add_section(row, index){
                let curObj = row.section[row.section.length - 1];
                if (curObj.max_quantity) {
                  if (parseInt(curObj.max_quantity) <= parseInt(curObj.min_quantity)) return this.$message({type:"warning",message:`最大数量 不能小于或者等于 最小数量,请更改！`});
                  let nextLineQuantity = parseInt(curObj.max_quantity) + 1;
                  row.section.push({min_quantity: nextLineQuantity, max_quantity: "", price: ""});
                } else {
                  row.section.push({min_quantity: "", max_quantity: "", price: ""});
                }
              },
              delete_section(row, index){
                row.section.splice(index, 1);
              },
            },
            computed:{
            },
            props: {
              value:{},
              supplierData:{}
            },
            watch:{
            	value(val){
            		this.priceBox = val;
              },
              priceBox(val){
            		this.$emit('input',val);
                this.api_get_warehouse();
              }
            },
            components:{
              pageDialog
            }
        }
    </script>

