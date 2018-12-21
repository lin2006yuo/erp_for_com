<template>
    <div class="c-label-buttons" :class="disabled ? 'disabled' : ''">
        <label :style="labelStyle">{{label}}</label>
        <el-button v-if="head" size="mini"
                   @click.native="doHead()"
                   :type="headSelect ? 'primary' : 'default'"
                   class="button"
        >
            {{head.label || head.name}}{{head.count | filterButton}}
        </el-button>
        <el-button
                size="mini"
                :type="more_type(item)"
                v-for="(item,index) in maxMore"
                :key="index"
                @click.native="buttonClick(item)">
            {{item.label || item.name}}{{item.count | filterButton}}
            <i v-if="more_select(item)" class="el-icon-check"></i>
        </el-button>
        <el-select v-if="showMoreMore" class="inline" v-model="select"
                   filterable
        >
            <el-option v-for="item in remains"
                       :label="item.label || item.name"
                       :value="item.value"
                       :key="item.value"
            ></el-option>
        </el-select>
        <template v-if="moreSelect!==undefined">
            <el-checkbox
                    class="ml-sm"
                    :value="moreSelect"
                    @input="moreSelectInput"
            >{{moreLabel}}</el-checkbox>
            <el-button v-if="moreSelect" size="mini"
                       class="ml-sm"
                       type="primary"
                       @click.native="submit"
                       :disabled="!changeSelect">
                确定
            </el-button>
        </template>
    </div>
</template>
<style lang="stylus">
    .c-label-buttons {
        font-size: 0;
        > * {
            display: inline-block;
            vertical-align: middle;
            height: 100%;
        }
        .button {
            margin-bottom: 3px;
        }
        .disabled {
            cursor: not-allowed;
            opacity: 0.7;
        }
        label {
            font-size: 1.2rem;
        }
    }

</style>
<script>

    export default{
        name: 'label-buttons',
        data(){
            return {
                item: 0,
                headSelect: false,
                selected: [],
                adds: [],
                select: '',
                changeSelect:false,
            }
        },
        filters: {
            filterButton(count){
                if (count > 0) {
                    return `(${count})`
                } else {
                    return ''
                }
            }
        },
        mounted(){
            if (this.head) {
                this.headSelect = true;
            }
        },
        methods: {
            moreSelectInput(val){
                this.$emit('update-more-select', val);
            },
            buttonClick(button){
                this.headSelect = false;
                if(this.moreSelect){
                    let has = this.selected.indexOfFun((val) => {
                        return val.value === button.value;
                    });
                    if (has >= 0) {
                        this.selected.splice(has, 1);
                    } else {
                        this.selected.push(button);
                    }
                    this.changeSelect = true;
                }else{
                    this.selected = [button];
                }

            },
            doHead(){
                this.selected.length = 0;
                this.headSelect = !this.headSelect;
                this.changeSelect = true;
            },
            more_type(button){
                const select = 'primary';
                const def = 'default';
                if (this.headSelect) {
                    return select;
                }
                if (this.selected.indexOfFun(val => button.value === val.value) >= 0) {
                    return select;
                }
                return def;
            },
            more_select(button){
                const select = true;
                const def = false;
                if (this.headSelect) {
                    return select;
                }
                if (this.selected.indexOfFun(val => button.value === val.value) >= 0) {
                    return select;
                }
                return def;
            },
            submit(){
                this.changeSelect = false;
                this.$emit('submit');
            }
        },
        watch: {
            headSelect(status){
                if (status) {
                    this.$emit('select', this.more);
                } else {
                    this.$emit("select", this.selected);
                }

            },
            more(bts){
                if (bts.length >= 1) {
                    this.buttonClick(bts[0]);
                }
            },
            selected(selected){
                this.$emit('select', selected);
            },
            select(val){
                if (val) {
                    let add = this.more.find(row => row.value === val);
                    if (add) {
                        this.adds.push(add);
                        this.$nextTick(() => {
                            this.select = '';
                        });
                    }
                }
            },
            buttons(){
                this.selected = [];
            }
        },
        computed: {
            disabled(){
                return this.todo !== '';
            },
            labelStyle(){
                let style = {
                    textAlign: this.labelAlign || 'right'
                };
                if (this.labelWidth) {
                    style.width = `${this.labelWidth}px`
                }
                return style;
            },
            more(){
                return this.buttons.slice(1, this.buttons.length);
            },
            head(){
                return this.buttons[0] || false;
            },
            moreLen(){
                return this.more.length;
            },
            maxMore(){
                let maxs = this.more.slice(0, this.max);
                return [...maxs, ...this.adds];
            },
            remains(){
                let ret = [];
                this.more.forEach(row => {
                    let find = this.maxMore.indexOfFun(m => {
                        return m.value === row.value;
                    });
                    if (find < 0) {
                        ret.push(row);
                    }
                });
                return ret;
            },
            showMoreMore(){
                if (this.moreLen > this.max && this.remains.length > 0) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        props: {
            buttons: {
                required: true,
                type: Array
            },
            label: {
                required: true,
                type: String
            },
            todo: {
                type: String,
                default: ''
            },
            radio:{
                type:Boolean,
                default(){
                    return false
                }
            },
            labelWidth: {},
            labelAlign: {},
            max: {
                type: Number,
                default(){
                    return 5
                }
            },
            moreSelect:{
            },
            moreLabel:{
                default(){
                    return '启用多选';
                }
            }
        },
        components: {}
    }
</script>
