<template>
    <el-select v-model="account"
               remote
               filterable
               clearable
               class="inline"
               default-first-option
               :disabled="disabled"
               :placeholder="placeholder"
               @change="change_data"
               :remote-method="remote">
        <el-option v-for="(option,index) in options"
                   :key="index"
                   :label="option.label"
                   :value="option.value">
        </el-option>
    </el-select>
</template>
<style lang="stylus">
</style>
<script>
    import {http} from "../lib/http-plus"
    import {mapActions, mapGetters} from 'vuex';
    export default {
        data() {
            return {
                account: this.value,
                query: ''
            }
        },
        created() {
            this.init();
        },
        methods: {
            ...mapActions({load: 'api/set_publish_account'}),
            change_data(val){
                this.$emit('change',val);
            },
            init(value) {
                if(this.callBack()){
                    return
                }
                if (this.type) {
                    if (this.getAccounts.length <= 0 || this.refresh) {
                        let request = null;
                        let timeOut = {contentType:'application/x-www-form-urlencoded', timeout:INFINITE};
                        if (!this.fixUrl) {
                            request = http(this.url, this.param,timeOut);
                        } else {
                            request = http(Url2(this.url, this.param),timeOut);
                        }
                        this.$http(request).then(res => {
                                this.load({data: this.fixResult(res), type: this.type});
                            (typeof value !=="undefined")&&(this.account = value);
                        });
                    } else {
                    	if(value===''){
                            this.account = value;
                        } else {
                            value && (this.account = value);
                        }
                    }
                } else {
                    value && (this.account = value);
                }
            },
            remote(query) {
                this.query = query;
            },
            getLabel(){
                let option = this.options.find(option=>this.value === option.value);
                if(option){
                    return option.label;
                }else{
                    return '';
                }
            }
        },
        watch: {
            account(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.init(val);
            },
            type(val) {
                this.init();
            },
        },
        computed: {
            ...mapGetters({
                accounts: 'api/getPublishAccount',
            }),
            getAccounts() {
                return this.accounts(this.type);
            },
            options() {
                let ret = [];
                for (let i = 0; i < this.getAccounts.length; i++) {
                    if (ret.length >= this.optionOptions.maxCount) {
                        break;
                    }
                    if (!this.query) {
                        ret.push(this.getAccounts[i]);
                    }else{
                        if(typeof this.query === 'number'){
                            if(this.getAccounts[i].value === this.query){
                                ret.push(this.getAccounts[i]);
                            }
                        }else{
                            if(this.getAccounts[i].label.toLocaleLowerCase().indexOf(this.query.toLocaleLowerCase()) >= 0){
                                ret.push(this.getAccounts[i]);
                            }
                        }
                    }
                }
                return ret;
            }
        },
        props: {
            disabled: {
                type: Boolean,
                default: false,
            },
            value: {
                required: true,
            },
            fixUrl: { //是否处理url
                type: Boolean,
                default: false,
            },
            refresh: { //强制刷新
                type: Boolean,
                default: false,
            },
            url: {
                required: true,
                type: String
            },
            param: {
                type: Object,
                default() {
                    return {}
                }
            },
            type: {
                required: true,
                default() {
                    return "default"
                }
            },
            placeholder: {
                default() {
                    return "输入搜索更多..."
                }
            },
            fixResult: {
                type: Function,
                default(res) {
                    return res.data.map(row => {
                        return {
                            label: row.code,
                            value: row.id
                        }
                    })
                }
            },
            nameResult: {
                type: Function,
                default(res) {
                    return res.data.map(row => {
                        return {
                            label: row.account_name,
                            value: row.id
                        }
                    })
                }
            },
            optionOptions: {
                default() {
                    return {
                        maxCount: 50
                    }
                }
            },
            callBack:{
                type:Function,
                default() {
                        return  false
                }
            },
        },
        components: {}
    }
</script>
