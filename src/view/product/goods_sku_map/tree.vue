    <template>
        <tree v-loading="isLoading" element-loading-text="玩命加载中..."
                :tree="treeData"
                @node-click="handle_node_click"
                class="index-tree"></tree>
    </template>
    <style lang="stylus">

    </style>
    <script>
    import {api_get_categories} from '../../../api/goods-sku-map';
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
                    this.treeData=[];
                    this.isLoading=true;
                    this.$http(api_get_categories).then(res=>{
                        for(let i in res){
                            let treeObj = {}
                            if(res[i].hasOwnProperty("child_ids")&&(res[i].child_ids.length>0)){
                                treeObj.label =res[i].title;
                                treeObj.id = res[i].id;
                                treeObj.children = res[i].child_ids.map(row=>{
                                    return {
                                        id:res[row].id,
                                        label:res[row].title
                                    }
                                })
                                this.treeData.push(treeObj);
                            }
                        }
                        this.isLoading=false;
                    }).catch(code=>{
                        console.log(code);
                    })
                },
                handle_node_click(data) {
                    this.$emit("change",data.id)
                },
            },
            components:{
                tree: require('../../../components/tree.vue').default,
            }
        };
    </script>
