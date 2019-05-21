<template>
    <page>
        <search-card  class="mb-xs"
                      :params="searchData"
                      :clears="clears"
                      @search="search"
                      @enter="search">
            <div>
                <label-buttons  class="inline"
                                label="状态："
                                v-sf.status
                                :buttons="buttons"
                                @select="status_select"
                                :default-index="1">
                </label-buttons>
            </div>
            <label-item label="标签名称：" class="mr-sm">
                <el-input v-model="searchData.name"></el-input>
            </label-item>
        </search-card>
    </page>

</template>

<script>
    export default {
        data(){
            return{
                buttons: [
                    { label: "全部"},
                    { label: "已启用"},
                    { label: "已停用"}
                ],
                clears:{
                    name:'',
                    status:1
                },
                searchData:{name:'',status:1}
            }
        },
        methods:{
            search(){
                this.$emit("search",this.searchData);
            },
            status_select(val){
                console.log("选择状态：",val);
                let status=1;
                switch (val) {
                    case 0:
                        status='';
                        break;
                    case 1:
                        status=1;
                        break;
                    case 2:
                        status=0;
                        break;
                }
                if(status || status===0){
                    this.$emit("status-select",status);
                }
                else{
                    this.$emit("status-select");
                }
            }
        },
        props:{
        },
        components:{
            searchCard:require('@/components/search-card').default,
            labelButtons:require('@/components/label-buttons.vue').default,
            labelItem:require('@/components/label-item.vue').default,
        }
    }
</script>

<style scoped>

</style>
