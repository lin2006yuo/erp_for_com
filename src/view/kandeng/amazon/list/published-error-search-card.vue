<template>
    <div>
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <el-select class="inline width-100" v-model="searchData.snType">
                <el-option v-for="(item, index) in snType" :value="item.value" :label="item.label"
                           :key="index"></el-option>
            </el-select>
            <el-input class="inline width-140" v-model="searchData.snText"></el-input>
            <label class="ml-sm">站点：</label>
            <el-select class="inline width-sm" v-model="searchData.site">
                <el-option v-for="(item, index) in test" :value="item.value" :label="item.label"
                           :key="index"></el-option>
            </el-select>
            <label class="ml-sm">平台账号：</label>
            <el-select class="inline width-sm" v-model="searchData.account">
                <el-option v-for="(item, index) in test" :value="item.value" :label="item.label"
                           :key="index"></el-option>
            </el-select>
            <label class="ml-sm">销售类型：</label>
            <el-select class="inline width-100" v-model="searchData.salesType">
                <el-option v-for="(item, index) in test" :value="item.value" :label="item.label"
                           :key="index"></el-option>
            </el-select>
            <label class="ml-sm">本地状态：</label>
            <el-select class="inline width-100" v-model="searchData.nativeState">
                <el-option v-for="(item, index) in test" :value="item.value" :label="item.label"
                           :key="index"></el-option>
            </el-select>
            <label class="ml-sm">创建时间：</label>
            <el-date-picker class="inline date" v-model="searchData.start" type="date"
                            :picker-options="pickerstart" placeholder="开始时间"></el-date-picker>
            --
            <el-date-picker class="inline date" v-model="searchData.end" type="date"
                            :picker-options="pickerend" placeholder="结束时间"></el-date-picker>
        </search-card>

        <el-pagination
            class="page-fixed"
            @size-change="handle_size_change"
            @current-change="handle_current_change"
            :current-page=searchData.page
            :page-sizes="[20, 50,100, 200, 500]"
            :page-size=searchData.pageSize
            layout="total, sizes, prev, pager, next, jumper"
            :total=total>
        </el-pagination>
    </div>
</template>

<style lang="stylus" scoped>
    .width-100{
        width:110px;
    }
</style>
<script>

    export default{
        data(){
            return {
                searchData: {
                    page:1,
                    pageSize:50,
                    snType: '',
                    snText: '',
                    site: '',
                    account: '',
                    nativeState: '',
                    start: '',
                    end: ''
                },
                snType: [
                    {
                        label: '平台SPU',
                        value: 'platform_spu'
                    },
                    {
                        label: '平台SKU',
                        value: 'platform_sku'
                    },
                    {
                        label: '本地SPU',
                        value: 'native_spu'
                    },
                    {
                        label: '本地SKU',
                        value: 'native_sku'
                    },
                    {
                        label: '刊登标题',
                        value: 'title'
                    },
                    {
                        label: 'UPC',
                        value: 'upc'
                    }
                ],
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.end){
                            return  time.getTime() > this.searchData.end;
                        }else {
                            return false;
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.start){
                            return  time.getTime() < this.searchData.start;
                        }else {
                            return false;
                        }
                    }
                },
                clears: {
                    page:1,
                    pageSize:50,
                    snType: '',
                    snText: '',
                    site: '',
                    account: '',
                    nativeState: '',
                    start: '',
                    end: ''
                },
                test: [
                    {
                        label: 1,
                        value: 1
                    }
                ],
            }
        },
        mounted(){

        },
        methods: {
            init(){

            },
            search(){
                this.$emit('search', this.searchData);
            },
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.search();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.search();
            }
        },
        computed: {},
        watch: {},
        props: {
            total:{
                required: true,
                type: Number,
                default(){
                    return 0
                }
            }
        },
        components: {
            searchCard: require('../../../../components/search-card.vue').default
        }
    }
</script>

