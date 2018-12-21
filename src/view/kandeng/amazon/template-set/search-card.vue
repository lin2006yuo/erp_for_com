<template>
    <div>
        <search-card @search="search" :params="searchData" :clears="clears">
            <label>站点：</label>
            <el-select class="inline s-width-mini"  v-model="searchData.site" v-sf.site>
                <el-option v-for="(item, index) in site" :value="item.value" :label="item.label" :key="index"></el-option>
            </el-select>
            <label class="ml-sm">产品模板：</label>
            <el-select class="inline s-width-default" v-model="searchData.first_category_id" v-sf.first_category_id @change="get_second_category">
                <el-option v-for="item in category" :label="item.category_name" :value="item.id"
                           :key="item.key"></el-option>
            </el-select>
            <el-select class="inline s-width-default" v-model="searchData.second_category_id" v-sf.second_category_id>
                <el-option v-for="item in second_category" :label="item.category_name" :value="item.id"
                           :key="item.key"></el-option>
            </el-select>
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

<style lang="stylus">

</style>
<script>
    import {api_account_site} from '../../../../api/amazon-publish-list';
    export default{
        data(){
            return {
                searchData:{
                    page:1,
                    pageSize:50,
                    site:'',
                    first_category_id: '',
                    second_category_id: ''
                },
                clears:{
                    page:1,
                    pageSize:50,
                    site:'',
                    create:''
                },
                second_category:[]
            }
        },
        created(){

        },
        filters: {},
        mounted(){

        },
        updated(){

        },
        destroy(){

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
            },
            get_second_category(){
                this.searchData.second_category_id = '';
                if (!!this.searchData.first_category_id) {
                    let find = this.category && this.category.find(item => {
                            return item.id === this.searchData.first_category_id
                        });
                    if (!!find) {
                         this.second_category = find.children;
                    }
                }
            }
        },
        computed: {

        },
        watch: {},
        props: {
            total:{
                default(){
                    return 0
                }
            },
            site:{
                required: true,
                type: Array
            },
            category: {
                required: true,
                type: Array
            }
        },
        components: {
            searchCard: require('../../../../components/search-card.vue').default
        }
    }
</script>

