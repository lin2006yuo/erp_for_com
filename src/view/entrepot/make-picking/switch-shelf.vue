<template>
    <page-dialog v-model="visible"
                 title="选择播种车"
                 size="small"
                 :close-on-click-modal="false">
        <label-item label="选择播种车：">
            <el-select v-model="sorting_shelf_id" class="width-sm" @change="change_shelf">
                <el-option v-for="item in shelfList"
                           :key="item"
                           :label="item.name"
                           :value="item.id">
                </el-option>
            </el-select>
        </label-item>
        <div slot="footer">
            <el-button type="primary" size="mini" @click="save">确定</el-button>
            <el-button size="mini" @click="cancel">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_shelf} from '@/api/sorting-shelf'
    export default {
        data(){
            return {
                visible: false,
                sorting_shelf_id:'',
                shelfList:[]
            }
        },
        mounted(){
        },
        methods: {
            init(){
                this.$http(api_get_shelf).then(res=>{
                    this.shelfList = res.data;
                    this.sorting_shelf_id = window.clone(this.oldShelfId);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            change_shelf(){
                let row = this.shelfList.find(row=>{
                    if(row.id === this.sorting_shelf_id){
                        return row;
                    }
                });
                this.$emit('change-shelf',row);
            },
            save(){
                this.$emit('save-shelf',this.sorting_shelf_id);
                this.visible = false;
            },
            cancel(){
                let row = this.shelfList.find(row=>{
                    if(row.id === this.oldShelfId){
                        return row;
                    }
                });
                this.$emit('cancel', row);
                this.visible = false;
            }
        },
        computed: {},
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                if(val){
                    this.init();
                }
                this.visible = val;
            },
        },
        props: {
            value:{},
            oldShelfId:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            labelItem:require('@/components/label-item.vue').default
        },
    }
</script>
