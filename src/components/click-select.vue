<template>
    <el-select v-model="valueData" class="click-select"
               @change="change" :disabled="disabled"
               :placeholder="placeholder"
               remote :remote-method="remote_method"
               :filterable="filterable"
               :clearable="clearable">
        <div key="first"  class="t-center non-user-select page-div" v-if="count > pageSize" >
            <span class="page-box first" @click="uppage" v-show="page!==1">
                   <i class="el-icon-caret-left page-icon"></i>
            </span>
            <span class="bold-font ">第{{page}}页/共{{pageCount}}页  {{count}}条</span>
            <span class="page-box second" @click="downpage" v-show="page!==pageCount">
                   <i class="el-icon-caret-right page-icon"></i>
            </span>
        </div>
        <el-option
            v-for="(item,index) in comOptions"
            :key="`${index}-${item.value}`"
            :label="item.label"
            :value="item.value">
        </el-option>
    </el-select>
</template>
<style lang="stylus">
    .page-div{
        height:30px;
        line-height: 30px;
        min-width:158px;
        position: relative;
        .first{
            position: absolute;
            top:2px;
            left:0;
        }
        .second{
            position: absolute;
            top:2px;
            right:0;
        }
        .page-box{
            width:20px;
            height:25px;
            line-height:25px;
            font-size:1.4rem;
            display: inline-block;
            text-align:center;
            .page-icon{
                color:#E0E6ED;
                transition:all 0.2s;
                &:hover{
                    color:#C0CCDA;
                }
            }
        }
    }
</style>
<script>
    import fuzzy from '@/lib/fuzzy';
    export default {
        data() {
            return {
                show: false,
                loading: false,
                isChoose: false,
                isSelect:true,//el-select true
                page: 1,
                // filterData: false,
                cachedOptions:[],
                optionsCount:0,
                filteredOptionsCount:0,
                filterData:[],
                valueData:this.value,
                query:'',
                allOptions:[],
            }
        },
        mounted() {
            this.init();
        },
        methods: {
           async init(){
               this.$store.dispatch('storage2/init',{key:this.storageKey,data:this.options});
               this.allOptions = this.$store.getters['storage2/getAllOptions'](this.storageKey);
            },
            remote_method(query){
                this.query = query;
                this.page = 1;
            },
            do_data(){
                if(this.allOptions){
                    if(this.query){
                        this.filterData = this.queryList(this.allOptions, this.query);
                    }else{
                        this.filterData = this.allOptions;
                    }
                    return this.split_data();
                }else{
                    return []
                }
            },
            split_data(){
                let begin = (this.page - 1) * this.pageSize;
                return this.filterData.slice(begin, begin + this.pageSize);
            },
            queryList(list, query) {
                if(typeof query==='number'){
                    return list.filter(row => row.value===query);
                }else{
                    let filters = list.map(row => row.label);
                    let {result} = fuzzy.filter(query, filters);
                    return result.map(row => list[row.index]);
                }
            },
            uppage(){
                this.page = Math.max(1, this.page - 1);
                this.split_data();

            },
            downpage() {
                this.page = Math.min(this.pageCount, this.page + 1);
                this.split_data();
            },
            change(val){
                this.$emit('change',val);
            },
        },
        computed: {
            comOptions(){
                return this.do_data();
            },
            pageCount() {
                return Math.ceil(this.count / this.pageSize);
            },
            count() {
                return this.filterData.length
            }
        },
        watch: {
            valueData(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.valueData = val;
            },
            options(val){
                this.init();
            }
        },
        props: {
            value: {},
            /*url以及其他参数
            * */
            remoteRequestHttp: {},

            /*api超时请求时间限制
            * */
            timeOut: {
                type: Object,
                default() {
                    return {
                        contentType: 'application/x-www-form-urlencoded',
                        timeout: INFINITE
                    }
                }
            },

            /*vuex中储存数据的key
            * */
            storageKey: {
                type: String,
                required: true
            },

            /*整理数据的函数
            * */
            adjustStructure: {
                type: Function,
                default(res) {
                    return res
                }
            },
            /*
            * */
            adjustParams: {
                type: Function,
                default(res) {
                    return res;
                }
            },
            /*提示
            * */
            placeholder: {
                default() {
                    return "输入搜索更多";
                }
            },
            disabled: {
                default() {
                    return false;
                }
            },
            pageSize: {
                type: Number,
                default() {
                    return 20;
                }
            },
            styleUl: {
                type: Object,
                default() {
                    return {};
                }
            },
            ulStyle:{
                default(){
                    return {'height':'300px'};
                }
            },
            forceCover: {
                default() {
                    return false;
                }
            },
            options:{

            },
            filterable:{
                default(){
                    return true
                }
            },
            clearable:{
                default(){
                    return true
                }
            },
        },
        components: {}
    }
</script>
