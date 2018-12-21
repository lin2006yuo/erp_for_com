<template>
    <el-row>
        <table class="pending-product">
            <template v-for="(item,index) in form">
                <tr :class="item.detail_goods.length>0?'success':'error'">
                    <td width="37px">{{index + 1}}</td>
                    <td>商品ID：<a class="link" :href="item.channel_item_link" target="_blank">{{item.channel_item_id}}</a></td>
                    <td>平台SKU：<span v-copy>{{item.channel_sku}}</span></td>
                    <td>商品状态</td>
                    <td>物流属性</td>
                    <td style="width:250px"><span v-if="item.attribute">{{`[${item.attribute}]`}}</span>{{item.channel_sku_title}}</td>
                    <td style="width: 140px;">
                        <div>数量：{{item.channel_sku_quantity}}</div>
                        <el-checkbox v-if="edit && (item.detail_goods.length === 1) && is_new_relate_goods(item)"
                                     :value="is_relate_goods(item)"
                                     @input="relate_goods(item, $event)"
                        >添加关联
                        </el-checkbox>
                        <span v-if="edit" class="operate" @click="add_item(index)">添加商品</span>
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
                                    <img :src="subitem.sku_thumb" height="60px" width="60px" style="border:none">
                                </span>
                            </el-popover>
                        </td>
                        <!--<td>SKU：{{subitem.sku}}</td>-->
                        <td>
                            <span v-if="!edit"> SKU：{{subitem.sku}}</span>
                            <span v-else>SKU：
                                <el-select class='inline'
                                           v-model="subitem.sku_id"
                                           @change="get_selected_sku(subitem,item)"
                                           filterable clearable>
                                    <el-option
                                            v-for="res in subitem.siblingsList"
                                            :label="res.label"
                                            :value="res.value"
                                            :key="res.value"></el-option>
                                </el-select>
                            </span>
                        </td>
                        <td>{{subitem.status}}</td>
                        <td>{{subitem.properties}}</td>
                        <td>{{subitem.sku_title}}</td>
                        <td>数量：<span v-if="!edit">{{subitem.sku_quantity}}</span>
                            <span v-else>
                             <input class="sub-num" v-model="subitem.sku_quantity"
                                    type="number" min="0"
                                    onkeyup="this.value=this.value.replace(/\D/g,'')"
                                    onafterpaste="this.value=this.value.replace(/\D/g,'')"
                             />
                            <i class="el-icon-delete red pointer" @click="del_item(index,subindex)"></i>
                        </span>
                        </td>
                    </tr>
                    <tr v-if="subitem.message">
                        <td :class="[curStatus?'red':'','t-right']" colspan="7">
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
                        <td colspan="6"></td>
                        <td>
                            <el-checkbox v-model="item.is_deliver_goods" :disabled="!edit">无需发货？</el-checkbox>
                        </td>
                    </tr>
                </template>
            </template>
        </table>
        <el-col :span="24" v-if="showBtn">
            <permission
                tag="ElButton"
                :route="apis.url_update"
                v-if="!edit"
                class="fr mt-xs"
                size="mini"
                type="primary"
                @click.native="do_edit">编辑</permission>
            <div v-else class="fr mt-xs">
                <el-button size="mini" type="primary" @click.native="submit">确定</el-button>
                <el-button size="mini" @click.native="cancel">取消</el-button>
            </div>
        </el-col>
        <product-list @add-goods="select" v-model="showProductList"></product-list>
    </el-row>

</template>
<style lang="stylus">
    .pending-product {
        width: 100%;
        box-sizing: border-box;
        border-collapse: collapse;
        border-left: 1px solid #e0e6ed;
        border-top: 1px solid #e0e6ed;
        font-size: 1.2rem;
        td, th {
            border-right: 1px solid #e0e6ed;
            border-bottom: 1px solid #e0e6ed;
            height: 30px;
            text-align: center;
            padding-right:8px;
        }
        .relevance {
            vertical-align: middle;
        }
        .sub-num {
            width: 40px;
            text-align: center;
        }
        .success {
            background-color: #E0F7E6;
        }
        .error {
            background-color: #FBD2C9;
        }
        .el-checkbox__label {
            font-size: 10px;
        }
    }
</style>
<script>
    import {api_update,api_get_sku_siblings} from '../../../api/order-local';
    import {url_update} from '../../../api/order-local';
    import {api_sku_map} from '../../../api/goods-sku-map';
    export default{
        permission:{
            url_update,
        },
        data(){
            return {
                showProductList: false,
                selectIndex: 0,
                edit: false,
                oldform: [],
                sku_quantity: 0,
                isDeliverGoods:false,
                selected_sku:''
            }
        },
        methods: {
            look_logistics(number) {
                window.open(`http://cha.chawuliu.cn/?stype=kd&q=${number}`);
            },
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.');
                }
                return ""
            },
            submit_params(isTrue){
                let product_list = [];
                let siblingsData;//留住旧的siblings数据
                if(this.form&&this.form.length>0){
                    this.form.forEach(row=>{
                        if(row.detail_goods&&row.detail_goods.length>0){
                            let problemObj = row.detail_goods.find(res=>res.sku_quantity===""||parseFloat(res.sku_quantity)===0);
                            if(!!problemObj) return this.$message({ message: "订单商品数量不能为0或者为空！",type: 'warning'});
                            row.detail_goods.forEach(res=>{
                                let obj = {
                                    sku_id: res.sku_id,
                                    sku_quantity: res.sku_quantity,
                                    type: res.type,
                                };
                                if(!!row.id) obj.source_id = row.id;
                                if(!!row.relation) obj.relation = row.relation===true;
                                product_list.push(obj);
                            });
                            siblingsData = clone(row.detail_goods.map(res=>{
                                return {
                                    sku_id:res.sku_id,
                                    siblingsList:res.siblingsList
                                }
                            }));
                        }else{
                            if(row.is_deliver_goods){
                                let obj = {
                                    source_id:row.id,
                                };
                                this.$set(obj,'is_deliver_goods',1);
                                product_list.push(obj);
                            }
                        }
                    })
                }
                if(product_list.length<=0)return;
                let params = {
                    product_list:product_list,
                };
                if(isTrue){
                    params.confirm = true;
                }
                this.$http(api_update, this.id, params).then(res => {
                    if(!res.product_list) return this.$message({type:"error",message:res.message||res});
                    while (this.form.shift()) {}
                    res.product_list.forEach(row => {
                        this.form.push(row)
                    });
                    this.form.forEach(row=>{
                        row.detail_goods.forEach(item=>{
                            let find = siblingsData.find(it=>parseInt(it.sku_id)===parseInt(item.sku_id));
                            if(!!find) this.$set(item,'siblingsList',find.siblingsList);
                        })
                    });
                    this.edit = false;
                    this.$message(res.message);
                    this.$emit('submit', this.form,res.is_handle);
                }).catch(code => {
                    if(code.hasOwnProperty("code")&&code.code==="confirm"){
                        this.$confirm(`${code.message}`, '提示', {
                            confirmButtonText: '继续',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.submit_params(true);
                        })
                    }else{
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        })
                    }
                })
            },
            submit(){
                this.submit_params(false);
            },
            cancel(){
                while (this.form.shift()) {
                }
                for (let i = 0; i < this.oldform.length; i++) {
                    this.form.push(this.oldform[i]);
                }
                this.edit = false;
            },
            do_edit(){
                this.oldform = window.clone(this.form);
                this.edit = true;
            },
            del_item(index, subindex){
                this.form[index].detail_goods.splice(subindex, 1);
            },
            add_item(index){
                this.showProductList = true;
                this.selectIndex = index;
                this.sku_quantity = this.form[index].channel_sku_quantity;
            },
            select(selected){
                let curList = this.form[this.selectIndex].detail_goods;
                selected.forEach(sel => {
                    if (curList.find(row => {
                            return row.sku_id === sel.id
                        })) {
                        return this.$message({message:`请不要重复添加 ${sel.spu_name} 商品`, type:'warning'});
                    } else {
                        let obj = {
                            sku_title:sel.spu_name,
                            sku_quantity:!!this.sku_quantity?this.sku_quantity:1,
                            sku_id:sel.id,
                            sku_thumb:sel.thumb,
                            status:sel.status_txt,
                            type:1,
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
            change_quantity(index, subindex, count){
                console.log(`index:${index} subindex:${subindex}`);
                console.log(count);
            },
            relate_goods(item, val){
                let find = item.detail_goods[0].siblingsList.find(row => row.value === item.detail_goods[0].sku_id);
                const sku = find.sku||this.selected_sku;
                const relate = val ? '相关联' : '取消关联';
                this.$confirm(`您确定将SKU：${sku} 与 平台SKU：${item.channel_sku}${relate}？`,
                    `提示-${relate}`,
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                    item.relation = val;
                }).catch(() => {

                });
            },
            is_relate_goods(item){
                if (item.relation === undefined) {
                    const params = {
                        channel_sku: item.channel_sku,
                        sku_id: item.detail_goods[0].sku_id,
                        channel_id: this.assist.channel_id,
                        account_id: this.assist.channel_account_id,
                    };
                    this.$http(api_sku_map, params).then(res => {
                        this.$set(item, 'relation', res.is_map);
                        if(res.is_map){
                            this.$set(item, 'just_relate', true);
                        }
                    });
                    return !!item.relation;
                } else {
                    return item.relation;
                }
            },
            is_new_relate_goods(item){
                return !item.just_relate;
            },
            get_selected_sku(val,item){
                if(this.edit && (item.detail_goods&&item.detail_goods.length === 1) && this.is_new_relate_goods(item)) {
                    let selected = val.siblingsList.find(row => row.value === val.sku_id);
                    if (!!selected) {
                        this.selected_sku = selected.sku;
                    }
                }
            }
        },
        props: {
            form: {
                required: true,
                type: Array
            },
            assist: {},
            id: {
                required: true,
            },
            showBtn: {
                default(){
                    return true
                }
            },
            curStatus:{
                required:true
            }
        },
        components: {
            productList: require('../../../api-components/add-goods.vue').default,
        }
    }
</script>
