<template>
    <el-row>
        <table class="form-item-product">
            <template v-for="(item,index) in form">
                <tr :class="[item.detail_goods.length>0?'success-color-title':'error-color-title']">
                    <td width="16px">{{index + 1}}</td>
                    <td>商品ID：<a class="link" :href="item.channel_item_link" target="_blank">{{item.channel_item_id}}</a></td>
                    <td>平台SKU：<span v-copy>{{item.channel_sku}}</span></td>
                    <td>商品属性</td>
                    <td>商品状态</td>
                    <td>物流属性</td>
                    <td>商品备注</td>
                    <td v-copy>{{item.channel_sku_title}}</td>
                    <td class="width-xs">数量：{{item.channel_sku_quantity}}
                        <el-button class="inline" size="mini" v-if="edit" type="primary" @click.native="add_item(index)">添加商品
                        </el-button>
                    </td>
                </tr>
                <template v-if="item.detail_goods.length>0"
                          v-for="(subitem,subindex) in item.detail_goods">
                    <tr>
                        <td class="relevance">
                            <img v-if="subitem.type===0" src="../../../assets/relevance.png" title="自动关联">
                            <img v-if="subitem.type===1" src="../../../assets/handwork.png" title="人工添加">
                        </td>
                        <td>
                            <el-popover
                                    placement="right"
                                    trigger="hover">
                                <img v-lazy="sku_image(subitem.sku_thumb)" width="200px" height="200px">
                                <span slot="reference" v-if="subitem.sku_thumb">
                                    <img v-lazy="subitem.sku_thumb" height="60px" width="60px" style="border:none">
                                </span>
                            </el-popover>
                        </td>
                        <td>
                           <span v-if="!edit"> SKU：{{subitem.sku}}</span>
                            <span v-else>SKU：
                                <el-select class='inline'
                                           v-model="subitem.sku_id"
                                           @change="change_sku(subitem,$event)"
                                           filterable clearable>
                                    <el-option
                                            v-for="res in subitem.siblingsList"
                                            :label="res.label"
                                            :value="res.value"
                                            :key="res.value"></el-option>
                                </el-select>
                            </span>
                        </td>
                        <td>{{subitem.attributes}}</td>
                        <td>{{subitem.status}}</td>
                        <td>{{subitem.properties}}</td>
                        <td>
                            <div v-if="!edit">{{subitem.note}}</div>
                            <div v-else>
                                <el-input v-model="subitem.note"></el-input>
                            </div>
                        </td>
                        <td>
                            <div>{{subitem.sku_title}}</div>
                        </td>
                        <td>数量：
                            <span v-if="!edit">{{subitem.sku_quantity}}</span>
                            <span v-else>
                            <input class="sub-num" v-model="subitem.sku_quantity" type="number" min="0"
                                   onkeyup="this.value=this.value.replace(/\D/g,'')"
                                   onafterpaste="this.value=this.value.replace(/\D/g,'')"/>
                            <i class="el-icon-delete red pointer" @click="del_item(index,subindex)"></i>
                        </span>
                        </td>
                    </tr>
                    <tr v-if="subitem.message">
                        <td :class="[curStatus?'red':'','t-right']" colspan="9">
                            <span>{{subitem.message}}</span>
                            <el-popover placement="left"
                                        v-if="subitem.instransit_purchase_order_list.length>0&&subitem.instransit_quantity>0"
                                        width="230"
                                        :open-delay="500"
                                        trigger="hover">
                                <el-table
                                    class="scroll-bar"
                                    :max-height="400"
                                    :data="subitem.instransit_purchase_order_list"
                                    highlight-current-row>
                                    <el-table-column label="采购单号" min-width="55" inline-template><div>PO{{row.id}}</div></el-table-column>
                                    <el-table-column label="运单号" inline-template>
                                        <span class="operate" v-if="row.tracking_number" @click="look_logistics(row.tracking_number)">{{row.tracking_number}}</span>
                                    </el-table-column>
                                </el-table>
                                <div class="inline" style="vertical-align: bottom;" slot="reference">
                                    <span class="operate"> 在途库存：{{subitem.instransit_quantity}}</span>
                                </div>
                            </el-popover>
                            <span v-else> 在途库存：{{subitem.instransit_quantity}}</span>
                        </td>
                    </tr>
                </template>
                <template v-if="item.detail_goods.length<=0">
                    <tr>
                        <td colspan="8"></td>
                        <td>
                            <el-checkbox v-model="item.is_deliver_goods" :disabled="!edit">无需发货？</el-checkbox>
                        </td>
                    </tr>
                </template>
            </template>
        </table>
        <el-col :span="24" v-if="showBtn">
            <!--权限  编辑-->
            <permission
                    tag="ElButton"
                    :route="apis.url_update"
                    class="fr mt-xs"
                    v-if="!edit"
                    size="mini"
                    type="primary"
                    @click.native="do_edit"
            >编辑
            </permission>
            <!--<el-button class="fr mt-xs" size="mini" type="primary" @click.native="do_edit">编辑</el-button>-->
            <div class="fr mt-xs" v-else>
                <el-button size="mini" type="primary" @click.native="submit">保存</el-button>
                <el-button size="mini" @click.native="cancel">取消</el-button>
            </div>
        </el-col>
        <add-goods @add-goods="add" v-model="showProductList"></add-goods>
    </el-row>

</template>
<style lang="stylus">
    .form-item-product {
        width: 100%;
        box-sizing: border-box;
        border-collapse: collapse;
        border-left: 1px solid #e0e6ed;
        border-top: 1px solid #e0e6ed;
        font-size: 1.2rem;
        .product-min-width{
            box-sizing:border-box;
            min-width:70px;
        }
        .product-min-width-note{
            box-sizing:border-box;
            min-width:200px;
        }
        td, th {
            border-right: 1px solid #e0e6ed;
            border-bottom: 1px solid #e0e6ed;
            height: 30px;
            text-align: center;
            padding: 0 10px;
        }
        .relevance {
            vertical-align: middle;
        }
        .sub-num {
            width: 35px;
            text-align: center;
        }
        .success-color-title {
            background-color: #E0F7E6;
        }
        .error-color-title {
            background-color: #FBD2C9;
        }
    }
</style>
<script>
    import {api_update,api_set_note,api_get_sku_siblings} from '../../../api/order-local';
    import {url_update} from '../../../api/order-local';
    export default {
        permission: {
            url_update
        },
        data() {
            return {
                showProductList: false,
                selectIndex: 0,
                edit: false,
                oldform: [],
                sku_quantity: 0,
                isDeliverGoods:false,
            }
        },
        methods: {
            look_logistics(number) {
                window.open(`http://cha.chawuliu.cn/?stype=kd&q=${number}`);
            },
            change_sku(row,value){
                if(!row.siblingsList)return;
                let find = row.siblingsList.find(row=>row.value===value);
                if(find){
                    row.attributes = find.attr;
                    row.sku = find.sku;
                }
            },
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.');
                }
                return ""
            },
            submit_params(isTrue) {
                let product_list = [];
                if(this.form&&this.form.length>=0){
                    this.form.forEach(row=>{
                        if(row.detail_goods&&row.detail_goods.length>0){
                            let problemObj = row.detail_goods.find(res=>res.sku_quantity===""||parseFloat(res.sku_quantity)===0);
                            if(!!problemObj)return this.$message({ message: "订单商品数量不能为0或者为空！",type: 'warning'});
                                row.detail_goods.forEach(res=> {
                                    this.edit_note(this.id, res.sku_id, res.note);
                                    let obj = {
                                        sku_id: res.sku_id,
                                        sku_quantity: res.sku_quantity,
                                        type: res.type,
                                    };
                                    if (!!row.id) obj.source_id = row.id;
                                    product_list.push(obj);
                                });
                        }else{
                            if(row.is_deliver_goods){
                                let obj = {
                                    source_id:row.id,
                                };
                                this.$set(obj,'is_deliver_goods',1);
                                product_list.push(obj);
                            }
                        }
                    });
                }
                if(product_list.length<=0)return;
                let params = {
                    product_list: product_list
                };
                if (isTrue) {
                    params.confirm = true;
                }
                this.$http(api_update, this.id, params).then(res => {
                    if(!res.product_list) return this.$message({type:"error",message:res.message||res});
                    this.$emit('submit', this.form);
                    this.edit = false;
                    this.$message(res.message);
                }).catch(code => {
                    if (code.hasOwnProperty("code") && code.code === "confirm") {
                        this.$confirm(`${code.message}`, '提示', {
                            confirmButtonText: '继续',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.submit_params(true);
                        })
                    } else {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        })
                    }
                })
            },
            submit() {
                this.submit_params(false);
            },
            async edit_note(order_id,sku_id,note){
                await this.$http(api_set_note,order_id,sku_id,{note:note}).then(res=>{
                    console.log(res);
                }).catch(code=>{
                    console.log(code);
                })
            },
            cancel() {
                while (this.form.shift()) {
                }
                for (let i = 0; i < this.oldform.length; i++) {
                    this.form.push(this.oldform[i]);
                }
                this.edit = false;
            },
            do_edit() {
                this.oldform = window.clone(this.form);
                this.edit = true;
            },
            del_item(index, subindex) {
                this.form[index].detail_goods.splice(subindex, 1);
            },
            add_item(index) {
                this.showProductList = true;
                this.selectIndex = index;
                this.sku_quantity = this.form[index].channel_sku_quantity;
            },
            add(val,goods) {
                let curList = window.clone(this.form[this.selectIndex].detail_goods);
                let attrKey = goods.keys;
                val.forEach(sel => {
                    if (curList.find(row => {
                            return row.sku_id === sel.id
                        })) {
                        return this.$message({message: `请不要重复添加 ${sel.spu_name}商品`, type:'warning'});
                    } else {
                        let attr = '';
                        attrKey.forEach(row=>{
                            attr =  attr?`${attr},${sel[row]}`:sel[row];
                        });
                        let obj = {
                            note:'',
                            sku_title:sel.spu_name,
                            sku_quantity:!!this.sku_quantity?this.sku_quantity:1,
                            sku_id:sel.id,
                            sku_thumb:sel.thumb,
                            type:1,
                            status:sel.status_txt,
                            attributes:attr
                        };
                        this.get_sku_siblings(obj);
                        this.form[this.selectIndex].detail_goods.push(obj);
                    }
                });
            },
            get_sku_siblings(row){
                this.$http(api_get_sku_siblings,row.sku_id).then(res=>{
                    res = res.map(item=>{
                        return {
                            value:item.id,
                            label:item.attr?`${item.sku}-[${item.attr}]`:item.sku,
                            attr:item.attr,
                            sku:item.sku
                        }
                    });
                    this.$set(row,'siblingsList',res);
                })
            },
            change_quantity(index, subindex, count) {
                console.log(`index:${index} subindex:${subindex}`);
                console.log(count);
            }
        },
        props: {
            form: {
                required: true,
                type: Array
            },
            id: {
                required: true,
            },
            showBtn: {
                default() {
                    return true;
                }
            },
            curStatus: {
                required: true
            },
        },
        components: {
            addGoods: require('../../../api-components/add-goods.vue').default,
        }
    }
</script>
