<template>
    <div class="c-basic-sku-table">
        <table class="template" v-if="form.variant&&form.variant.length>0">
            <tr>
                <th></th>
                <th class="required-sign">平台SKU</th>
                <th>参考属性</th>
                <th class="required-sign">商品规格属性</th>
                <th>成本价￥</th>
                <th>重量(g)</th>
                <th class="required-sign">销售价</th>
                <th class="required-sign">可售量</th>
                <th>操作</th>
            </tr>
            <tr>
                <td>
                    <el-checkbox v-model="checkAll"></el-checkbox>
                </td>
                <td>
                    <div class="el-input">
                        <input  class="el-input__inner" v-model="sku" @blur='blur_change("sku",sku)'>
                    </div>
                </td>
                <td></td>
                <td>
                    <div class="el-input">
                        <input v-model="name" class="el-input__inner" @blur="blur_change('name',name)">
                    </div>
                </td>
                <!--成本价-->
                <td></td>
                <!--重量-->
                <td></td>
                <!--销售价-->
                <td>
                    <div class="el-input">
                        <input v-model="price" class="el-input__inner" @blur="blur_change('price',price)">
                    </div>
                </td>
                <!--可售量-->
                <td>
                    <div class="el-input">
                        <input v-model="stock" class="el-input__inner" @blur="blur_change('stock',stock)">
                    </div>
                </td>
                <td>
                    <el-button type="text" @click.native="delete_all">删除</el-button>
                </td>
            </tr>
            <tr v-for="(row,index) in form.variant">
                <td>
                    <el-checkbox v-model="row.isCheck"></el-checkbox>
                </td>
                <td>
                    <el-input v-model="row.sku"></el-input>
                </td>
                <td>
                    {{row.refer_name}}
                </td>
                <td>
                    <el-input v-model="row.name"></el-input>
                </td>
                <td>{{row.cost_price}}</td>
                <td>{{row.weight}}</td>
                <td>
                    <el-input v-model="row.price"></el-input>
                </td>
                <td>
                    <el-input v-model="row.stock"></el-input>
                </td>
                <td>
                    <el-button type="text" @click.native="delete_cur(index)">删除</el-button>
                </td>
            </tr>
        </table>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {
                sku:"",
                name:"",
                price:"",
                stock:"",
                weight:"",
            }
        },
        methods:{
            blur_change(name,val){
                if(!val)return;
                this.form.variant.forEach(row=>{
                    row[name] = val
                });
                switch(name){
                    case 'sku':
                        this.sku = '';
                        break;
                    case 'name':
                        this.name = '';
                        break;
                    case 'price':
                        this.price = '';
                        break;
                    case 'stock':
                        this.stock = '';
                        break;
                    case 'weight':
                        this.weight = '';
                        break;
                }
            },
            delete_cur(index){
                this.form.variant.splice(index,1);
            },
            delete_all(){
                this.$confirm(`此操作将删除下列表中所有的SKU数据，确认此操作吗？`,"提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(()=>{
                    this.form.variant = [];
                }).catch(code=>{
                    this.$message({
                        type:"info",
                        message:"已取消操作"
                    });
                })

            },
        },
        computed:{
            checkAll:{
                get(){
                    return !this.form.variant.find(row=>!row.isCheck);
                },
                set(val){
                    this.form.variant.forEach(row=>{
                        this.$set(row,'isCheck',val);
                    });
                },
            },
        },
        props:{
            form:{},
        },
        components: {}
    }
</script>