<template>
    <ui-autocomplete
            size="small"
            class="scroll-select-autocomplete"
            popper-class="scroll-select"
            v-model="keyword"
            v-checkout-side="checkout"
            :fetch-suggestions="querySearch"
            custom-item="scroll-select-item"
            :placeholder="placeholder"
            @select="select"
            :disabled="disabled"
            icon="circle-close"
            :on-icon-click="onIconClick"
            ref="autoComplete"
            :mui-page="muiPage"
            :before-select="beforeSelect"
    >
    </ui-autocomplete>
</template>
<style lang="stylus">
    .scroll-select {
        .item {
            &.type {
                color: #3399ff;
            }
        }
    }
    .scroll-select-autocomplete{
        .el-input__icon {
            position: absolute;
            width: 35px;
            height: 100%;
            right: 0;
            top: 0;
            text-align: center;
            color: #C0CCDA;
            opacity: 0.4;
            transition: all .3s;
        }
        .el-input__icon:hover{
            opacity 1;
        }
    }
</style>
<script>
    import {http} from '../lib/http-plus';
    import {mapGetters} from 'vuex';
    import Vue from 'vue';

    Vue.component('scroll-select-item', {
        functional: true,
        render: function (h, ctx) {
            let item = ctx.props.item;
            let classNames = "item";
            if(item.t){
                classNames = "item type";
            }
            return h('li', ctx.data, [
                h('span', {attrs: {class: classNames}}, [item.value]),
            ]);
        },
        props: {
            item: {type: Object, required: true}
        }

    });
    export default {
        data() {
            return {
                keyword: this.value.label,
                count: 0,
                page: 1,
                list: [],
                muiPage: false,
            }
        },
        methods: {
            onIconClick(){
                this.keyword = '';
                this.$emit('input', {label: '', value: ''});
            },
            checkout() {
                this.muiPage = false;
            },
            querySearch(keyword, callback, page = 1) {
                if(this.queryClearabled&&keyword!==this.value.label){
                    this.$emit('input', {label: '', value: ''});
                }
                this.keyword = keyword;
                this.$http(http(this.remote, this.fixParams({
                    page: page,
                    pageSize: this.size,
                    keyword: keyword
                }))).then(res => {
                    res = this.fixResult_(res);
                    this.count = parseInt(res.count);
                    this.list = res.options;
                    this.page = parseInt(res.page);
                    callback(this.list);
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            beforeSelect(item) {
                this.muiPage = true;
                switch (item.val) {
                    case 'PREVIOUS_PAGE':
                        this.$http(http(this.remote, this.fixParams({
                            page: this.page - 1,
                            pageSize: this.size,
                            keyword: this.keyword
                        }))).then(res => {
                            res = this.fixResult_(res);
                            this.count = parseInt(res.count);
                            this.list = res.options;
                            this.page = parseInt(res.page);
                            this.$refs.autoComplete.suggestions = this.list;
                        }).catch(code => {
                            this.$message({
                                type: 'error',
                                message: code.message || code
                            });
                        });
                        return false;
                    case 'NEXT_PAGE':
                        this.$http(http(this.remote, this.fixParams({
                            page: this.page + 1,
                            pageSize: this.size,
                            keyword: this.keyword
                        }))).then(res => {
                            res = this.fixResult_(res);
                            this.count = parseInt(res.count);
                            this.list = res.options;
                            this.page = parseInt(res.page);
                            this.$refs.autoComplete.suggestions = this.list;
                        }).catch(code => {
                            this.$message({
                                type: 'error',
                                message: code.message || code
                            });
                        });
                        return false;
                    default:
                        this.muiPage = false;
                        return true;
                }
            },
            select(item) {
                this.$emit('input', {label: item.value, value: item.val});
                this.$emit('select-user', item.opt, this.index);
            },
            fixResult_(res) {
                if(this.fixResult instanceof Function){
                    res = this.fixResult(res);
                }
                if(this.hasAll){
                    res.options.unshift({label:'全部', value:''});
                }
                res.options = res.options.map(opt => {
                    return {value: opt.label, val: opt.value, opt:opt}
                });
                const tatol = Math.ceil(res.count / this.size);
                if (res.page > 1) {
                    res.options = [{t: 1, val: 'PREVIOUS_PAGE', value: '上一页'}, ...res.options]
                }
                if (tatol > res.page) {
                    res.options.push({t: 2, val: 'NEXT_PAGE', value: '下一页'})
                }
                return res;
            }
        },
        computed: {},
        watch: {
            value(val){
                this.keyword = val.label;
            }
        },
        props: {
            placeholder: {
                default() {
                    return "请输入/选择...";
                }
            },
            value: {
                type: Object,
                default() {
                    return {
                        label: '',
                        value: ''
                    }
                }
            },
            maxPage: {
                default() {
                    return 300;
                }
            },
            size: {
                default() {
                    return 10;
                }
            },
            textAlign: {
                default() {
                    return 'center';
                }
            },
            remote: {
                required: true,
                type: String
            },
            fixParams: {
                type: Function,
                default(params) {
                    return params;
                }
            },
            fixResult: {
                type: [Function, Object],
                default(res) {
                    return {
                        options: res.data.map(row => {
                            return {
                                label: row.company_name,
                                value: row.id
                            }
                        }),
                        page: res.page,
                        count: res.count,
                    }
                }
            },
            hasAll:{
                type: Boolean,
                default() {
                    return false;
                }
            },
            index:{
                default() {
                    return 0;
                }
            },
            disabled:{
                type:Boolean,
                default(){
                    return false
                }
            },
            queryClearabled:{
                type:Boolean,
                default(){
                    return false
                }
            }
        },
        components: {
            uiAutocomplete: require('./ui-autocomplete.vue').default
        }
    }
</script>
