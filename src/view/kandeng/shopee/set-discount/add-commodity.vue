<template>
    <page-dialog title="添加商品" v-model="show" size="large" @open="open" :close-on-cilck-modal="false">
        <div>
            <el-select v-model="searchData.snType" class="inline s-width-small">
                <el-option
                    :key="item.value"
                    v-for="item in goods"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <order-input v-if="searchData.snType==='sku'||searchData.snType==='spu'"
                         class="inline mr-md width-super" v-model="searchData.snText" @keydown="search"></order-input>
            <el-input placeholder="请输入搜索内容..."
                      v-else
                      v-model="searchData.snText"
                      @click.native="search"
                      class="inline mr-md enter-result width-super"></el-input>
            <el-button class="inline ml-sm" type="primary" size="mini" @click.native="search">搜索</el-button>
            <el-button class="inline ml-sm" size="mini" @click.native="clear">清空</el-button>
        </div>
        <el-table
            border
            :data="discountData"
            highlight-current-row
            max-height="400"
            class="mb-sm scroll-bar mt-xs"
            @select="selected"
            @select-all="selectedAll">
            <el-table-column
                type="selection"
                width="35">
            </el-table-column>
            <el-table-column
                label="图片"
                inline-template>
                <img :src="row.images[0]" style="vertical-align: middle;height:60px;width:60px"/>
            </el-table-column>
            <el-table-column
                label="平台SPU"
                inline-template>
                <ui-tip :content="row.item_sku" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                label="刊登标题"
                inline-template>
                <ui-tip :content="row.name" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                :label="`销售价${curCurrency}`"
                inline-template>
                <ui-tip :content="row.price" :width="98"></ui-tip>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary">确定</el-button>
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_on_selling_list} from '../../../../api/shopee-publish';
    export default{
        data(){
            return{
                curCurrency:'',
                show:this.value,
                searchData:{
                    snType:"sku",
                    snText: "",
                },
                clears:{
                    snType:"sku",
                },
                goods:[
                    {
                        value: 'variation_sku',
                        label: '平台SKU'
                    }, {
                        value: 'item_sku',
                        label: '平台SPU'
                    },  {
                        value: 'title',
                        label: '刊登标题'
                    },
                ],
                discountData:[],
                selectAdd:[],

            }
        },
        methods:{

            open(){
                this.searchData.snType = 'sku';
                this.searchData.snText = '';
                this.get_goods();
            },
            clear(){
                this.searchData.snType = 'sku';
                this.searchData.snText = '';
            },
            keep(){
            	this.$emit('select-add',this.selectAdd);
                this.show = false
            },
            search(){
                this.get_goods();
            },
            get_goods(){
                let params = {
                    snType:this.searchData.snType,
                    snText:this.searchData.snText,
                    account_id:this.addtheGoods.account_id,
                    discount_name:this.addtheGoods.discount_name,
                    start_time:this.addtheGoods.start_time,
                    end_time:this.addtheGoods.end_time,
                };
                if (this.searchData.snType && this.searchData.snText) {
                    params.snType = this.searchData.snType;
                    if (this.searchData.snType === 'sku' || this.searchData.snType === 'spu') {
                        let curText = this.searchData.snText.replace(new RegExp(' ', 'gm'), '\n');
                        params.snText = curText.split('\n').filter(row => !!row).map(row => row.trim()).join(',');
                    } else {
                        params.snText = this.searchData.snText.trim();
                    }
                };
                this.$http(api_on_selling_list,params).then(res=>{
                    res.data.forEach(row => {
                        row.images = JSON.parse(row.images);
                        this.curCurrency = row.currency;
                    });
                    this.discountData = res.data;
                })
            },
            selected(selection){
                this.selectAdd = selection;
            },
            selectedAll(selection){
                this.selectAdd = selection;
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            addtheGoods:{}
        },
        components:{
            pageDialog:require('../../../../components/page-dialog.vue').default,
            searchCard:require('../../../../components/search-card.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
            orderInput: require('../../../../components/order-input.vue').default,
        }
    }
</script>
