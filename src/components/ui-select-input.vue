<template>
    <div class="c-ui-selecte-input">
        <el-input :placeholder="`${disabled?'请先选择调价类型...':'请输入数字...'}`" :disabled="disabled" v-model="value_"
                  @focus="input_focus" @blur="input_blur" @keyup.native="setValue">
            <el-select v-model="data.symbol" slot="prepend">
                <el-option label="+" value="0"></el-option>
                <el-option label="-" value="1"></el-option>
            </el-select>
            <img v-if="showIcon" :class="iconClass" src="../assets/apply_all.svg" @click="applyAll" title="应用到所有"
                 slot="icon">
            <el-button class="el-btn-width el-btn-cursor-default" slot="append">{{units}}</el-button>
        </el-input>
    </div>
</template>
<style lang="stylus" scoped>
    .c-ui-selecte-input {
        .el-btn-width {
            min-width 38px;
        }
        img.c-ui-input-icon-none {
            display: inline;
            position: absolute;
            top: 5px;
            right: 50px;
            width 18px;
            opacity 0;
        }
        img.c-ui-input-icon-none:hover {
            transition width 0.2s, opacity 0.2s, display 0.2s;
            display: inline;
            position: absolute;
            top: 6px;
            right: 48px;
            width 20px;
            opacity 1;
        }
        img.c-ui-input-icon-show {
            display: inline;
            position: absolute;
            top: 6px;
            right: 48px;
            width 20px;
        }
        .el-btn-cursor-default{
            cursor: default;
        }
    }
</style>
<script>
    export default {
        data() {
            return {
                value_: this.value,
                min: 0,
                limit: 2,
                iconClass: 'c-ui-input-icon-none'
            }
        },
        methods: {
            setValue() {
                if (!isNaN(this.value_)) {
                    //开始出现多个0时
                    let  zeromore=/^([\-])?[0]{1,}(\d+$)/;
                    if(zeromore.test(this.value_)){
                        let matchZ = this.value_.match(zeromore);
                        if(!!matchZ[1]&&Number(matchZ[2]>0)){
                            this.value_ = matchZ[1] + matchZ[2];
                        }else{
                            this.value_ = matchZ[2];
                        }
                        return ;
                    }
                    if(this.value_===""){
                        this.value_="";
                        return ;
                    }
                    //数据处理
                    let data=Number(this.value_);
                    let regStr = `${this.nagetive ? '([\\-])?' : ''}([\\d]*)${this.limit>0?`([\\.]?)([\\d]{0,${this.limit}})?`:''}`;
                    let reg=new RegExp(`^${regStr}$`,"g");
                    if (reg.test(data)) {
                        if (!!this.value_ && this.value_.toString().search(".") !== -1) {
                            let match2 = this.value_.toString().match(regStr);
                            this.value_ = "";
                            this.$nextTick(() => {
                                this.value_ = match2[0];
                                this.minNum();
                            })
                        }
                        this.minNum();
                    } else {
                        let match = this.value_.toString().match(regStr);
                        this.value_ = "";
                        this.$nextTick(() => {
                            this.value_ = match[0];
                        })
                    }
                } else {
                    this.value_ !== '-' && (this.value_ = parseInt(this.value_) || '0');
                }
            },
            minNum() {
                if (this.isLimitSize) {
                    if (this.min || this.min === "0") {
                        if (Number(this.value_) < Number(this.min)) {
                            this.value_ = this.min;
                        }
                    }
                    if (this.max) {
                        if (Number(this.value_) > Number(this.max)) {
                            this.value_ = this.max;
                        }
                    }
                }
            },
            input_focus() {
                this.iconClass = 'c-ui-input-icon-show';
            },
            input_blur() {
                this.iconClass = 'c-ui-input-icon-none';
            },
            applyAll() {
                this.$emit('apply-all', this.value_, this.data);
            },
        },
        computed: {
            max() {
                if (this.isLimitSize) {
                    if (this.data.symbol === '0') {
                        return 100;
                    } else {
                        return 30;
                    }
                }
            },
        },
        watch: {
            value(val) {
                if (!val) {
                    this.value_ = 0;
                } else {
                    this.value_ = val;

                }
            },
            value_(val) {
                this.$emit('input', val);
            },
        },
        props: {
            value: {
                required: true,
            },
            data: {
                required: true
            },
            units: {
                type: String,
                default: '%'
            },
            showIcon: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            isLimitSize: {
                type: Boolean,
                default: false
            }
        },
        components: {}
    }
</script>
