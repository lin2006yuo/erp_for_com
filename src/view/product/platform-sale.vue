<template>
    <div class="c-platform-sale">
        <el-row>
            <ul class="platform-box">
                <el-col :span="colNumber" v-for="(item,index) in platformData" :key="index">
                    <li class="title-li">{{item.name}}</li>
                    <li>
                        <el-select v-model="item.value_id"
                                   @change="change_sale(item,$event)"
                                   v-if="editAble"
                                   default-first-option filterable>
                            <el-option
                                v-for="res in plat"
                                :label="res.name"
                                :value="res.id"
                                :key="res.id"
                            ></el-option>   
                        </el-select>
                        <span v-else>{{item.value}}</span>
                    </li>
                </el-col>
            </ul>
        </el-row>
    </div>
</template>
<style lang="stylus">
    .platform-box{
        overflow:hidden;
        text-align:center;
        border-left:1px solid #ddd;
        border-top:1px solid #ddd;
        li{
            border-right:1px solid #ddd;
            border-bottom:1px solid #ddd;
            padding-left:8px;
            padding-right:8px;
            &.title-li{
                background-color:#EFF2F7;
            }
        }
    }
</style>
<script>
    export default {
        data() {
            return {

            }
        },
        methods:{
            change_sale(item,val){
                let find = this.plat.find(res=>res.id===val);
                if(!!find) item.value = find.name;
            },
        },
        props:{
            platformData:{},
            plat:{},
            colNumber:{
                default(){
                    return 4
                }
            },
            editAble:{
                default(){
                    return true
                }
            },
        },
        components: {}
    }
</script>
