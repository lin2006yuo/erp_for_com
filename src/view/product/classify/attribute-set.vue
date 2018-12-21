<template>
        <el-row class="c-attribute_set">
            <el-col :span="16">
                <el-button @click.native=""></el-button>
                <group-card :items="items">
                    <grop-item v-for="(item,item_i) in items" :key="item_i" :item="item"></grop-item>
                </group-card>
            </el-col>
            <el-col :span="8"></el-col>
        </el-row>
    </template>
    <style lang="stylus">

    </style>
    <script>

        import groupCard from './group-card.vue';
        export default{
            data(){
                return{
                    items:[]
                }
            },
            components:{
                groupCard
            }
        }
    </script>