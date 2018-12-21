<template>
    <page-dialog v-model="show" title='添加分类' class="add-classify" size="large" :close-on-click-modal="false" @change="chang_dialog" >
        <classify-card v-model="test" ref="addclass">
        </classify-card>
        <span  slot="footer" class="dialog-footer">
            <el-button type="primary" @click.native="submit_classify" size="mini">确 定</el-button>
            <el-button @click.native="show = false" size="mini">取 消</el-button>
        </span>
    </page-dialog>
</template>
<style lang="stylus">
.add-classify{
    background: white;
    z-index: 104;
    .classify-card{
        z-index: 105;
    }
}
</style>
<script>
    export default{
        data(){
            return{
                show:this.value,
                id:0,
                req:[],
                isAdd:false,
                plat:[],
                index:"",
            }
        },
        computed:{
            test:{
                get(){
                    return {req:this.req}
                },
                set(val){
                    this.id=val.id;
                    this.req=val.req;
                }
            }
        },
        methods:{
            submit_classify(){
                let flag=true;
                let data=[];
                if(this.req.length===0){
                    this.$message({type:"error",message:`请选择分类`});
                    return ;
                }
                console.log(this.plat);
                this.plat.forEach((row,row_i)=>{
                    if(this.isAdd){
                        data.push(JSON.parse(row.path)) ;
                    }else {
                        this.index!==row_i&& data.push(JSON.parse(row.path));
                    }
                });
                let plat=data.filter(row=>{
                    return row[0].is_site===this.req[0].is_site
                });
                if(this.req[0].is_site){
                    let find=plat.find(row=>{
                        return row[0].id===this.req[0].id&&row[1].id===this.req[1].id
                    });
                    if(!!find){
                        flag=false;
                        this.$message({type:"warning",message:"同一个平台的同一个站点只能添加一条分类，请选择其他站点！"});
                    }
                }else {
                    let find=plat.find(row=>{
                        return row[0].id===this.req[0].id
                    });
                    if(!!find){
                        flag=false;
                        this.$message({type:"warning",message:"无站点的平台，同一个平台只能添加一条分类，请选择其他平台！"});
                    }
                }

                if(!flag)return;
                this.show=false;
                this.$emit("getclass",this.req);
            },
            chang_dialog(val){
                if(!val){
                    this.plat=[];
                    this.isAdd=false;
                }
            }
        },
        filters:{
        },
        watch:{
            value(val){
                this.show=val;
            },
            show(val){
                this.$emit("input",val)
            }
        },
        props:{
            value:{},
        },
        components:{
            pageDialog:require ("../../../components/page-dialog.vue").default,
            classifyCard:require('../../../components/classify-card.vue').default
        }
    }
</script>
