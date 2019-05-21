<style lang="stylus">

</style>
<script>

    import {api_get_define} from '../../../api/config-params';
    import {typeLabel} from './define';
    export default{
        data(){
            return{
                define:[],
                heads:[
                    {label:"分组code",colspan:1,width:14.2858},
                    {label:"分组标题",colspan:2,width:14.2857},
                    {label:"分组备注",colspan:3,width:14.2857},
                    {label:"操作",colspan:1,width:14.2857}
                ]
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){
                this.$http(api_get_define).then(res=>{
                    this.define = res;
                })
            }
        },
        components:{
            uiTableBody:require('../../../components/ui-table-body.vue').default,
        },
        render(createElement){
            let trs = [];
            this.define.forEach(def=>{
                let rowspan = 1;
                if(def.childs.length > 0){
                    rowspan = def.childs.length + 2;
                }
                trs.push(createElement('tr',{},[
                    createElement('td',{attrs:{colspan:1,rowspan:rowspan}},def.code),
                    createElement('td',{attrs:{colspan:2}},def.title),
                    createElement('td',{attrs:{colspan:3}},def.remark),
                    createElement('td',{attrs:{colspan:1}},[
                        createElement('span',{class:['btn'],on:{click:()=>{this.$emit('mdf-group',def)}}},"编辑分组"),
                        createElement('span',{class:['btn'],on:{click:()=>{this.$emit('add-param',def)}}},"添加参数"),
                        createElement('span',{class:['btn'],on:{click:()=>{this.$emit('del-group',def)}}},"移除分组")
                    ]),
                ]));
                if(def.childs.length > 0){
                    trs.push(
                        createElement('tr',{},[
                            createElement('th',{attrs:{colspan:1}},"参数code"),
                            createElement('th',{attrs:{colspan:1}},"参数标题"),
                            createElement('th',{attrs:{colspan:2}},"参数数据"),
                            createElement('th',{attrs:{colspan:1}},"参数备注"),
                            createElement('th',{attrs:{colspan:2}},"操作")
                        ])
                    )
                }
                def.childs.forEach(child=>{
                    let params = child.params || {};
                    params = typeLabel(params.type);
                    trs.push(
                        createElement('tr',{},[
                            createElement('td',{attrs:{colspan:1}},child.code),
                            createElement('td',{attrs:{colspan:1}},child.title),
                            createElement('td',{attrs:{colspan:2}},params),
                            createElement('td',{attrs:{colspan:1}},child.remark),
                            createElement('td',{attrs:{colspan:2}},[
                                createElement('span',{class:['btn'],on:{click:()=>{
                                    this.$emit('mdf-param',child)
                                }}},"编辑参数"),
                                createElement('span',{class:['btn'],on:{click:()=>{
                                    this.$emit('del-param',child)
                                }}},"删除参数")
                            ]),
                        ])
                    )
                })
            });

            return createElement('ui-table-body',{props:{heads:this.heads}},trs);
        }
    }
</script>