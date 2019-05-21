<template>
    <el-row class="p-page-editor">
        <div class="editor">
            <ul>
                <li v-for="row in rows">
                    <row :row="row"></row>
                </li>
                <li>
                    <el-button @click.native="add">+++</el-button>
                </li>
            </ul>
        </div>
        <el-dialog title="" v-model="showRowDialog"></el-dialog>
    </el-row>
</template>
<style lang="stylus">
    .p-page-editor{
        clear: both;
        width:100%;
        height:100%;
        .editor{
            width:100%;
            height:100%;
            ul{
                width:100%;
                height:100%;
            }
        }
    }
</style>
<script>

    import row from './row.js';
    export default{
    	  page:{},
        data(){
            return{
                rows:[],
                showRowDialog:false
            }
        },
        methods:{
            add(){

            }
        },
        components:{
            row
        }
    }
</script>
