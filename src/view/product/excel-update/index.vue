<template>
    <page>
      <el-button size="mini" type="primary" @click="excelVisible=true">Excel导入</el-button>
      <excel-updata v-model="excelVisible" @update-error="update_error"></excel-updata>
      <div>
        <p style="color: #ff4d51" v-for="item in errText">{{item}}</p>
      </div>
    </page>
</template>

<style lang="stylus">

</style>
<script>

    export default{
        page: {},
        refresh(){
            this.searchData = {};
            this.init();
        },
        data(){
            return {
              excelVisible:false,
              errText:[]
            }
        },
        created(){

        },
        filters: {},
        mounted(){

        },
        updated(){

        },
        destroy(){

        },
        methods: {
            init(){

            },
          update_error(val){
                console.log(val)
             this.errText = val;
          }
        },
        computed: {},
        watch: {},
        props: {},
        components: {
          excelUpdata:require('./import-excel.vue').default
        }
    }
</script>

