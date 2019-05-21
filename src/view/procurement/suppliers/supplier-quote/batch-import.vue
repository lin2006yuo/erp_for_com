<template>
    <div class="c-batch-import">
        <page-dialog title="批量导入供应商报价" size="small" :close-on-click-modal="false">
            <div>请选择需要导入的文件</div>

        </page-dialog>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>

    export default{
        data(){
            return {}
        },
        components: {
            pageDialog:require('../../../../components/page-dialog.vue').default
        }
    }
</script>