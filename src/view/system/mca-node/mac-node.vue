<style lang="stylus">
</style>
<script>
    import {url_set_page_node,url_set_filter_node} from "../../../api/mca-node"
    export default{
        permission: {
            url_set_page_node,
            url_set_filter_node
        },
        data(){
            return{
            }
        },
        props:{
            nodes:{
                required:true,
                type:Array
            }
        },
        methods:{
        },
        components:{
            uiTableBody:require('../../../components/ui-table.vue').default
        },
        render(h){
//            const heads =['模块','标题','路由','操作'];
            const heads =[
                {label:'模块',width:25},
                {label:'标题',width:35},
                {label:'路由',width:40},
            ];
            let childs=[];
            let modules = {};
            this.nodes.forEach(node=>{
                modules[node.module] = modules[node.module] || [];
                modules[node.module].push(node);
            });
            for(let module in modules){
                if(modules.hasOwnProperty(module)){
                    childs.push(<tr>
                        <td>{module}</td>
                        <td></td>
                        <td></td>
                    </tr>);
                    let controllers = modules[module];
                    for(let controller in controllers){
                        if(controllers.hasOwnProperty(controller)){
                            controller = controllers[controller];
//                            let page="";
//                            if(this.$hasPermission(url_set_page_node)){
//                                page=<span class="btn" on-click={()=>{this.$emit('show-page-node',controller)}}>
//                                页面节点
//                                </span>
//                            }
//                            let filterss="";
//                            if(this.$hasPermission(url_set_filter_node)){
//                                filterss=<span class="btn" on-click={()=>{this.$emit('show-filter-node',controller)}}>
//                                过滤节点
//                                </span>
//                            }
                            childs.push(<tr>
                            <td width="25%">{module}</td>
                            <td width="35%">{controller.title}</td>
                            <td class="t-left" width="40%">{controller.method}//:{controller.route}</td>
                            </tr>);
                        }
                    }
                }
            }
            return <ui-table-body heads={heads} body-height={10} class="mt-sm">
                {childs}
                </ui-table-body>;
        }
    }
</script>
