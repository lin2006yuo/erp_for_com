<template>
    <div class="p-specification">
        <div v-for="(item,index) in productGoodsdev" :key="index" style="padding:20px 0;">
            <label>{{item.name}}</label>
            <div style="border: 1px solid #ddd;padding:20px 5px;">
                <el-checkbox v-for="attr in item.attribute_value" :key="index" :label="attr.id" v-model="attr.selected">
                    {{attr.value}}
                </el-checkbox>
            </div>
        </div>
        <div class="t-right">
            <el-button type="primary" size="mini" @click="create_sku_msg">生成SKU信息</el-button>
            <!--<el-button @click="test">test</el-button>-->
        </div>
        <table v-if="isCreateSku && !isSingle" class="sku-table" cellspacing="0" width="100%" style="border-color:rgb(221, 221, 221)">
            <thead>
                <tr>
                    <th>是否启用</th>
                    <th>sku</th>
                    <th v-for="(item, index) in keys" :key="index" v-if="item.startsWith(2)">{{item.replace(/^2/,'')}}</th>
                    <th>重量</th>
                    <th>价格</th>
                    <th>尺寸</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in view_json" :key="index">
                    <td>
                        <el-checkbox v-model="item.isSelect"></el-checkbox>
                    </td>
                    <td>
                        <el-input v-model="item['sku']" disabled></el-input>
                    </td>
                    <td v-for="(row,key, index) in item" :key="index" v-if="key.startsWith(2)">{{row}}</td>
                    <td>
                        <div>
                            <label>净重：</label>
                            <el-input class="inline skuw" v-model="item['weight'].weight"></el-input>
                        </div>
                        <div>
                            <label>毛重：</label>
                            <el-input class="inline skuw" v-model="item['weight'].net_weight"></el-input>
                        </div>
                    </td>
                    <td>
                        <div>
                            <label>采购价：</label>
                            <el-input class="inline skuw" v-model="item['price'].purchase_price"></el-input>
                        </div>
                        <div>
                            <label>销售价：</label>
                            <el-input class="inline skuw" v-model="item['price'].advice_price"></el-input>
                        </div>
                    </td>
                    <td>
                        <div>
                            <label>长：</label>
                            <el-input class="inline skuw" v-model="item['lengths'].length"></el-input>
                        </div>
                        <div>
                            <label>宽：</label>
                            <el-input class="inline skuw" v-model="item['lengths'].width"></el-input>
                        </div>
                        <div>
                            <label>高：</label>
                            <el-input class="inline skuw" v-model="item['lengths'].height"></el-input>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <table v-if="isCreateSku && isSingle" class="sku-table" cellspacing="0" width="100%" style="border-color:rgb(221, 221, 221)" v-show="isCreateSku">
            <thead>
            <tr>
                <th>是否启用</th>
                <th>sku</th>
                <th>单属性</th>
                <th>采购价 / 销售价（CNY）</th>
                <th>净重 / 毛重 （g）</th>
                <th>长 / 宽 / 高（cm）</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in single_view_json" :key="index">
                <td>
                    <el-checkbox v-model="item.isSelect"></el-checkbox>
                </td>
                <td>
                    <el-input disabled></el-input>
                </td>
                <td>单属性</td>
                <td>
                    <div>
                        <label>采购价：</label>
                        <el-input class="inline skuw" v-model="item.price.purchase_price"></el-input>
                    </div>
                    <div>
                        <label>销售价：</label>
                        <el-input class="inline skuw" v-model="item.price.advice_price"></el-input>
                    </div>
                </td>
                <td>
                    <div>
                        <label>净重：</label>
                        <el-input class="inline skuw" v-model="item.weights.weight"></el-input>
                    </div>
                    <div>
                        <label>毛重：</label>
                        <el-input class="inline skuw" v-model="item.weights.net_weight"></el-input>
                    </div>
                </td>
                <td>
                    <div>
                        <label>长：</label>
                        <el-input class="inline skuw" v-model="item.lengths.length"></el-input>
                    </div>
                    <div>
                        <label>宽：</label>
                        <el-input class="inline skuw" v-model="item.lengths.width"></el-input>
                    </div>
                    <div>
                        <label>高：</label>
                        <el-input class="inline skuw" v-model="item.lengths.height"></el-input>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="stylus" type="text/stylus">
    .p-specification{
        .sku-table{
            thead{
                th{
                    border-left: 1px solid #C0CCDA;
                    border-top: 1px solid #C0CCDA;
                    border-bottom: 1px solid #C0CCDA;
                    text-align: center;
                }
                tr{
                    th:last-child{
                        border-right: 1px solid #C0CCDA;
                    }
                }
            }
            tbody{
                td{
                    border-left: 1px solid #C0CCDA;
                    border-bottom: 1px solid #C0CCDA;
                    text-align: center;
                }
                tr{
                    td:last-child{
                        border-right: 1px solid #C0CCDA;
                    }
                }
            }
      }
    }
</style>
<script>

    export default{
        data(){
            return {
                baseAtr:{},
                view_json:[],
                single_view_json:[],
                keys:[],
                isCreateSku: false
            }
        },
        methods: {
            test(){
              let sku = this.parent_event();
                console.log("test", sku);
            },
            parent_event(){
                if(!this.isSingle){
                    return this.selectSku();
                }else {
                   return this.singleSelectSku();
                }
            },
            singleSelectSku(){
                let isSelect = this.single_view_json[0].isSelect;
                if(isSelect){

                    return [{
                        "action":"add",
                        "sku":"",
                        "id":0,
                        "alias_sku":[],
                        "name":"",
                        attributes: this.single_view_json[0].attributes,
                        weight:this.single_view_json[0].weights.weight,
                        net_weight: this.single_view_json[0].weights.net_weight,
                        purchase_price: this.single_view_json[0].price.purchase_price,
                        advice_price: this.single_view_json[0].price.advice_price,
                        height:  this.single_view_json[0].lengths.height,
                        length: this.single_view_json[0].lengths.length,
                        width: this.single_view_json[0].lengths.width
                    }]
                }else {
                    return []
                }

            },
            selectSku(){
                //console.log(this.view_json);
                let sku_list = [];
                let select_view_json = this.view_json.filter(item=>{
                    return item.isSelect;
                });
                console.log(select_view_json);
                select_view_json.forEach((item, index)=>{
                    let attributes = [];
                    for(let key in item){
                        if(key.startsWith(2)){
                            let value = item[key];
                            let code = key.replace(/^[0-9]/,'');
                            let attribute = this.find_attr(code, value);
                            attributes.push(attribute);
                        }
                    }
                   //  console.log(attributes);attributes创建成功
                    let sku = {
                        "action":"add",
                        "sku":"",
                        "id":0,
                        "alias_sku":[],
                        "name":"",
                        attributes,
                        weight:item.weight.weight,
                        net_weight: item.weight.net_weight,
                        purchase_price: item.price.purchase_price,
                        advice_price: item.price.advice_price,
                        height:  item.lengths.height,
                        length: item.lengths.length,
                        width: item.lengths.width
                    };
                    //每条sku创建成功
                    sku_list.push(sku);
                });
                //console.log('sku_list',sku_list);
                return sku_list;
            },

            find_attr(code, value){
                console.log(code, value);
                console.log(this.productGoodsdev);
                let attributes = {};
                let row = this.productGoodsdev.find(item=>{
                    return item.name === code;
                });
                if(!!row){
                    attributes.attribute_id = row.attribute_id;

                    let find = row.attribute_value.find(item=>{
                        return item.value === value
                    });
                    if(!!find){
                        attributes.value_id = find.id;
                    }
                }
                return attributes;

            },
            no_single(){
                this.view_json = [];
                //1. 获取勾选属性
                let select_arr = this.get_select_attr();
                //2. 排列组合
                let skus_arr = this.get_skus(select_arr);
                //3. 重新组合为json
                let skus_json = this.get_sku_json(skus_arr);
                //4. 获取基础属性
                this.get_base_atr();
                //5. 组装页面展示数据
                let view_json = this.get_view_json(skus_json);
                this.view_json.push(...view_json);
                this.keys = Object.keys(this.view_json[0]);
            },
            is_single(){
                let single_sku = {
                    isSelect:true,
                    sku:'',
                    attributes:{
                        attribute_id:17,
                        code: '单属性'
                    },
                    weights: {
                        weight: this.fromData.weight,
                            net_weight: this.fromData.net_weight
                    },
                    price: {
                        purchase_price: this.fromData.purchase_price,
                            advice_price: this.fromData.advice_price
                    },
                    lengths: {
                        height: this.fromData.height,
                            length: this.fromData.length,
                            width: this.fromData.width
                    }
                };
                this.single_view_json.push(single_sku);
            },
            create_sku_msg(){
                if(!this.isSingle){
                    this.no_single();
                }else {
                    this.is_single();
                }
                this.isCreateSku = true;
            },
            get_base_atr(){
                this.baseAtr = {
                    weights: {
                        weight: this.fromData.weight,
                        net_weight: this.fromData.net_weight
                    },
                    price: {
                        purchase_price: this.fromData.purchase_price,
                        advice_price: this.fromData.advice_price
                    },
                    lengths: {
                        height: this.fromData.height,
                        length: this.fromData.length,
                        width: this.fromData.width
                    }
                };
            },
            // 组装展示在页面的数据个数
            get_view_json(skus_json){
                skus_json.forEach(item=>{
                    item.isSelect = false;
                    item['sku'] = '';
                    item['weight'] = window.clone(this.baseAtr.weights);
                    item['price'] = window.clone(this.baseAtr.price);
                    item['lengths'] = window.clone(this.baseAtr.lengths);
                });
                return skus_json;
            },
            //将排列组合的数组转化为json
            get_sku_json(skus_arr){
               // console.log(skus_arr);
                let skus_json = skus_arr.map(item=>{
                    let obj = {};
                    let splitArr = item.split(',');
                    splitArr.forEach(row=>{
                        let arr = row.split('_');
                        obj[2+arr[0]] = arr[1]
                    });
                    return obj;
                });
               console.log(1,skus_json);
               return skus_json;
            },
            //获取勾选属性
            get_select_attr(){
                let attrArr = [];
                this.productGoodsdev.map(item=>{
                    return {
                        name: item.name,
                        select_attr: (()=>{
                            return item.attribute_value.filter(row=>{
                               return !!row.selected
                            }).map(res=>{
                                return res.value
                            })
                        })()
                    }
                }).filter(item=>{
                    return item.select_attr.length > 0
               }).forEach(item=>{
                   let arr = [];
                   item.select_attr.forEach(row=>{
                       arr.push(`${item.name}_${row}`);
                   });
                   attrArr.push(arr);
               });
               console.log(attrArr);
               return attrArr;
            },
            get_skus(arr){
                let n = arr.length;
                if (n >= 2) {
                    let len1 = arr[0].length;
                    let len2 = arr[1].length;
                    let lenBoth = len1 * len2;
                    let items = new Array(lenBoth);

                    let index = 0;
                    for (let i = 0; i < len1; i++) {
                        for (let j = 0; j < len2; j++) {
                            items[index] = arr[0][i] +","+ arr[1][j];
                            index++;
                        }
                    }
                    let newArr = new Array(n - 1);
                    for(let i=2;i<arr.length;i++){
                        newArr[i-1] = arr[i];
                    }
                    newArr[0] = items;
                    return this.get_skus(newArr);
                } else {
                    return arr[0];
                }
            }
        },
        computed: {
            isSingle(){
                return this.productGoodsdev.length === 0
            }
        },
        watch: {},
        props: {
            fromData:{},
            productGoodsdev:{}
        },
        components: {}
    }
</script>

