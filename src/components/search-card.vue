<template>
    <el-card ref="searchCard">
        <slot></slot>
        <slot name="search">
            <el-button class="inline "
                       size="mini"
                       type="primary"
                       :disabled="isSearch"
                       @keyup.enter.native="submitChange"
                       @click.native="submitChange">{{$t('common.search')}}</el-button>
        </slot>
        <slot name="reset">
            <el-button class="inline" size="mini" type="primary"
                       :disabled="!this.change"
                       @click.native="resetChange">{{$t('common.restore_modified')}}</el-button>
        </slot>
        <slot name="clear">
            <el-button class="inline" size="mini" type="warning"
                       :disabled="!this.hasParams"
                       @click.native="clearParams">{{$t('common.clear')}}</el-button>
        </slot>
    </el-card>
</template>
<script>
    const changeClasses = ['sf-change'];
    export default {
        data() {
            return {
                oldParams: null,
                change: false,
                fieldComponents: {}
            }
        },
        mounted() {
            this.oldParams = clone(this.params);
            this.$nextTick(_ => {
                if(this.$refs.searchCard && this.$refs.searchCard.$el){
                    this.initKeyup = true;
                    this.$refs.searchCard.$el.addEventListener('keyup', this.keyup);
                }else{
                    console.error(`can't init search-card keyup event`);
                }
            });
        },
        methods: {
            keyup(event) {
                if (event.key === 'Enter') {
                    if(this.autoEnter){
                        return this.$emit('enter');
                    }
                    if (event.path && (event.path.constructor.name === 'Array')) {
                        if (event.path.some(el => {
                                return el.classList && el.classList.contains(this.hookClass);
                            })) {
                            this.$emit('enter');
                        }
                    }
                }
            },
            setClasses(changes) {
                if (this.debug) {
                    console.log(`changes:${JSON.stringify(changes)}`);
                }
                this.$nextTick(_ => {
                    changes.forEach(field => {
                        let vnode = this.fieldComponents[field];
                        if (vnode) {
                            vnode.elm.addClass(changeClasses);
                        }
                        if (this.debug && !vnode) {
                            console.error(`prams.${field} not use v-sf.${field}`);
                        }
                    })
                })
            },
            delClasses() {
                if (!!this.changes) {
                    this.changes.forEach(field => {
                        this.delClass(field);
                    });
                    this.changes.length = 0;
                }
            },
            delClass(field) {
                let vnode = this.fieldComponents[field];
                if (vnode) {
                    vnode.elm.remClass(changeClasses);
                }
                if (this.debug && !vnode) {
                    console.error(`prams.${field} not use v-sf.${field}`);
                }
            },
            submitChange(val) {
                this.$emit('search');
                this.chearChange();
            },
            searchEnter() {
                console.log('searchEnter')
            },
            chearChange() {
                this.change = false;
                this.delClasses();
                this.oldParams = window.clone(this.params);
            },
            resetChange() {
                this.change = false;
                this.delClasses();
                for (const key in this.oldParams) {
                    if (this.oldParams.hasOwnProperty(key)) {
                        this.params[key] = this.oldParams[key];
                    }
                }
                this.$nextTick(_ => {
                    this.change = false;
                });
            },
            clearParams() {
                for (const key in this.oldParams) {
                    if (this.oldParams.hasOwnProperty(key) && this.params.hasOwnProperty(key)) {
                        if (this.clears[key] === undefined) {
                            this.params[key] = '';
                        } else {
                            this.params[key] = this.clears[key];
                        }
                    }
                }
                this.$emit('init-params');
            },
            isChangeParam(old_, new_) {//if change return true ,else false;
                if (old_.constructor.name === new_.constructor.name) {
                    const type = old_.constructor.name;
                    switch (type) {
                        case 'Array':
                            if (old_.length !== new_.length) {
                                return true;
                            }
                            for (let i = 0; i < old_.length; i++) {
                                if (this.isChangeParam(old_[i], new_[i])) {
                                    return true;
                                }
                            }
                            return false;
                        case 'Object':
                            for (let k in old_) {
                                if (old_.hasOwnProperty(k)) {
                                    if (this.isChangeParam(old_[k], new_[k])) {
                                        return true;
                                    }
                                }
                            }
                            for (let k in new_) {
                                if (new_.hasOwnProperty(k)) {
                                    if (this.isChangeParam(old_[k], new_[k])) {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        case 'Date':
                            return new_.getTime() !== old_.getTime();
                        case 'String':
                            return new_ !== old_;
                        case 'Number':
                            return new_ !== old_;
                        case 'Boolean':
                            return new_ !== old_;
                        default:
                            console.error(`isChangeParam value type not support ${type}`);
                            return false;
                    }
                } else {
                    return true;
                }
            }
        },
        beforeDestroy() {
            if(this.initKeyup){
                this.$refs.searchCard.$el.removeEventListener('keyup', this.keyup);
            }
        },
        props: {
            autoEnter:{
                type:Boolean,
                default(){
                    return true;
                }
            },
            params: {
                type: Object,
                required: true,
            },
            clears: {
                type: Object,
                default() {
                    return {};
                }
            },
            debug: {
                default() {
                    return false;
                }
            },
            enable: {
                default() {
                    return true;
                }
            },
            initButton: {
                default() {
                    return false;
                }
            },
            isSearch: {
                default() {
                    return false;
                }
            },
            hookClass: {
                default() {
                    return 'enter-result';
                }
            }
        },
        computed: {
            hasParams() {
                return !!Object.values(this.params).find(val => !!val);
            }
        },
        watch: {
            params: {
                deep: true,
                handler(new_) {
                    if (!this.enable) {
                        this.oldParams = clone(this.params);
                        return;
                    }
                    if (!this.changes) {
                        this.changes = [];
                    }
                    let changes = [];
                    for (const key in new_) {
                        if (new_.hasOwnProperty(key)) {
                            if (this.isChangeParam(this.oldParams[key], new_[key])) {
                                if (!this.changes.includes(key)) {
                                    if (this.debug) {
                                        console.log(`change:${key} old:${JSON.stringify(this.oldParams[key])}; new:${JSON.stringify(new_[key])}`);
                                    }
                                    changes.push(key);
                                    this.changes.push(key);
                                }
                            } else {
                                if (this.changes.includes(key)) {
                                    const index = this.changes.indexOf(key);
                                    this.changes.splice(key, 1);
                                    this.delClass(key)
                                }
                            }

                        }
                    }
                    this.setClasses(changes);
                    this.change = !!this.changes.length;
                }
            }
        },
        components: {
        }
    }
</script>
