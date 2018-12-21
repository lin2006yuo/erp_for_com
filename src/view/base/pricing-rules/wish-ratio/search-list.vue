<template>
    <search-card class="wish-weight-search_"
        @search="search" :params="searchData" >

        <label-item label="目的地：" class="ml-sm">
            <el-select v-sf.customer_id filterable v-model="searchData.local"
                    class="s-width-default"
                    clearable>
                <el-option v-for="item in placeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </label-item>

        <label-item label="物流方式：" class="ml-sm">
            <el-select v-sf.customer_id  v-model="searchData.logistics"
                    class="s-width-large-plu"
                    clearable>
                <el-option v-for="item in logisticsList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </label-item>
    
    </search-card>
</template>

<script>
    import searchCard from "@/components/search-card";
    import labelItem from '@/components/label-item'
    export default {
        name: "search-list",
        components: {
            searchCard,
            labelItem
        },
        data () {
            return {}
        },
        methods: {
          search() {
              this.$emit("search")
          } 
        },
        props: {
            placeList: {
                type: Array,
                require: true
            },
            logisticsList: {
                type: Array,
                require: true
            },
            searchData: {
                type: Object,
                require: true
            }
        }
    }
</script>

<style lang='stylus'>
.wish-weight-search_{
    .el-input{
        display inline-block
    }
    .inline{
        vertical-align: top!important
    }
}
.s-width-large-plu{
    width 450px
    .el-input{
        width 450px!important
    }
}

</style>