<template>
    <page-dialog @open="open" :title="title" v-model="addDialog" size="full" width="75%" :close-on-click-modal="false">
        <el-table
                :data="goodsForm.goods"
                class="mt-xs scroll-bar"
                v-loading="isLoading"
                height="550"
                highlight-current-row
        >
          <el-table-column
            type="selection"
            width="35">
          </el-table-column>
          <el-table-column label="图片" inline-template align="center" width="60px">
            <el-popover
              placement="right"
              trigger="hover">
              <img v-lazy="sku_image(row.thumb)" width="200px" height="200px">
              <span slot="reference" v-if="row.thumb">
                             <img :src="row.thumb" height="60px" width="60px" style="border:none">
                        </span>
            </el-popover>
          </el-table-column>
          <el-table-column label="SKU" inline-template align="center" width="120px" show-overflow-tooltip>
            <ui-tips :content="row.sku" :width="90"></ui-tips>
          </el-table-column>

          <el-table-column label="链接" inline-template align="left" width="250px" show-overflow-tooltip>
            <div>
              <el-input @blur="check_isUrl($event, row.link)" v-model="row.link" style="display: inline-block;width: 190px;"></el-input>
            </div>
          </el-table-column>

          <el-table-column label="最新报价（CNY)" inline-template align="left" width="65px" show-overflow-tooltip>
            <span>{{row.price}}</span>
          </el-table-column>

          <el-table-column label="本次报价（CNY)" inline-template align="left" width="120px" show-overflow-tooltip>
            <div>
              <el-input-number v-model="row.price" :min="0" :max="99999999" :controls="false" :debounce="0" style="display: inline-block;width: 50px;"></el-input-number>
            </div>
          </el-table-column>

          <el-table-column label="区间报价（CNY)" inline-template align="left">
            <div>
              <el-row class="mt-mini" v-for="(item,index) in row.section" :key="index" :gutter="4">
                <el-col :span="9">
                  <input class="el-input__inner inline" placeholder="最小数量" style="width:60px"
                         v-model="item.min_quantity" type="number" min="0"
                         onkeyup="this.value=this.value.replace(/\D/g,'')"
                         onafterpaste="this.value=this.value.replace(/\D/g,'')"/>
                  —
                  <input class="el-input__inner inline" placeholder="最大数量" style="width:60px"
                         v-model="item.max_quantity" type="number" min="0"
                         onkeyup="this.value=this.value.replace(/\D/g,'')"
                         onafterpaste="this.value=this.value.replace(/\D/g,'')"/>
                </el-col>
                <el-col :span="4">
                  <input class="el-input__inner inline" v-model="item.price"
                         onkeyup="if(isNaN(value))execCommand('undo')"
                         placeholder="报价"
                         onafterpaste="if(isNaN(value))execCommand('undo')">
                </el-col>
                <el-col :span="2" v-if="index===0">
                  <div class="mt-mini ml-sm" @click="add_section(row,index)">
                    <img src="../../../../assets/add2.png">
                  </div>
                </el-col>
                <el-col :span="2" v-if="index>0">
                  <div class="mt-mini ml-sm" @click="delete_section(row,index)">
                    <img src="../../../../assets/delete(2).png">
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-table-column>
          <el-table-column inline-template label="仓库/交货周期" align="left">
            <div>
              <el-row v-for="(item,index) in row.cycle" :key="index" class="mt-mini">
                <el-col :span="8">
                  <el-select class="inline" v-model="item.warehouse_id" placeholder="请选择仓库">
                    <el-option  v-for="it in warehouseList" :value="it.value" :key="item.value"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <input class="el-input__inner inline" placeholder="交货周期" v-model="item.delivery_days"
                         type="number" min="0"
                         onkeyup="this.value=this.value.replace(/\D/g,'')"
                         onafterpaste="this.value=this.value.replace(/\D/g,'')">
                </el-col>
                <el-col :span="2" v-if="index===0">
                  <div class="mt-mini" style="margin-left:15px" @click="add_cycle(row)">
                    <img src="../../../../assets/add2.png">
                  </div>
                </el-col>
                <el-col :span="2" v-if="index>0">
                  <div class="mt-mini" style="margin-left:15px" @click="delete_cycle(row,index)">
                    <img src="../../../../assets/delete(2).png">
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-table-column>
        </el-table>
        <add-goods v-model="addGoods" @add-goods="add_goods"></add-goods>
        <div slot="footer">
            <el-button type="primary" size="mini" @click="save">确定</el-button>
            <el-button size="mini" @click="cancel">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .inner {
        > .dialog__body {
            > .el-table {
                .cell {
                    overflow: hidden!important;
                }
            }
        }
    }
</style>
<script>
    import pageDialog from "../../../../components/page-dialog.vue";
    import addGoods from "../../../../api-components/add-goods.vue";
    import selectQuery from "../../../../components/select-query.vue";
    import {
        api_get_current,
        api_get_supplier,
        api_get_currency,
        api_get_warehouse,
        api_add_supplier_offer,
        api_update_supplier
    } from "../../../../api/supplier-quote";
    import {plus} from '../../../../define/validator_reg'
    export default{
        data(){
            return {
                url: config.apiHost + 'supplier-offer/supplier',
                addDialog: false,
                isLoading: false,
                content: "",
                addGoods: false,
                supplierList: [],
                currencyList: [],
                warehouseList: [],
                quoteList: [],
                currency_code: '',
                searchData:{
                    skuOrSpu:''
                },
                skuAndSpu:[
                  {label:'SKU',value:'sku'},
                  {label:'SPU',value:'spu'}
                ]
            }
        },
        created(){
            this.api_get_supplier();
            this.api_get_currency();
            this.api_get_warehouse();
        },
        mounted(){
            this.addDialog = this.value;
            this.supId = this.supplier_id
        },
        watch: {
            addDialog(val){
                this.$emit("input", val);
            },
            value(val){
                this.addDialog = val;
            },
        },
        methods: {
            open(){
                this.goods = [];
            },
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.');
                }
                return ""
            },
            change_supplier(val){
                this.$nextTick(() => {
//                        this.api_get_current(val.sku_id,val.supplier_id);
                    let cur = {
                        sku_id: val.sku_id,
                        supplier_id: val.supplier_id
                    }
                    this.$http(api_get_current, cur).then(res => {
                        this.quoteList = res;
                    }).catch(code => {
                        console.log(code);
                    })
                })
            },
            replace(val){
                if (isNaN(val.price)) execCommand('undo')
            },
//                添加商品
            add_goods(addForm){
                addForm.map(row => {
                    this.goodsForm.goods.push({
                        id: Date.now(),
                        goods_id: row.goods_id,
                        sku_id: row.id,
                        sku: row.sku,
                        thumb: row.thumb,
                        name: row.spu_name,
                        supplier_id: this.goodsForm.supplier_id,
                        cycle: [{warehouse_id: "", delivery_days: ""}],
                        section: [{min_quantity: '1', max_quantity: '', price: ""}],
                        currency_code: this.currency_code,
                        link: ""
                    })
                    if (!this.goodsForm.supplier_id) return;
                    this.api_get_current(row.id, this.goodsForm.supplier_id)
                });
            },
//                过滤
            fix_params({page, pageSize, keyword, value}){
                return {
                    page: page,
                    pageSize: pageSize,
                    content: keyword,
                    value: value,
                };
            },
//                添加货品
            add(){
                this.addGoods = true;
            },
//                添加交货周期
            add_cycle(row){
                row.cycle.push({warehouse_id: "", delivery_days: ""});
            },
            delete_cycle(row, index){
                row.cycle.splice(index, 1);
            },
//                添加报价
            add_section(row, index){
                let curObj = row.section[row.section.length - 1];
                if (curObj.max_quantity) {
                    if (parseInt(curObj.max_quantity) <= parseInt(curObj.min_quantity)) return this.$message({type:"warning", message:`最大数量 不能小于或者等于 最小数量,请更改！`});
                    let nextLineQuantity = parseInt(curObj.max_quantity) + 1;
                    row.section.push({min_quantity: nextLineQuantity, max_quantity: "", price: ""});
                } else {
                    row.section.push({min_quantity: "", max_quantity: "", price: ""});
                }
            },
            delete_section(row, index){
                row.section.splice(index, 1);
            },
//                删除
            cur_delete(row){
                this.$confirm('您将删除当前报价，确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let index = this.goodsForm.goods.findIndex(res => {
                        return res.id === row.id
                    });
                    this.goodsForm.goods.splice(index, 1);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
//                保存
            save(){
                let strRegex = "^((https|http|ftp|rtsp|mms)?://)" + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + "(([0-9]{1,3}\.){3}[0-9]{1,3}" + "|" + "([0-9a-z_!~*'()-]+\.)*" + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." + "[a-z]{2,6})" + "(:[0-9]{1,4})?" + "((/?)|" + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
                let re=new RegExp(strRegex);
                for(let i = 0; i < this.goodsForm.goods.length; i++){
                    if(!re.test(this.goodsForm.goods[i].link)){
                        this.$message({type:"error",message:`请输入正确的网址链接`});
                        return false;
                    }
                }
                let params = {
                    goods: this.goodsForm.goods
                };
//                    this.goodsForm.supplier_id && (params.supplier_id = this.goodsForm.supplier_id );
                /*有id是编辑，否则是添加*/
                if (this.goodsForm.id) {
                    this.$http(api_update_supplier, this.goodsForm.id, params).then(res => {
                        this.$message({type:"success",message:res.message || res});
                        this.addDialog = false;
                        this.$emit("update-offer", this.goodsForm.id);
                    }).catch(code => {
                        this.$message({type:"error",message:code.message || code});
                    })
                } else {
                    this.$http(api_add_supplier_offer, params).then(res => {
                        this.$message({type:"success",message:res.message || res});
                        this.addDialog = false;
                        this.$emit("save-offer");
                    }).catch(code => {
                        this.$message({type:"error",message:code.message || code});
                    })
                }
            },
//                取消
            cancel(){
                this.addDialog = false;
            },
            /*获取供应商*/
            api_get_supplier(){
                let data = {};
                this.content && (data.content = this.content);
                this.$http(api_get_supplier, data).then(res => {
                    this.supplierList = res.data.map(row => {
                        return {
                            label: row.company_name,
                            value: row.id,
                        }
                    });
                }).catch(code => {
                    console.log(code);
                });
            },
            /*获取币种*/
            api_get_currency(){
                this.$http(api_get_currency).then(res => {
                    this.currencyList = res.map(row => {
                        //只能选择人民币 其他不可选
                        let disabled = row.code === 'CNY' ? false : true;
                        return {
                            label: row.name,
                            value: row.code,
                            disabled: disabled

                        }
                    })
                    this.currency_code = this.currencyList[0].value;

                }).then(code => {
                    console.log(code);
                });
            },
            /*获取仓库*/
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
            /*获取当前报价*/
            api_get_current(sku_id, supplier_id){
                let cur = {
                    sku_id: sku_id,
                    supplier_id: supplier_id
                }
                this.$http(api_get_current, cur).then(res => {
                    this.quoteList = res;
                }).catch(code => {
                    console.log(code);
                })
            },
            //检查是否是正确的URL
            check_isUrl(event,val){
                console.log(val);
                let strRegex = "^((https|http|ftp|rtsp|mms)?://)" + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + "(([0-9]{1,3}\.){3}[0-9]{1,3}" + "|" + "([0-9a-z_!~*'()-]+\.)*" + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." + "[a-z]{2,6})" + "(:[0-9]{1,4})?" + "((/?)|" + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
                let e = event.currentTarget;
                let re=new RegExp(strRegex);
                if(!re.test(val)){
                    e.style.border = "1px solid red";
                } else {
                    e.style.border = null;
                }
            }
        },
        props: {
            value: {},
            goodsForm: {
                required: true,
                type: Object
            },
            title: {
                require: true,
                type: String
            },
            edit: {
                require: true,
                type: Boolean
            },
            companyN: {}
        },
        components: {
            selectQuery,
            pageDialog,
            addGoods,
            scroll: require('../../../../components/scroll.vue').default,
            uiTips:require('../../../../components/ui-tip.vue').default,
            scrollSelect: require('../../../../components/scroll-select.vue').default,
        }
    }
</script>
