<template>
    <div class="p-declare-set">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <label style="line-height: 26px;" class="color-white">{{title}}</label>
                <request-button class="ml-lg" :request="save" v-if="!showBtn">保存</request-button>
            </div>
            <div>
                <declare-data ref="declareData" :lists="dataList" :cardShow="true"></declare-data>
            </div>
        </el-card>
    </div>
</template>
<style lang="stylus">
    .p-declare-set{
        .el-card__header{
            background: #6495ed;
            border:1px solid #6495ed;
            padding: 2px 8px;
        }
        .p-color{
            color: red;
        }
        h4{
            margin: 10px 0;
        }
        .p-card{
            .el-radio__label{
                padding-right: 25px;

            }
        }

    }

</style>
<script>
    import {api_declare_save} from '../../../api/parcel-declare'
    import declareData from './declare-data.vue'
    export default{
        data(){
            return {

            }
        },
        created(){
        },
        mounted(){
        },
        methods: {
            polyType(data){
                if(data.condition instanceof Array){
                    return true
                }else{
                    return false
                }
            },
           showFun(){
               if(!this.$refs.declareData.submit()){
                   return true
                }else {
                    return false;
               }
            },
            saveData(){
                let action_value=[];
                let testData=window.clone(this.dataList);
                testData.forEach(item=>{
                    action_value.push({
                        item_source:item.code,
                        item_value: this.getVal(item.data,item)
                    })
                });
                return action_value
            },
            save(){
                if (this.showFun()) {
                    this.$message({type: "error", message: '请输入正确数字'})
                    return;
                }

                let saveData={
                    action_value:this.saveData()
                };
                return this.$http(api_declare_save,saveData).then(res=>{
                    this.$message({type: "success", message: res.message || res})

                    this.$emit('refresh_set');
                    return Promise.resolve()
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            getVal(arr,item){
                if(arr.length>0){
                    let  item_value=[];
                    arr.forEach(data=>{
                        if(((data.type==2||data.type==6)&&data.key===item.radio)||(data.type==5&&data.checked)||(data.type==1)){
                            item_value.push({
                                operator:data.operator||'',
                                value:data.val,
                                key:data.key,
                                other:data.other||'',
                                group:data.group,
                                child:this.getVal(data.child,item)
                            })
                        }
                    });
                    return item_value
                }
            }
        },
        filters: {},
        watch: {},
        computed: {
            dataList(){
                if(this.infoData){
                    return this.infoData
                }else{
                    return this.defaultData
                }
            }
        },
        props: {
            title:{},
            defaultData:{},
            infoData:{},
            showBtn:{}
        },
        components: {
            declareData,
            requestButton:require('../../../global-components/request-button').default
        }
    }
</script>
