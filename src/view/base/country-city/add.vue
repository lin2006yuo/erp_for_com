<template>
    <page-dialog :title="title"
                 v-model="show"
                 size='small'
                 :close-on-click-modal="false"
    >
        <el-col class="mt-md">
            <label-item label="请选择国家表：">
                <el-select class="width-md"
                           filterable
                           clearable
                           placeholder="请选择国家"
                           v-model="baseData.country"
                >
                    <el-option
                        v-for="item in countryList"
                        :key="item.country_code"
                        :label="item.country_cn_name"
                        :value="item.country_code"
                    >
                    </el-option>
                </el-select>
            </label-item>
        </el-col>

        <el-col class="country-dialog mt-md">
            <span class="city-span">城市：</span>
            <div class="div-contains">
                <div class="city-dialog-div mb-sm" v-for="(item, index) in baseData.list" :key="index">
                    <span class="span-item mr-md">
                        <el-input v-model="item.english_name" :class="{'redColor':flag2.includes(index)}"></el-input>
                        <span class="ml-sm">英文</span>
                    </span>
                    <span class="span-item mr-md">
                        <el-input v-model="item.name" :class="{'redColor':flag3.includes(index)}"></el-input>
                        <span class="ml-sm">中文</span>
                    </span>
                    <el-button type="primary" @click.native="addCountry" class="ml-xs"
                               v-show="index === (baseData.list.length - 1)" size="mini">
                        <span class="el-icon-plus"></span>
                    </el-button>
                    <el-button type="danger" @click.native="subtract(index)" size="mini"
                               v-show="baseData.list.length>1 && index!== 0">
                        <span class="el-icon-minus"></span>
                    </el-button>
                </div>
            </div>
        </el-col>

        <div slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click.native="close">确定</el-button>
            <el-button size="mini" @click.native="show=false">取消</el-button>
        </div>

    </page-dialog>
</template>

<script>
    import {api_global_add, api_country_index} from '../../../api/global-countries';

    export default {
        data() {
            return {
                show: this.value,
                city: {
                    english_name: "",
                    name: "",
                },
                flag2:[],  // 不满足英文城市的
                flag3:[],  // 不满足中文城市的。
            }
        },
        methods: {
            close() {
                if (this.baseData.country === "") {
                    this.$message({
                        type: 'warning',
                        message: "国家不能为空"
                    });
                    return;
                }
                this.baseData.list.forEach(item => {
                    item.english_name = item.english_name.trim();
                    item.name = item.name.trim();
                });
                let flag = this.baseData.list.some(item => {
                    return item.english_name === ""
                });
                let reg = /^[A-Za-z]+$/;
                let reg2 = /^[\u0391-\uFFE5A-Za-z]+$/;
                this.flag2 = [];
                this.flag3 = [];
                this.baseData.list.forEach((item, index) => {
                    if (!reg.test(item.english_name)) {
                      this.flag2.push(index);
                    }
                    if (!reg2.test(item.name)) {
                        this.flag3.push(index);
                    }
                });
                if (flag || this.flag2.length) {
                    this.$message({
                        type: 'warning',
                        message: "英文城市名必填|英文城市名只能输入英文"
                    });
                    return;
                }
                if (this.flag3.length) {
                    this.$message({
                        type: 'warning',
                        message: "中文城市名只能为汉字或英文"
                    });
                    return;
                }
                let params = {
                    country_code: this.baseData.country,
                    detail: this.baseData.list
                };
                // 请求填加数据。
                this.$http(api_global_add, params).then(res => {
                    this.$emit('search');
                    this.show = false;
                }).catch(err => {
                    this.$message({
                        type: 'error',
                        message: err.message || err
                    });
                });
            },
            addCountry() {
                let city = clone(this.city);
                // 加进去的指向同一个对象。
                this.baseData.list.push(city);
            },
            subtract(index) {
                this.baseData.list.splice(index, 1);
            },
            // rowClick(country_code) {
            //     let params = {
            //         country_code: country_code,
            //     };
            //     this.$http(api_country_index, params).then(res => {
            //         if (res.data.length) {
            //             this.baseData.list = res.data;
            //         }
            //     }).catch(err => {
            //         this.$message({
            //             type: 'error',
            //             message: err.message || err
            //         });
            //     });
            // },
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                this.$emit('input', val);
            },
            // "baseData.country"(val) {
            //     if (val) {
            //         this.rowClick(val);
            //     }
            //
            // }
        },
        props: {
            value: {},
            title: {},
            baseData: {
                required: true
            },
            countryList: {
                require: true
            }
        },
        components: {
            labelItem: require('../../../components/label-item').default,
        }
    }
</script>

<style  lang="stylus">
    .country-dialog {
        display flex

        .city-span {
            flex: 0 0 9%;
        }

        .div-contains {
            flex 1;
        }

        .city-dialog-div {
            flex: 1;
            display flex;

            .span-item {
                display flex;
                align-items center;
            }
        }
    }
    .redColor{
        .el-input__inner{
            border-color #f00;
        }
    }
</style>
