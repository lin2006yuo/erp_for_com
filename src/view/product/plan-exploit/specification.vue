<template>
    <div class="p-specification">
        <div v-for="(item,index) in productGoodsdev" :key="index" style="padding:20px 0;">
            <label>{{item.name}}</label>
            <div style="border: 1px solid #ddd;padding:20px 5px;">
                <el-checkbox-group v-model="item.selectDev">
                    <el-checkbox v-for="attr in item.attribute_value" :key="index" :label="attr.id">
                        {{attr.value}}
                    </el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
        <div class="t-right">
            <el-button type="primary" size="mini" @click="create_sku_msg">生成SKU信息</el-button>
        </div>
        <table v-if="!isSingle" class="sku-table" cellspacing="0" width="100%" style="border-color:rgb(221, 221, 221)" v-show="isCreateSku">
            <thead>
                <tr>
                    <th>是否启用</th>
                    <th>sku</th>
                    <th v-for="(item, index) in keys" :key="index">{{item}}</th>
                    <th>采购价 / 销售价（CNY）</th>
                    <th>净重 / 毛重 （g）</th>
                    <th>长 / 宽 / 高（cm）</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in skuValue" :key="index">
                    <td>
                        <el-checkbox @change="selectSku(index)"></el-checkbox>
                    </td>
                    <td>
                        <el-input v-model="skusList[index].sku" disabled></el-input>
                    </td>
                    <td v-for="(row, index) in item" :key="index">{{row===-1?'':row}}</td>
                    <td>
                        <div>
                            <label>采购价：</label>
                            <el-input class="inline skuw" v-model="skusList[index].price.purchase_price"></el-input>
                        </div>
                        <div>
                            <label>销售价：</label>
                            <el-input class="inline skuw" v-model="skusList[index].price.advice_price"></el-input>
                        </div>
                    </td>
                    <td>
                        <div>
                            <label>净重：</label>
                            <el-input class="inline skuw" v-model="skusList[index].weights.weight"></el-input>
                        </div>
                        <div>
                            <label>毛重：</label>
                            <el-input class="inline skuw" v-model="skusList[index].weights.net_weight"></el-input>
                        </div>
                    </td>
                    <td>
                        <div>
                            <label>长：</label>
                            <el-input class="inline skuw" v-model="skusList[index].lengths.length"></el-input>
                        </div>
                        <div>
                            <label>宽：</label>
                            <el-input class="inline skuw" v-model="skusList[index].lengths.width"></el-input>
                        </div>
                        <div>
                            <label>高：</label>
                            <el-input class="inline skuw" v-model="skusList[index].lengths.height"></el-input>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <table v-if="isSingle" class="sku-table" cellspacing="0" width="100%" style="border-color:rgb(221, 221, 221)" v-show="isCreateSku">
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
            <tr>
                <td>
                    <el-checkbox v-model="checkSingle" @change="selectSingle"></el-checkbox>
                </td>
                <td>
                    <el-input disabled></el-input>
                </td>
                <td>单属性</td>
                <td>
                    <div>
                        <label>采购价：</label>
                        <el-input class="inline skuw" v-model="baseAtr.price.purchase_price"></el-input>
                    </div>
                    <div>
                        <label>销售价：</label>
                        <el-input class="inline skuw" v-model="baseAtr.price.advice_price"></el-input>
                    </div>
                </td>
                <td>
                    <div>
                        <label>净重：</label>
                        <el-input class="inline skuw" v-model="baseAtr.weights.weight"></el-input>
                    </div>
                    <div>
                        <label>毛重：</label>
                        <el-input class="inline skuw" v-model="baseAtr.weights.net_weight"></el-input>
                    </div>
                </td>
                <td>
                    <div>
                        <label>长：</label>
                        <el-input class="inline skuw" v-model="baseAtr.lengths.length"></el-input>
                    </div>
                    <div>
                        <label>宽：</label>
                        <el-input class="inline skuw" v-model="baseAtr.lengths.width"></el-input>
                    </div>
                    <div>
                        <label>高：</label>
                        <el-input class="inline skuw" v-model="baseAtr.lengths.height"></el-input>
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
                selectSkuList:[],
                skusList:[],
                skuValue:[],
                baseAtr:{
                    price:'',
                    weights:'',
                    lengths:''
                },
                keys:[],
                idList:[],
                selectIndex:[],
                slelctSku:[],
                isCreateSku:false,
                checkSingle: false,
                skus:[]
            }
        },
        methods: {
            selectSku(index){
               let find =  this.selectIndex.findIndex(res=>{
                    return res === index
                });
               if(find === -1){
                   this.selectIndex.push(index);
                   this.slelctSku.push(this.skusList[index])
               }else {
                   this.selectIndex.splice(find,1);
                   this.slelctSku.splice(find,1)
               }
                this.create_spu(this.slelctSku);
            },
            selectSingle(){
                if(this.checkSingle){
                    this.create_spu();
                }
            },
            skus_data(){//整理勾选的sku信息
                return{
                    action:'add',
                    alias_sku:'',
                    name:'',
                    retail_price:'',
                    cost_price:'',
                    weight:'',
                    attributes:[]
                }
            },
            create_spu(selection){
                let list = [];
                if(this.isSingle){
                    list.push({
                        retail_price : this.baseAtr.price.advice_price,
                        cost_price : this.baseAtr.price.purchase_price,
                        weight : this.baseAtr.weights.weight,
                        attributes:{16:'单属性'}
                    });
                    console.log("test", list);
                }else {
                    let sku = this.skus_data();
                    selection.forEach(res=>{
                        let arr = window.clone(sku);
                        arr.sku = res.sku;
                        arr.retail_price = res.price.advice_price;
                        arr.cost_price = res.price.purchase_price;
                        arr.weight=res.weights.net_weight;
                        arr.attributes = this.get_attributes(res);
                        list.push(arr);
                    });
                    this.selectSkuList = list;
                }
                this.$emit('get-sku-list',list);
                this.skus = list;
            },

            get_attributes(res){
               let arr=[];
                this.idList.forEach(row=>{
                    console.log(res,row);
                    arr.push({attribute_id:row,attribute_value:res[row]});
                });
                return arr;
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

            attributes_data(){//整理属性数据
                let selectList = [];
                this.productGoodsdev.forEach(res => {
                    let list = {type: res.type, attribute_id: res.attribute_id, attribute_value: []};
                    res.selectDev.forEach(row => {
                        let index = res.attribute_value.findIndex(list => {
                            return row === list.id;
                        });
                        list.attribute_value.push(res.attribute_value[index]);
                    });
                    selectList.push(list);
                });
                return selectList;
            },


            //生成sku
            create_sku_msg(){
                this.isCreateSku = true;
                this.get_base_atr();
                if(this.isSingle){return}
                let data = this.attributes_data();
                console.log(data);
                let selectData = data.map(res => {
                    return res.attribute_value;
                });
                for (let i = 0; i < selectData.length; i++) {
                    if (selectData[i].length === 0) {
                        selectData[i] = [-1];
                    } else {
                        selectData[i] = selectData[i].map(res => {
                            return res.id;
                        });
                    }
                }
                //数据排列组合
                let skus = this.get_skus(selectData);
                let skuArr = [];
                skus.forEach(res=>{
                    let arr=[];
                    arr = res.split(',');
                    skuArr.push(arr);
                });
                //重新整理数据
                let skuList = [];
                let skuValue=  [];
                skuArr.forEach(res=>{
                    let sku = {};
                    let value =[];
                    let i=0;
                    this.productGoodsdev.forEach(list=>{
                        sku[list.attribute_id] = this.get_attr_label(list.attribute_value,res[i]);
                        value[i] = this.get_attr_label(list.attribute_value,res[i]);
                        i++;
                    });
                    skuList.push(sku);
                    skuValue.push(value);
                });
                this.keys = this.get_label(skuList, this.productGoodsdev);
                this.skuValue = skuValue;
                this.idList = Object.keys(skuList[0]);
                this.skusList= window.clone(skuList);
                this.skusList.forEach(res=>{
                    this.$set(res,'sku','');
                    this.$set(res,'weights',this.baseAtr.weights);
                    this.$set(res,'price',this.baseAtr.price);
                    this.$set(res,'lengths',this.baseAtr.lengths);
                });


                console.log("test", this.skusList);

                this.isCreateSku = true;
            },
            get_label(skuList,proList){
                let arr=[];
                let keys =Object.keys(skuList[0]);
                keys.forEach(res=>{
                    let index = proList.findIndex(row=>{
                        return Number(row.attribute_id) === Number(res);
                    });
                    arr.push(proList[index].name);
                });
                return arr;
            },

            get_attr_label(arr,id){
                if(Number(id)!==-1){
                    let index = arr.findIndex(res=>{
                        return  res.id === Number(id)
                    });
                    return arr[index].value
                }else {
                    return -1
                }
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

