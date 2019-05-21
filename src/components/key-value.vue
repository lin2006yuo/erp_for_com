<template>
    <box-area class="inline">
        <el-select class="inline label-width width-xs" v-model="KEY" clearable>
            <el-option v-for="item in k"
                       :label="item.label"
                       :key="item.value"
                       :value="item.value">
            </el-option>
        </el-select>
        <el-input v-if="inputType" class="inline enter-result" v-model="VAL"></el-input>
        <el-select v-else class="inline"
                   v-model="VAL"
                   :filterable="!!vSearch"
                   :remote-method="remoteMethod"
                   :loading="loading"
                   clearable
        >
            <el-option v-for="item in opts"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"
            >
            </el-option>
        </el-select>
    </box-area>
</template>
<style lang="stylus">

</style>
<script>

    import http from '../lib/http';

    export default {
        data() {
            return {
                KEY: this.value.key || 0,
                VAL: this.value.val || '',
                remote: {},
                loading: false
            }
        },
        methods: {
            remote_require(key, req) {
                this.$http(http('GET', config.apiHost + req.url, req.get || {})).then(res => {
                    this.$set(this.remote, key, res);
                }).catch(code => {
                    console.error(code);
                })
            },
            remoteMethod(query) {
                this.loading = true;
                let opts = this.v.opts.search.call(this._renderContext, query);
                if (opts instanceof Array) {
                    this.$set(this.remote, this.KEY, opts);
                    this.loading = false;
                    return;
                }
                if (opts instanceof Promise) {
                    opts.then(res => {
                        this.$set(this.remote, this.KEY, res);
                        this.loading = false;
                    }).catch(code => {
                        console.error(code);
                    });
                    return;
                }
            }
        },
        computed: {
            k() {
                return this.kv || [];
            },
            v() {
                return this.k.find(row => row.value === this.KEY);
            },
            opts() {
                let find = this.v;
                if (find) {
                    if (!find.opts) {
                        return [];
                    }
                    if (this.remote[this.KEY]) {
                        return this.remote[this.KEY];
                    }
                    if (find.opts instanceof Array) {
                        return find.opts;
                    }
                    if (typeof find.opts === 'string') {
                        this.remote_require(this.KEY, {url: find.opts});
                        return [];
                    }
                    if (typeof find.opts === 'object') {
                        if (!find.opts.search) {
                            this.remote_require(this.KEY, {url: find.opts.url, get: find.opts.get});
                        } else {
                            this.remoteMethod('');
                        }
                        return [];
                    }
                    if (typeof find.opts === 'function') {
                        let opt = find.opts.call(this._renderContext);
                        if (typeof opt === 'array') {
                            return opt;
                        }
                        if (typeof opt === 'object' && opt instanceof Promise) {
                            opt.then(res => {
                                this.$set(this.remote, this.KEY, res);
                            })
                        }
                    }
                    throw new Error(`kv component select options way error ${find.opts}`);
                } else {
                    return [];
                }
            },
            vSearch() {
                if (this.v && this.v.opts) {
                    if (typeof this.v.opts === 'object') {
                        return this.v.opts.search;
                    }
                }
                return false;
            },
            inputType() {
                let find = this.k.find(row => row.value === this.KEY);
                if (find) {
                    return !find.opts;
                } else {
                    return true;
                }
            },
        },
        watch: {
            KEY(val) {
                this.VAL = '';
                this.$emit('input', {key: val, val: this.VAL});
            },
            VAL(val) {
                this.$emit('input', {key: this.KEY, val: val});
            },
            value: {
                deep: true,
                handler(val) {
                    this.KEY = this.value.key || 0;
                    this.VAL = this.value.val || '';
                }
            }
        },
        props: {
            kv: {
                required: true,
                type: Array
            },
            value: {
                type: Object,
                default() {
                    return {
                        key: 0,
                        val: ''
                    }
                }
            },
        },
        components: {
            boxArea: require('./box-area.vue').default
        }
    }
</script>
