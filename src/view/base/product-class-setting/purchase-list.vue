<template>
    <page-dialog v-model="show" title="分类">
        <el-table class="purchase-list" :data="data" @selection-change="selectionChange" :row-class-name="rowClassName">
            <el-table-column type="selection" width="35" :selectable="selectable"></el-table-column>
            <el-table-column label="子类名" prop="category_name"  show-overflow-tooltip></el-table-column>
            <el-table-column label="采购人" prop="purchase_name"></el-table-column>
            <el-table-column label="绑定状态" inline-template>
                <span>
                    <template v-if="row.is_bind">
                        绑定给
                    <span class="btn">{{`${row.developer_name}`}}</span>
                    </template>
                    <template v-else>
                        未绑定
                    </template>
                </span>
            </el-table-column>
        </el-table>
        <span slot="footer">
            <el-button type="primary" size="mini" @click.native="save">确定</el-button>
            <el-button size="mini" @click.native="show=false">取消</el-button>
        </span>
    </page-dialog>
</template>
<style lang="stylus">
    .purchase-list{
        .bind{
            background-color: #d3d4d6 !important;
            cursor: not-allowed;
        }
    }
</style>
<script>

    import {api_get} from '../../../api/classify-bind-buyer';
    export default{
        data(){
            return{
                show:this.value,
                data:[],
                selected:[]
            }
        },
        methods:{
            init(){
                this.$http(api_get, {pid:this.category}).then(res=>{
                    this.data = res.data;
                }).catch(code=>{
                    console.log(code);
                })
            },
            selectable(row){
                return !row.is_bind;
            },
            rowClassName(row){
                return row.is_bind ? 'bind' : '';
            },
            selectionChange(sel){
                this.selected = sel;
            },
            save(){
                this.$emit('selected', this.selected);
                this.selected = [];
                this.show = false;
            }
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
                if(val){
                    this.init();
                }
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            category:{
                required:true,
                type:[Number,String]
            }
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default
        }
    }
</script>