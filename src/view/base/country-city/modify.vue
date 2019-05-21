<template>
    <page-dialog title="修改城市"
                 v-model="show"
                 size='small'
                 :close-on-click-modal="false"
    >
        <!-- title 选择国家的部分。 -->
        <el-col class="country-dialog mt-md">
            <span class="city-span">城市：</span>
            <div class="div-contains">
                <div class="city-dialog-div mb-sm">
                    <span class="span-item mr-md">
                        <el-input v-model="form.english_name"></el-input>
                        <span class="ml-sm">英文</span>
                    </span>
                    <span class="span-item mr-md">
                        <el-input v-model="form.name"></el-input>
                        <span class="ml-sm">中文</span>
                    </span>
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
    import {api_city_mod} from '../../../api/global-countries';

    export default {
        data() {
            return {
                show: this.value,
            }
        },
        methods: {
            close() {
                this.form.english_name = this.form.english_name.trim();
                this.form.name = this.form.name.trim();
                // 同时需要限制这个必须要输入英文字母。--- 正则限制只能输入字母。
                let reg = /^[A-Za-z]+$/;
                if (this.form.english_name === "" || !reg.test(this.form.english_name)) {
                    this.$message({
                        type: 'warning',
                        message: "英文名字需要填写/只能输入字母"
                    });
                    return;
                }
                let params = {
                    id: this.form.id,
                    english_name: this.form.english_name,
                    name: this.form.name,
                    country_code: this.form.country_code
                };
                // 请求修改数据。
                this.$http(api_city_mod, params.id, params).then(res => {
                    this.$emit('update', params);
                    this.$message({
                        type: 'success',
                        message: "修改成功"
                    });
                    this.show = false;
                }).catch(err => {
                    this.$message({
                        type: 'error',
                        message: err.message || err
                    });
                });
            },
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                this.$emit('input', val);
            }
        },
        props: {
            value: {},
            form: {},
        },
        components: {
            labelItem: require('../../../components/label-item').default,
        }
    }
</script>

<style scoped lang="stylus">
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

</style>
