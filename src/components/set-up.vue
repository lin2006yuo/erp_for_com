<template>
    <el-dialog v-model="dialog" size="small" @close="close_dialog" @open="open_dialog">
        <label-item label="横向菜单触发子菜单方式：">
            <el-radio-group v-model="radio">
                <el-radio label="click">点击触发</el-radio>
                <el-radio label="hover">悬浮触发</el-radio>
            </el-radio-group>
        </label-item>

    </el-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {mapActions,mapGetters} from 'vuex';
    export default {
        data() {
            return {
                radio:'',
                dialog:this.value,
            }
        },
        methods:{
            ...mapActions({
                changeTriggerMenu:'menu-nav/changeTriggerMenu',
            }),
            close_dialog(){
                this.changeTriggerMenu(this.radio);
            },
            open_dialog(){
                this.radio = this.triggerMenu
            },
        },
        computed:{
            ...mapGetters({
                'triggerMenu':'menu-nav/triggerMenu'
            })
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        props:{
            value:{}
        },
        components: {
            labelItem:require('./label-item.vue').default,
        }
    }
</script>