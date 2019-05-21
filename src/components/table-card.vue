<script>
    export default {
        name: "table-card",
        render(h){
            let table = this.$slots.default;
            console.log(table);
            let paging = null;
            if(this.$slots.paging){
                paging = this.$slots.paging;
            }
            if(paging){
            }
            return <div class="table-card">
                {table}{paging}
            </div>
        }
    }
</script>

<style lang="stylus" scoped>
    .table-card{
        >.el-table, >table{

        }
        >.el-pagination{
            height:48px;
        }
    }
</style>
