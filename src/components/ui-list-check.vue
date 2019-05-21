<template>
    <div class="p-ui-list-check">
        <ul>
                <li v-for="item in option">
                    <p class="parent">
                        <i :class="[item.show?'el-icon-minus':'el-icon-plus']" v-if="item.children" @click="shows(item)"></i>
                        <el-checkbox v-model="item.check" v-else  @change="checks(item)" :disabled="item.disable"></el-checkbox>
                        <span>{{item.label}}</span>
                    </p>
                        <ul  v-if="!!item.children" v-show="item.show" class="child">
                            <li v-for="child in item.children"  class="ml-lg">
                                <el-checkbox v-model="child.check" :disabled="child.disable"  @change="checks(child)">{{child.label}}</el-checkbox>
                            </li>
                        </ul>
                </li>
        </ul>
    </div>
</template>
<style lang="stylus">
.p-ui-list-check{
  box-shadow: 5px 5px 5px #888888;
    padding: 10px;
    display: inline-block;
    border: 1px solid silver;
.parent{
    line-height: 26px;
}
    .child{
        >li{
            line-height: 26px;
        }
    }
    p{
        margin: 0;
    }
}
</style>
<script>

    export default{
        data(){
            return {

            }
        },
        created(){
        },
        mounted(){
        },
        computed: {

        },
        methods: {
            shows(item){
                if( (typeof item.show)==="undefined"){
                  this.$set(item,"show",true)
                    console.log("shows")
                }else {
                    item.show=!item.show
                }
            },
            checks(item){
                if(item.check){
                    let index=this.check_number();
                        if(index>=this.limit){
                            this.all_disabled()
                        }
                }else {
                    this.all_used()
                }
                this.get_id()
            },
            check_number(){
                let index=0;
                this.option.forEach(row=>{
                    if(row.children){
                        row.children.forEach(child=>{
                            if(!!child.check){
                                index++
                            }
                        })
                    }else {
                        if(!!row.check){
                            index++
                        }
                    }
                })
                return index
            },
            all_disabled(){
                this.option.forEach(row=>{
                    if(row.children){
                        row.children.forEach(child=>{
                            if(!child.check){
                                child.disable=true
                            }
                        })
                    }else {
                        if(!row.check){
                            row.disable=true
                        }
                    }
                })
            },
            all_used(){
                this.option.forEach(row=>{
                    if(row.children){
                        row.children.forEach(child=>{
                                child.disable=false
                        })
                    }else {
                            row.disable=false
                    }
                })
            },
            get_id(){
                let data=[];
                this.option.forEach(row=>{
                    if(row.children){
                        row.children.forEach(child=>{
                            if(child.check){
                                data.push(child.value)
                            }
                        })
                    }else {
                        if(row.check){
                            data.push(row.value)
                        }
                    }
                });
                this.$emit("get",data)
            }
        },
        filters: {},
        watch: {},
        props: {
            option:{
                type:Array,
                required:true
            },
            limit:{
                type:Number,
                default:3,
            },
        },
        components: {}
    }
</script>