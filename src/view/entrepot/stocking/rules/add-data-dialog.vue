<template>
    <page-dialog v-model="visible" size="small" @open="open">
        <rule-cond :config="ruleConfig"
                   :data="ruleData"
                   :code="ruleCode"
                   :title="ruleTitle"
        >
        </rule-cond>
        <div slot="footer">
            <el-button @click.native="confirm" size="mini" class="inline">确定</el-button>
        </div>
    </page-dialog>
</template>

<script>
    export default {
        data(){
            return{
                visible: false
            }
        },
        mounted(){

        },
        methods: {
            confirm(){
                this.$emit('confirm')
            },

            open(){
                console.log(this.ruleConfig, 'ruleConfig');
                console.log(this.ruleCode, 'ruleCode');
                console.log(this.ruleData, 'ruleData');
            }
        },
        watch:{
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val)
            },
        },
        props: {
            value:{},
            ruleConfig: {},
            ruleCode: {},
            ruleTitle: {},
            ruleData: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            ruleCond: require('./rule-cond').default
        }
    }
</script>

<style scoped lang="stylus">

</style>