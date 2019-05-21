<template>
    <el-select v-model="valueData" class="roll-select"
               remote :remote-method="remote_method"
               filterable clearable>
        <div key="first"  class="t-center" v-if="count > pageSize" style="height:30px">
            <span class="bold-font">第{{page}}页/共{{pageCount}}页  {{count}}条</span>
            <div class="inline">
               <span class="page-box ml-xs" @click="uppage">
                   <i class="el-icon-caret-left page-icon"></i>
               </span>
               <span class="page-box" @click="downpage">
                   <i class="el-icon-caret-right page-icon"></i>
               </span>
            </div>
        </div>
        <el-option
            v-for="(item,index) in getOptions"
            :key="`${index}-${item.value}`"
            :label="item.label"
            :value="item.value">
        </el-option>
    </el-select>
</template>
<style lang="stylus">
    .roll-select{
        .page-box{
            width:20px;
            height:25px;
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
                curRow: {},
                filterData: false,
                cachedOptions:[],
                optionsCount:0,
                filteredOptionsCount:0,
                valueData:this.value
            }
        },
        created() {
            this.makeSureStorageInit();
        },
        mounted() {
            console.log(this);
        },
        methods: {
            remote_method(query){
                clearTimeout(this.timer);
                this.timer = setTimeout(async () => {
                    this.query = query;
                    this.page = 1;
                    let options = this.queryList(this.getAllOptions, query);
                    if (this.count > this.getAllOptions) {
                        let {count, data} = await this.refresh_remote();
                        this.queryCount = count;
                        this.filterData = distinctArray(options, data,(row, rows) =>{
                            return !rows.find(r => {
                                return r.label === row.label && r.value === row.value;
                            })
                        });
                    } else {
                        this.queryCount = options.length;
                        this.filterData = options;
                    }
                }, 300);
            },
            makeSureStorageInit() {
                if (!this.$store.getters['storage/isInit'](this.storageKey)) {
                    this.$store.dispatch('storage/storageInit', {
                        key: this.storageKey,
                        page: this.page,
                        pageSize: this.pageSize,
                        data: data2page(this.options, this.pageSize),
                        count: this.options.length,
                        forceCovered: this.forceCover
                    });
                    this.loadPageData();
                }
            },
            setStorageCount(count) {
                this.$store.dispatch('storage/setCount', {key: this.storageKey, count});
            },
            addStorageData(data) {
                this.$store.dispatch('storage/addPageData', {key: this.storageKey, page: this.page, data});
            },
            loadPageData() {
                if (this.disable) return;
                this.refresh_remote().then(({data, count}) => {
                    this.setStorageCount(count);
                    this.addStorageData(data);
                })
            },
            refresh_remote() {
                if(this.remoteRequestHttp && this.remoteRequestHttp instanceof Function){
                    let http = this.remoteRequestHttp(this.page, this.pageSize, this.query);
                    if (http) {
                        this.loading = true;
                        return this.$http(http).then(res => {
                            let obj = this.adjustStructure(res);
                            if (this.show) {
                                let ref = this.$refs.body;
                                ref.scrollTop = `0px`;
                            }
                            return Promise.resolve({data:obj.data, count: obj.count});
                        }).catch(code => {
                            console.error(code);
                            return Promise.reject();
                        }).finally(_ => {
                            this.loading = false;
                        });
                    } else {
                        return Promise.reject();
                    }
                }else{
                    return Promise.reject();
                }
            },
            scroll(event) {
                clearTimeout(this.scrollTimer);
                this.scrollTimer = setTimeout(() => {
                    let target = event.target;
                    if (target.scrollTop <= 0) {
                        this.upWait = true;
                        this.downWait = false;
                        return;
                    }
                    if ((target.scrollHeight - target.scrollTop) === target.clientHeight) {
                        this.upWait = false;
                        this.downWait = true;
                        return;
                    }
                    this.upWait = false;
                    this.downWait = false;
                }, 300);
            },
            mousewheel(event) {
                clearTimeout(this.wheelTimer);
                this.wheelTimer = setTimeout(() => {
                    if(this.upWait && event.deltaY < 0){
                        this.uppage();
                        return;
                    }
                    if(this.downWait && event.deltaY > 0){
                        this.downpage();
                        return;
                    }
                }, 300);
            },
            DOMMouseScroll(event) {
                clearTimeout(this.wheelTimer);
                this.wheelTimer = setTimeout(() => {
                    if (this.upWait && event.detail < 0) {
                        this.uppage();
                        return;
                    }
                    if (this.downWait && event.detail > 0) {
                        this.downpage();
                        return;
                    }
                }, 200);
            },
            uppage() {
                console.log('21323234');
                clearTimeout(this.upTimer);
                this.upTimer = setTimeout(() => {
                    this.page = Math.max(1, this.page - 1);
                }, 300);
            },
            downpage() {
                console.log('111111');
                clearTimeout(this.downTimer);
                if (this.loading) {
                    return;
                }
                this.downTimer = setTimeout(() => {
                    this.page = Math.min(this.pageCount, this.page + 1);
                }, 300);
            },
            // change_option(opt, index) {
            //     this.isChoose = true;
            //     this.val = opt.value;
            //     this.$emit('input',opt.value);
            //     this.inputValue = opt.label;
            //     this.show = false;
            //     this.$emit("change", opt, index);
            // },
            queryList(list, query) {
                if(typeof query==='number'){
                    return list.filter(row => row.value===query);
                }else{
                    let filters = list.map(row => row.label);
                    let {result} = fuzzy.filter(query, filters);
                    return result.map(row => list[row.index]);
                }
            },
            // input({target: {value}}) {
            //     clearTimeout(this.timer);
            //     this.timer = setTimeout(async () => {
            //         this.query = value;
            //         this.page = 1;
            //         let options = this.queryList(this.getAllOptions, value);
            //         if (this.count > this.getAllOptions) {
            //             let {count, data} = await this.refresh_remote();
            //             this.queryCount = count;
            //             this.filterData = distinctArray(options, data);
            //         } else {
            //             this.queryCount = options.length;
            //             this.filterData = options;
            //         }
            //     }, 300);
            // },
            focus() {
                this.show = true;
            },
            blur() {
                if (this.show) {
                    clearTimeout(this.showTimer);
                    this.showTimer = setTimeout(() => {
                        this.show = false;
                    }, 200);
                }
            },
            resetStorage(key, options) {
                this.$store.dispatch('storage/storageInit', {
                    key: this.storageKey,
                    data: data2page(options, this.pageSize),
                    count:options.length,
                    forceCovered: true
                });
            },
        },
        computed: {
            pageCount() {
                return Math.ceil(this.count / this.pageSize);
            },
            getOptions() {
                if (this.filterData) {
                    let begin = (this.page - 1) * this.pageSize;
                    return this.filterData.slice(begin, begin + this.pageSize);
                }
                return this.$store.getters['storage/getPageData'](this.storageKey, this.page);
            },
            getAllOptions() {
                return this.$store.getters['storage/getAllOptions'](this.storageKey);
            },
            styleUlOn() {
                return Object.assign(this.styleUl, {maxHeight: `${26 * (this.defaultSize - 4)}px`}, {
                    overflowY: 'scroll',
                })
            },
            count() {
                return this.$store.getters['storage/getCount'](this.storageKey);
            }
        },
        watch: {
            valueData(val) {
                this.$emit('input', val);
            },
            page() {
                let data = this.$store.getters['storage/getPageData'](this.storageKey, this.page);
                if (!data || data.length <= 0) {
                    this.loadPageData();
                }
            },
            value(val) {
                this.val = val;
                let find = this.getAllOptions.find(row => row.value === val);
                if (find) this.inputValue = find.label || val;
            },
            disable(val) {
                if (!val) this.refresh_remote(this.page);
            },
            options: {
                deep: true,
                handler(opts) {
                    if (opts && opts instanceof Array) {
                        this.resetStorage(this.storageKey, opts);
                    }
                }
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
            disable: {
                default() {
                    return false;
                }
            },
            maxPage: {
                default() {
                    return 20;
                }
            },
            pageSize: {
                type: Number,
                default() {
                    return 20;
                }
            },
            defaultSize: {
                default() {
                    return 500;
                }
            },
            textAlign: {
                default() {
                    return 'left';
                }
            },
            styleUl: {
                type: Object,
                default() {
                    return {};
                }
            },
            remote: {
                // required:true,
                // type:String
            },
            fixParams: {
                type: Function,
                default(params) {
                    return params;
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

            }
        },
        components: {}
    }
</script>
