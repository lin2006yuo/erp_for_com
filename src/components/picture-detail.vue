<template>
    <div class="picture-detail2">
        <div class="inline"
              v-for="items in list"
              :key="items.is_default">
            <product-details-group :character="items.name"
                                   :item-data ='items.data'
                                   :base-url="baseUrl"
                                   @establish-pic="establish_pic"
                                   @remove="remove"
                                   :showBig="true"
                                   :edit-able="editAble"
                                   :cur-default="items.is_default"></product-details-group>
        </div>
    </div>
</template>
<style lang="stylus">
</style>
<script>
    export default {
        data() {
            return {
                tempImg:{},
                isAdd:false,
                imgPath:"",
                imgDialog:false,
                imgTitle:"",
                list:[],
                defaultId:[
                    {name:'添加主图',is_default:1},
                    {name:'添加细节图',is_default:2},
                    {name:'添加附属图',is_default:4},
                ]
            }
        },
        mounted(){
            this.get_data();
        },
        methods:{
            establish_pic(item){
                let find=this.imgs.find(row=>item.id===row.id);
                if(!!find) find.is_default=item.is_default;
                this.get_data();
            },
            remove(item){
                let index=this.imgs.findIndex(row=>item.id===row.id);
                if(index>-1){
                    this.imgs.splice(index,1);
                }
                this.get_data();
            },
            get_data(){
                this.list = [];
                this.defaultId.forEach(row=>{
                    let data = this.imgs.filter(res=>res.is_default===row.is_default);
                    if(data.length>0){
                        let cur = {
                            name:row.name,
                            is_default:row.is_default,
                            data,
                        };
                        this.list.push(cur);
                    }
                });
            }
        },
        watch:{
            baseUrl(val){
                console.log(val,'baseUrl');
            },
        },
        props:{
            imgs:{
                required:true,
                type:Array
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
            dragDrop:require("../components/drag-drop"),
            blowupImage:require("../components/blowup-image.vue").default,
            productDetailsGroup:require('./product-details-group.vue').default,
        }
    }
</script>