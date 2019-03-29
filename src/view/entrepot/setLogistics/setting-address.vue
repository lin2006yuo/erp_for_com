<template>
    <page-dialog
        :title="title"
        v-model="dialogVisible"
        width="45%"
    >
        <div class="inner-title">{{role}}地址：</div>
        <div class="input-wrapper">
            <el-input class="inline" placeholder="国家" v-model="country"></el-input>
            <el-input class="inline" placeholder="省" v-model="province"></el-input>
            <el-input class="inline" placeholder="市" v-model="city"></el-input>
            <el-input class="inline" placeholder="联系人" v-model="contact"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="submit" :loading="loading">保 存</el-button>
            <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        </span>
    </page-dialog>
</template>
<script>
    export default {
        data() {
            return {
                loading: false,
                country: '',
                province: '',
                city: '',
                contact: ''
            }
        },
        computed: {
            dialogVisible: {
                get() {
                    return this.value
                },
                set(val) {
                    this.$emit('input', val)
                }
            },
            role() {
                if(this.type === 1) return '寄件人'
                else if(this.type === 2) return '揽收人'
                else if(this.type === 3) return  '退件人'
                else return '映射错误'
            },
            title() {
                return `批量设置${this.role}`
            }
        },
        methods: {
           submit() {
                this.loading = true
                const { country, province, city, contact, type } = this
                const Promise = this.request({ country, province, city, name: contact, type })
                Promise.then(res => {
                    this.loading = false
                    return res
                }).catch(e => {
                    this.loading = false
                    this.$message({ type: 'error', message: '保存失败' + e })
                })
            },
            reset() {
               this.country = ''
                this.province = ''
                this.city = ''
                this.contact = ''
            }
        },
        watch: {
            dialogVisible(val){
              if(val === false) {
                  this.reset()
              }
            }
        },
        props: {
            value: Boolean,
            type: Number,
            request: Function
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
        }
    }
</script>
<style lang="stylus" scoped>
    .inner-title {
        font-size: 14px;
        margin: 5px 0 20px;
        text-indent: 12px;
    }
    .input-wrapper {
        padding: 0px 12px 35px;
        display: flex;
        justify-content: space-between;
    }
</style>
