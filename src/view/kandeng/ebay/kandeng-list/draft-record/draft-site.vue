<template>
    <page-dialog :title="title" v-model="show" width="400px" :close-on-click-modal="false" :showCloseIcon="showCloseIcon">
        <label-buttons class="t-center"
                       :buttons="siteLists"
                       @select="change_select"
                       :max=max
                       :label="label"
                       :selectDefault="selectDefault"></label-buttons>
        <div slot="footer" class="dialog-footer">
            <el-button  size="mini" @click="ignore">跳 过</el-button>
            <el-button  size="mini" type="primary"  @click="goOn">确 定</el-button>
        </div>
    </page-dialog>
</template>

<script>
    export default {
        name: "draft-site",
        data(){
            return{
                showCloseIcon:false,
                label:'',
                selectDefault:false,
                siteId:'',
                show:this.value,
                title:'选择站点范本'
            }
        },
        computed:{
            max(){
                return this.siteList.length;
            },
            siteLists(){
                let data = JSON.parse(JSON.stringify(this.siteList))
                data.forEach(res=>{
                    let enName=res.value;
                    res.value=res.id;
                    res.id=enName;
                });
                return data
            },

        },
        watch:{
            value(val){this.show=val},
            show(val){this.$emit('input',val)}
        },
        methods:{
            ignore(){
                this.show=false;
                this.$emit('ignore-data')
            },
            change_select(index,item){
                this.siteId=item.value;
            },
            goOn(){
                if(!this.siteId&&this.siteId!==0){
                    this.$message({type:'warning',message:'请选择站点范本'})
                    return;
                }else {
                    this.$emit('share-data',this.siteId)
                }

            },

        },
        props:{
            siteList:{},
            value:{
                type:Boolean,
                required:true,
            },
        },
        components:{
            labelButtons: require('@/components/label-buttons').default,
        }
    }
</script>

<style scoped>

</style>
