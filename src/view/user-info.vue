<template>
    <div class="user_info">
        <gen-page :resource="[]"></gen-page>
    </div>
</template>
<style lang="stylus">
    .draggable{
        display: inline-block;
        margin: 10px;
        padding: 10px;
        border: 1px solid #d2f5ff;
    }
</style>
<script>

    import erpLabel from '../components/erp-label.vue';
    import muiSelect from '../components/mui-select.vue';
    import cardColor from '../components/card-color.vue';
    import cardSize from '../components/card-size.vue';
    import draggable from '../components/drag-drop';
    import tabTree from '../components/tab-tree';
    import tabDrop from '../components/tab-drop';
    import textareaFormat from '../components/textarea-format.vue';
    import htmlEditor from '../components/html-editor.vue';
    import editor from './form/editor/index.vue';
    import pageEditor from './form/page-editor/index.vue';
    import genCate from '../components/gen-cate';
    import vuex_mixin from '../mixins/vuex_mixin';
    import genPage from '../components/gen-page';
    export default{
        mixins:[vuex_mixin(['navs_get','navs_index'],['nav_cast'])],
        data(){
            return {
                html:'',
                text:'',
                ddd:'fasdfsafas',
                index:10,
                cardColors:[
                    {status:false,color:'red',label:'ssssss'},
                    {status:false,color:'blue',label:'aaaaaa'},
                    {status:false,color:'yellow',label:'bbbbbb'},
                    {status:false,color:'gray',label:'cccccc'},
                ],
                cardSizes:[
                    {status:false,label:'ssssss'},
                    {status:false,label:'aaaaaa'},
                    {status:false,label:'bbbbbb'},
                    {status:false,label:'cccccc'},
                ],
                handleDrop: function(){},
                tasks:[
                    {title:'x1'},
                    {title:'x2'},
                    {title:'x3'},
                    {title:'x4'},
                ],
                tree:[
                    {name:'x1',tree:[
                        {name:'xx1',tree:[]},
                        {name:'xx2',tree:[]},
                        {name:'xx3',close:true, tree:[
                            {name:'xxx1',close:true,tree:[]},
                            {name:'xxx2',tree:[]},
                            {name:'xxx3',tree:[]},
                            {name:'xxx4',tree:[]},
                        ]},
                        {name:'xx4',tree:[]},
                        {name:'xx5',tree:[
                            {name:'xx3',tree:[]}
                        ]}
                    ]}
                ],
                tree2:[
                    {name:'x1',id:1,pid:0},
                    {name:'x2',id:2,pid:0},
                    {name:'xx1',id:3,pid:1},
                    {name:'xx2',id:4,pid:1},
                ],
                tree3:[],
                s:[1,2,3333333,4222]
            }
        },
        beforeCreate(){
        },
        mounted(){
        },

        refresh(){
            console.log('user-info refresh');
            console.log(this.s);
        },
        methods:{
            fasdfafd(html){
                this.html = html;
            },
            addtree(){
                this.tree2.push({name:Math.random().toString(),id:1,pid:0});
            },
            draggable(){

            },
            router(){
                this.$router.open(10,20,30);
            },
            click(){

            }
        },
        filters:{
            tfilte(val){
            }
        },
        computed:{
            selectC(){
                return this.cardColors.filter(ret=>ret.status);
            },
            selectS(){
                return this.cardSizes.filter(ret=>ret.status);
            },
            selectCS(){
                let ret = [];
                for(let i = 0; i < this.selectC.length; i++){
                    for(let j = 0; j < this.selectS.length; j++){
                        ret.push({color:this.selectC[i].color, size: this.selectS[j].label});
                    }
                }
                return ret;
            }
        },
        components: {
            muiSelect,cardColor,cardSize,draggable,
            erpLabel,tabTree,tabDrop,textareaFormat,
            htmlEditor,editor,pageEditor,genCate,genPage
        }
    }
</script>
