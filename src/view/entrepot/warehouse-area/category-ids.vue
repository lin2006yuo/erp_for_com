<template>
    <div class="c-category-ids">
        <page-dialog v-model="show" class="add-classify" title='选择分类' size="small" :close-on-click-modal="false" style="z-index: 99999999999;">
                <el-tree show-checkbox
                         node-key="id"
                         ref="tree"
                         highlight-current
                         class="product-list-tree"
                         empty-text="正在加载分类列表"
                         @node-click="categories_click"
                         :default-checked-keys="categoryIds"
                         :props="defaultProps"
                         :data="categories"></el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click.native="submit">确定</el-button>
                <el-button size="mini" @click.native="show = false">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_categories} from '../../../api/categories';
    export default{
        data(){
            return {
                show: this.value,
                selectCategories:0,
                categoriesTempl:{},
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
            }
        },
        mounted(){
            this.categories_init();
        },
        methods:{
            categories_init(){
                this.$http(api_get_categories,{}).then(res=>{
                    this.categoriesTempl = res;
                }).catch(code=>{
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            categories_click(node){
                this.selectCategories = node.id;
            },
            submit(){
            	this.show = false;
                let nodes = this.$refs.tree.getCheckedNodes();
                let ids = this.$refs.tree.getCheckedKeys();
                nodes.forEach(res=>{
                   if(res.children.length>0){
                   	let index = nodes.findIndex(row=>res.id===row.id);
                   	nodes.splice(index,1);
                   	let find = ids.findIndex(row=>res.id===row);
                   	ids.splice(find,1);
                   }
                   if(res.parents){
                       res.parents.forEach(row=>{
                           let parents_name = this.categories.find(item=>item.id===row);
                           if(!!parents_name){
                              res.name_path = `${parents_name.title}>>${res.title}`;
                           }
                       });
                   }
                });
                this.$emit('submit',nodes,ids);
            },

        },
        watch:{
            value(val){
                this.show=val;
            },
            show(val){
                this.$emit("input",val);
            },
        },
        computed:{
            categories(){
                let self = this;
                function do_node(id){
                    let children = self.categoriesTempl[id];
                    let node = {
                        id:id,
                        label:children.title,
                        name_path:children.name_path,
                        parents:children.parents,
                        title:children.title,
                        children:do_children(children.child_ids)
                    };
                    return node;
                }
                function do_children(ids) {
                    return ids.map(id=>{
                        return do_node(id);
                    })
                }
                if(this.categoriesTempl.child_ids){
                    return do_children(this.categoriesTempl.child_ids);
                }else{
                    return [];
                }
            },
        },
        props:{
            value:{},
            categoryIds:{},
        },
        components:{
            pageDialog:require ("../../../components/page-dialog.vue").default,
        }
    }
</script>

