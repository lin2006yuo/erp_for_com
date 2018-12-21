    <template>
        <div class="borderd" v-resize="{height:65}">
            <tree v-loading="isLoading" element-loading-text="玩命加载中...":tree="treeData" @node-click="handle_node_click" class="pre-index-tree"></tree>
        </div>
    </template>
    <style lang="stylus">
        .pre-index-tree{
            max-height:760px;
            overflow-y:auto;
        }
        .borderd{
            height:756px;
            border:1px solid #ddd;
        }
    </style>
    <script>
    import tree from "../../../../components/tree.vue";
    import {api_get_categories} from "../../../../api/supplier-quote";
        export default{
            data() {
                return {
                    treeData:[],
                    isLoading:true,
                };
            },
            created(){
                this.get_categories();
            },
            methods: {
//              获取分类列表
                get_categories(){
                    this.isLoading=true;
                    this.$http(api_get_categories).then(res=>{
                        const root = Object.values(res).filter(row=>!row.pid);
                        const calc = (parent)=>{
                            let obj = {
                                label:parent.title,
                                id:parent.id,
                            };
                            if(parent.child_ids && parent.child_ids.length >0){
                                obj.children = parent.child_ids.map(child_id=>{
                                    return calc(res[child_id])
                                });
                            }
                            return obj;
                        };
                        this.treeData = root.map(calc);
                        this.isLoading=false;
                    }).catch(code=>{
                        console.log(code);
                    })
                },
//                点击节点
                handle_node_click(data) {
                        this.$emit("change",data.id)
                },
            },

            components:{
                tree
            }
        };
    </script>