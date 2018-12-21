<template>
    <div id="editor">
        <div class="tool">
            <ul>
                <li v-for="tool in tools" @click="use(tool.action)">{{tool.title}}</li>
            </ul>
        </div>
        <div class="content">
            <div class="editor">
                <edit :component="formCompoents" :setting="setting"></edit>
            </div>
            <div class="component">
                <attr-components @build-component="build_component" :component="components"></attr-components>
            </div>
        </div>
    </div>
</template>
<style lang="stylus">
    #editor{
        width:100%;
        height:100%;
        ul{
            width:100%;
            height:40px;
            li{
                width:40px;
                height:100%;
                display: inline-block;
            }
        }
        .content{
            height:100%;
            overflow: hidden;
            .editor{
                width:80%;
                height:100%;
                display: inline-block;
            }
            .component{
                height:100%;
                width:calc(20% - 1);
                display: inline-block;
                border-left: 1px solid #90302e;
            }

        }
    }
</style>
<script>

    import edit from './edit.vue';
    import attrComponents from './attr-components';
    export default{
        page:{},
        refresh(){
          this.init();
        },
        data(){
            return{
                dialog:false,
                tools:[
                    {title:'保存2'}
                ],
                setting:{
                    width:'100%',
                    height:'100%'
                },
                formCompoents:[],
                components:[
                    {label:"姓名",name:'',alias:'',type:'text',default:''},
                    {label:"性别",name:'',alias:'',type:'sin-select',options:[
                        {label:"男",value:1},
                        {label:"女",value:2}
                    ], default:0},
                    {label:"ssss",name:'',alias:'',type:'mui-select',options:[
                        {label:"理科",value:1},
                        {label:'文科',value:2},
                        {label:'天文科',value:3}
                    ], default:[]}
                ]
            }
        },
        methods:{
            use(){
                console.log(`use`);
            },
            build_component(component){
                this.formCompoents.push(component);
            }
        },
        components:{
            edit,attrComponents
        }
    }
</script>
