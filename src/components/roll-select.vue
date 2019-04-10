<template>
    <div class="scroll-select">
        <div class="input">
            <input ref="input"
                   @focus="focus"
                   @blur="blur"
                   :style="{textAlign}"
                   :placeholder="placeholder"
                   :title="inputValue"
                   v-model="inputValue"
                   @input="input"
                   :disabled="disable">
            <i v-show="loading" class="el-icon-loading" style="right:30px;"></i>
            <i v-show="!show" class="active el-icon-arrow-down" style="right:0;" @click="()=>{$refs.input.focus()}"></i>
            <i v-show="show" class="active el-icon-arrow-right" style="right:0;" @click="show=false;"></i>
        </div>
        <transition name="md-fade-bottom" tag="li">
            <div class="body" v-show="show" :style="styleUlOn"
                 @scroll="scroll" @DOMMouseScroll="DOMMouseScroll" @mousewheel="mousewheel" ref="body">
                <transition-group name="md-fade-bottom" tag="ul" :style="ulStyle">
                    <li style="font-weight:bold;"
                        class="li-data"
                        key="first"
                        v-if="count > pageSize">
                        （当前{{page}}页/总页{{pageCount}}/总数{{count}}）
                    </li>
                    <li class="li-data" v-if="getOptions&&getOptions.length>0"
                        :style="{textAlign}"
                        v-for="(option,index) in getOptions"
                        :key="`key-${index}-${option.value}`"
                        @click="change_option(option,index)">
                        {{option.label}}
                    </li>
                    <li class="li-data" key="Second"
                        style="font-weight:bold;" v-if="count > pageSize">
                        <span v-if="page!==pageCount">（当前{{page}}页/总页{{pageCount}}/总数{{count}}）</span>
                        <span class="red" v-else>已是最后一页</span>
                    </li>
                    <li class="li-data" v-if="loading" key="loading">
                        数据加载中 <i class="el-icon-loading ml-sm"></i>
                    </li>
                    <li class="li-data" key="count<=0 && (!loading)"
                        v-if="count<=0 && (!loading)"
                        :style="{textAlign}">暂无数据
                    </li>
                </transition-group>
            </div>
        </transition>
    </div>
</template>
<style lang="stylus">
    .md-fade-bottom {

    }

    .scroll-select {
        .other-class {
            background: #ffffff;
            font-size: 1.2rem;
            height: 26px;
            padding: 2px 3px;
        }

        * {
            box-sizing: border-box;
        }
        height: 26px;
        position: relative;

        .input {
            height: 100%;
            width: 100%;
            position: relative;
            border-color: #8492a6;
            border-radius: 4px;

            ::-webkit-input-placeholder { /* WebKit browsers */
                color: #99A9BF;
            }

            :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                color: #99A9BF;
            }

            ::-moz-placeholder { /* Mozilla Firefox 19+ */
                color: #99A9BF;
            }

            :-ms-input-placeholder { /* Internet Explorer 10+ */
                color: #99A9BF;
            }

            input {
                box-sizing: border-box;
                outline: none;
                color: #1F2D3D;
                margin: 0;
                width: 100%;
                height: 100%;
                display: block;
                float: left;
                padding: 4px 26px 4px 8px;
                border: 1px solid #C0CCDA;
                border-radius: 4px;
                font-size: 1.2rem;
                line-height: 26px;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            i {
                display: block;
                position: absolute;
                top: 0;
                width: 26px;
                height: 26px;
                text-align: center;
                line-height: 26px;
            }
        }

        .body {
            position: absolute;
            width: 100%;
            top: 30px;
            left: -1px;
            background: #fff;
            z-index: 999999;
            border: 1px solid #ddd;
            border-radius: 2px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            box-sizing: border-box;
            margin: 5px 0;
            ul {
                margin: 0;
                li {
                    height: 26px;
                    line-height: 26px;
                    font-size: 1.2rem;
                    overflow: hidden;
                    padding: 0 10px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    background-color: #ffffff;
                    cursor: pointer;

                    &.li-data:active {
                        background-color: #008BCE;
                    }

                    &.li-data:hover {
                        background: #e5e9f2;
                    }
                }

                .warning-not-data {
                    color: #f00;
                }
            }
        }

    }
</style>
<script>
    import fuzzy from '@/lib/fuzzy';
    import '@/lib/string'
    export default {
        data() {
            return {
                show: false,
                loading: false,
                val: this.value,
                inputValue: '',
                isChoose: false,
                isSelect:true,//el-select true
                page: 1,
                curRow: {},
                filterData: false,
                cachedOptions:[],
                optionsCount:0,
                filteredOptionsCount:0
            }
        },
        created() {
            this.makeSureStorageInit();
        },
        mounted() {
            console.log(this);
        },
        methods: {
            makeSureStorageInit() {
                if (!this.$store.getters['storage/isInit'](this.storageKey)) {
                    this.$store.dispatch('storage/storageInit', {
                        key: this.storageKey,
                        page: this.page,
                        pageSize: this.pageSize,
                        data: data2page(this.options, this.pageSize),
                        count: this.options.length,
                        forceCovered: this.forceCover
                    })
                    this.loadPageData();
                }

            },
            setStorageCount(count) {
                console.log(`count ${this.storageKey}  ${count}`);
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
                            let data = this.adjustStructure(res);
                            if (this.show) {
                                let ref = this.$refs.body;
                                ref.scrollTop = `0px`;
                            }
                            return Promise.resolve({data, count: res.count});
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
                clearTimeout(this.upTimer);
                this.upTimer = setTimeout(() => {
                    this.page = Math.max(1, this.page - 1);
                }, 300);
            },
            downpage() {
                clearTimeout(this.downTimer);
                if (this.loading) {
                    return;
                }
                this.downTimer = setTimeout(() => {
                    this.page = Math.min(this.pageCount, this.page + 1);
                }, 300);
            },
            change_option(opt, index) {
                this.isChoose = true;
                this.val = opt.value;
                this.inputValue = opt.label;
                this.show = false;
                this.$emit("change", opt, index);
            },
            queryList(list, query) {
                let filters = list.map(row => row.label);
                let {result} = fuzzy.filter(query, filters);
                return result.map(row => list[row.index]);
            },
            input({target: {value}}) {
                clearTimeout(this.timer);
                this.timer = setTimeout(async () => {
                    this.query = value;
                    this.page = 1;
                    let options = this.queryList(this.getAllOptions, value);
                    if (this.count > this.getAllOptions) {
                        let {count, data} = await this.refresh_remote();
                        this.queryCount = count;
                        this.filterData = distinctArray(options, data);
                    } else {
                        this.queryCount = options.length;
                        this.filterData = options;
                    }
                }, 300);
            },
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
            val(val) {
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
                if (find) this.inputValue = find.label || '';
            },
            inputValue(new_, old) {
                this.page = 1;
                if (new_ === "") this.val = '';
            },
            disable(val) {
                if (!val) this.refresh_remote(this.page);
            },
            options: {
                deep: true,
                handler(opts) {
                    console.log(`optionsss `)
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
