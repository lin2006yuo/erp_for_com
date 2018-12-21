<template>
    <el-popover
            width="170"
            v-model="show"
            :placement="placement"
            trigger="click">
        <div style="border: 1px solid rgba(230,162,60,0.72); border-radius:2px; padding: 5px;" class="el-alert--warning">
            <div style="font-size: 18px;">
                <i class="el-icon-warning"></i>
                {{title}}
            </div>
            <el-form :model="{validate}" :rules="rules" @submit.native.stop.prevent>
                <el-form-item prop="validate">
                    <el-input placeholder="请输入YES" ref="validate"
                              @keyup.enter.native.prevent.stop="enter" v-model="validate"></el-input>
                </el-form-item>
            </el-form>
            <el-checkbox style="float: right;" v-model="remember">记住</el-checkbox>
            <div style="clear: both;">
                <el-button type="primary" @click.native.prevent.stop="enter">确定</el-button>
                <el-button @click.native.stop.prevent="show=false;">取消</el-button>
            </div>
        </div>
        <el-button slot="reference" :disabled="show" :type="type" size="mini" @click.native.stop="click">
            <slot></slot>
        </el-button>
    </el-popover>
</template>

<script>
    export default {
        name: "makesure",
        data() {
            return {
                show: false,
                validate: '',
                remember: false,
                rules: {
                    validate: [
                        {
                            validator(_, val, cb) {
                                if (!/^(yes)$/i.test(val)) {
                                    cb(new Error('请输入YES'))
                                }
                            },
                            trigger:'blur'
                        }
                    ]
                }
            }
        },
        methods: {
            click() {
                this.show = true;
                this.$nextTick(() => {
                    this.$refs.validate.focus()
                })
            },
            enter() {
                if (/^(yes)$/i.test(this.validate)) {
                    this.$emit('click');
                } else {
                    this.$refs.validate.focus();
                }
            }
        },
        watch: {
            show() {
                this.remember || (this.validate = '');
            }
        },
        props: {
            type: {
                default() {
                    return 'primary'
                }
            },
            title: {},
            placement:{
                default(){
                    return 'right'
                }
            }
        }
    }
</script>

<style scoped>

</style>