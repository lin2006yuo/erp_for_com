export default {
    refresh(){
        this.$refs.search_module.init();
    },
    data() {
        return {
            searchData:{},
            visible:false,
            hasData:true,
        }
    },
    methods: {
        init_data(searchData){
            this.searchData = searchData;
            this.$nextTick(()=>{
                this.$refs.table_module.init();
            });
        },
        exports(){
            this.$refs.table_module.exports();
        },
        exports_result(flag){
            this.visible = flag;
        },
        canExport(flag){
            this.hasData = flag;
        },
        toFixed2(val) {
            return Number(val).toFixed(2);
        },
        handle_number(val) {
            return Number(val).toFixed(4);
        }
    },
    computed: {
        is_salesman(){
            return this.searchData.report_type === 'seller';
        },
        is_overwarehouse(){
            return this.searchData.report_type === 'overseas';
        }
    }
}
