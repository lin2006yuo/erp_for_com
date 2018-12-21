<template>
    <div class="c-custom-image">
        <picture-detail
                ref="pictureDetail"
                class="mt-xs"
                :baseUrl="baseUrl"
                :imgs="imgs"></picture-detail>
        <template v-if="editAble">
            <el-button type="primary"
                       size="mini"
                       @click.native="save"
                       class="inline">保存</el-button>
            <el-button size="mini"
                       class="inline"
                       @click.native="cancel">取消</el-button>
        </template>
        <el-button type="primary" size="mini"
                   v-else class="inline"
                   @click.native="edit">编辑</el-button>


    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {}
        },
        methods:{
            edit(){
                this.$emit('edit',this.channelId);
            },
            save(){
                let data = [];
                this.$refs.pictureDetail.list.forEach(row=>{
                    row.data.forEach(res=>{
                        data.push(res);
                    })
                });
                data.forEach((row,index)=>{
                    row.id = typeof row.id==='string'?0:row.id;
                    row.sort = index;
                });
                data =  data.map(row=>{
                    let cur = {
                        id:row.id,
                        sort:row.sort,
                        sku_id:row.sku_id,
                        goods_id:this.goodsId,
                        is_default:row.is_default,
                        channel_id:this.channelId,
                    };
                    if(row.hasOwnProperty('img'))cur.image = row.img;
                    return cur;
                }).filter(row=>!!row.id||!!row.image);
                this.$emit('save',data,this.channelId);
            },
            cancel(){
                console.log("功能待添加");
            },
        },
        props:{
            imgs:{
                required:true,
            },
            goodsId:{
                required:true,
            },
            channelId:{
                required:true,
            },
            baseUrl:{
                required:true,
                type:String
            },
            editAble:{
                type:Boolean,
                default(){
                    return true;
                },
            },
        },
        components: {
            pictureDetail:require('./picture-detail.vue').default,
        }
    }
</script>