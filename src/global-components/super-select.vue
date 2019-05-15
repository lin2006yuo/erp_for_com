<template>
    <el-select v-model="val" :filterable="filterable"
               :placeholder="placeholder"
               :filter-method="filterMethod"
               :loading="loading"
               :disabled="disabled"
               :multiple="isMultiple"
               :multiple-limit="multiple"
               ref="select"
               @input='setOption'
               :default-first-option="defaultFirstOption"
               :clearable="clearable"
               @change="$emit('change',$event)"
               :loading-text="loadinText">
        <div class='page-box bold-font' v-if="page > 1" @click="uppage"
             :label="`上一页（当前${page}/总页${pageCount}）`" value="uppage">
            {{`上一页(当前${page}/总页${pageCount})`}}
        </div>
        <el-option v-for="option in showOptions" :key="option.value"
                   :label="option.label"
                   :value="option.value"></el-option>
        <div class='page-box bold-font' v-if="page < pageCount" @click="downpage" :label="`下一页（当前${page}/总页${pageCount}）`" value="downpage">
            {{`下一页(当前${page}/总页${pageCount})`}}
        </div>
        <div class="page-box bold-font" v-if="page === maxPage">
            当前数据太多，请搜索...
        </div>
    </el-select>
</template>
<style lang="stylus">
    .page-box{
        height:30px;
        line-height:30px;
        cursor:pointer;
        min-width:140px;
        /*text-align:center;*/
        padding-left:10px;
        &:hover{
            background-color:#33B2FC;
            color:#fff;
        }
        &:active{
            background-color:#2EA0E3;
            color:#fff;
        }
    }
</style>
<script>
    import fuzzy from '@/lib/fuzzy';
    import requests from '@/super-select.js';
    import PinyinEngine from '@/lib/pinyin/cn';
    window.$PY = PinyinEngine;
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
                query:'',
                curRow: {},
                filterData: false,
                cachedOptions:[],
                optionsCount:0,
                filteredOptionsCount:0,
                fixOptions:[],
                loadSucc:false,
            }
        },
        mounted() {
            this.$store.dispatch('storage/tryLoadOptions', {
                key:this.storageKey,
                callback:this.loadOptions,
                execute:this.makeFixOptions,
            });
        },
        methods: {
            makeFixOptions(){
                const opt = this.getOptions.find(opt => opt.value === this.val);
                if(!opt){
                    let fix = this.getAllOptions.find(row => row.value === this.val);
                    if(fix){
                        this.fixOptions.push(fix);
                    }else{
                    }
                }
            },
            setStorageCount(count) {
                this.$store.dispatch('storage/setCount', {key: this.storageKey, count});
            },
            addStorageData(data) {
                page = page || this.page;
                this.$store.dispatch('storage/setData', {key: this.storageKey, data});
            },
            getRemote(page, pageSize){
                let http;
                if(this.remoteRequestHttp && this.remoteRequestHttp instanceof Function){
                    http = this.remoteRequestHttp(page, pageSize, "");
                }else{
                    const request = requests[this.storageKey];
                    if(request){
                        http = request(page, pageSize, "");
                    }
                }
                return http;
            },
            loadOptions(execute){
                if(this.options && this.options instanceof Array){
                    this.resetStorage(this.storageKey, this.options);
                    execute();
                }else{
                    this.loadRemoteOptions(1, 500, execute);
                }
            },
            async loadRemoteOptions(page = 1, pageSize = 500, execute) {
                try{
                    let http = this.getRemote(page, pageSize);
                    if (http) {
                        let {data, count} = await this.requestRemote(http);
                        let result = data;
                        while(result.length < count){
                            page +=1;
                            http = this.getRemote(page, pageSize);
                            let {data} = await this.requestRemote(http);
                            result = [...result, ...data];
                        }
                        this.resetStorage(this.storageKey, result);
                        execute();
                    }
                }catch (e) {
                    console.error(e)
                }
            },
            requestRemote(http){
                this.loading = true;
                return new Promise((succ, fail) =>{
                    this.$http(http).then(res => {
                        let result = this.adjustStructure(res);
                        succ(result);
                    }).catch(code => {
                        fail(code)
                    }).finally(_ => {
                        this.loading = false;
                    })
                });
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
                clearTimeout(this.uppageTimer);
                this.lockQuery();
                this.uppageTimer = setTimeout(()=>this.page = Math.max(1, this.page - 1), 150);
            },
            downpage() {
                this.lockQuery();
                clearTimeout(this.downpageTimer);
                this.downpageTimer = setTimeout(()=>this.page = Math.min(this.pageCount, this.page + 1), 150);
            },
            setOption(val){
                console.log('ceshi ',val);
                this.val = val;
                this.$emit('select-option',val);
            },
            lockQuery(){
                this.lock = true;
                setTimeout(()=>this.lock = false, 200);
            },
            queryList(list, query) {
                let {result} = fuzzy.filter(query, list, {match:(opt) =>opt.label});
                return result.map(row => list[row.index]);
            },
            filterMethod(value) {
                if(this.lock){
                    this.$refs.select.query = this.query;
                    this.$refs.select.selectedLabel = this.query;
                    return;
                }
                let opt = this.showOptions.find(opt => opt.value === this.val);
                if(opt && opt.label === value && opt.value === this.val){
                    return;
                }
                clearTimeout(this.timer);
                this.timer = setTimeout(async () => {
                        this.query = value;
                        this.page = 1;
                }, 300);
            },
            focus() {
                this.show = true;
            },
            resetStorage(key, options) {
                this.$store.dispatch('storage/storageInit', {
                    key: this.storageKey,
                    data: options,
                    count:options.length,
                    forceCovered: true
                });
            },
        },
        computed: {
            isMultiple(){
                return !!this.multiple;
            },
            pageCount() {
                return Math.ceil(this.count / this.pageSize);
            },
            getOptions() {
                if (this.filterData) {
                    let begin = (this.page - 1) * this.pageSize;
                    return this.filterData.slice(begin, begin + this.pageSize);
                }
                return this.$store.getters['storage/getPageData'](this.storageKey, this.page, this.pageSize) || [];
            },
            showOptions(){
                return distinctArray(this.fixOptions, this.getOptions,(row, rows) =>{
                    return !rows.find(r => {
                        return r.label === row.label && r.value === row.value;
                    })
                });
            },
            getAllOptions() {
                return this.$store.getters['storage/getAllOptions'](this.storageKey);
            },
            count() {
                return this.$store.getters['storage/getCount'](this.storageKey);
            }
        },
        watch: {
            query(value){
                if(value){
                    this.filterData = this.queryList(this.getAllOptions, String(value));
                }else{
                    this.filterData = false;
                }
            },
            val(val, old) {
                this.$emit('input', val);
                if(val){
                    this.makeFixOptions();
                }
            },
            value(val) {
                this.val = val;
            },
            disable(val) {
            },
            options: {
                deep: true,
                handler(opts) {
                    if (opts && opts instanceof Array) {
                        this.resetStorage(this.storageKey, opts);
                        this.makeFixOptions();
                    }
                }
            }
        },
        props: {
            value: {},

            /*url以及其他参数
            * */
            remoteRequestHttp: {},

            /*vuex中储存数据的key
            * */
            storageKey: {
                type: String,
                required: true
            },
            clearable:{
                default(){
                    return true
                }
            },
            defaultFirstOption:{
                default(){
                    return false
                }
            },
            filterable:{
                default(){
                    return true
                }
            },
            /*整理数据的函数
            * */
            adjustStructure: {
                type: Function,
                default(res) {
                    return res
                }
            },
            /*提示
            * */
            placeholder: {
                default() {
                    return "输入搜索更多";
                }
            },
            loadinText:{
                default(){
                    return '正在加载数据...';
                }
            },
            disabled:{
                default() {
                    return false;
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
            forceCover: {
                default() {
                    return false;
                }
            },
            options:{
                type:Array
            },
            multiple:{
                type:Number,
            }
        },
        components: {}
    }
</script>
