<template>
    <search-card class="wish-weight-search_"
        @search="searchx" :params="searchData" >
           <label>重量(g) : </label>
           <label-item label=" " class="mr-md">
                    <el-input  v-model="searchData.weight_s" style="width: 100px;"  type="number" @blur="from_p(1)"  placeholder="起始重量"></el-input>
                    <span> ~ </span>                    
                    <el-input  v-model="searchData.weight_e" style="width:100px"  type="number" @blur="to_p(1)"  placeholder="结尾重量"></el-input>
            </label-item>

            <label class="inline ml-sm">
                <el-select v-model="searchData.s_type" >
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </label>

            <label-item label="" class="mr-md">
                    <el-input  v-model="searchData.s_start" style="width: 100px;"  type="number"  @blur="from_p(2)"  placeholder="起始运费"></el-input>
                    <span> ~ </span>
                    <el-input  v-model="searchData.s_end" style="width:100px"  type="number" @blur="to_p(2)"  placeholder="结尾运费"></el-input>
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
            return {
                searchData: {
                    weight_s: '',
                    weight_e: '',
                    s_type: 1,
                    s_start: '',
                    s_end: '',
                },
                options: [
                    {
                        label: '(普货)平邮运费RMB',
                        value: 1
                    },
                    {
                        label: '(普货)挂号运费RMB',
                        value: 2
                    },
                    {
                        label: '(特性)平邮运费RMB',
                        value: 3
                    },
                    {
                        label: '(特性)挂号运费RMB',
                        value: 4
                    }
                ]
            }
        },
        methods: {
            searchx () {
                this.$emit('search', this.searchData, 1)
            },
            to_p (index) {
                if (index === 1) {
                    if ((this.searchData.weight_s - 0) > (this.searchData.weight_e - 0)) {                     
                       this.$message({type:"warning",message:'输入小于起始值',duration:1500});
                       this.searchData.weight_s = 0
                    }
                } else {
                    if ((this.searchData.s_start - 0) > (this.searchData.s_end - 0)) {                                         
                       this.$message({type:"warning",message:'输入小于起始值',duration:1500});
                       this.searchData.s_start = 0
                    }                    
                }
            },
            from_p (index) {                
                if ( index === 1 && (this.searchData.weight_s - 0) < 0) {
                    this.$message({type:"warning",message:'输入重量不能为负数',duration:1500});
                    this.searchData.weight_s = 0
                } else {
                    if ((this.searchData.s_start - 0) < 0) {
                        this.$message({type:"warning",message:'运费不能为负数',duration:1500});
                        this.searchData.s_start = 0
                    }
                }
            }
        },
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

</style>