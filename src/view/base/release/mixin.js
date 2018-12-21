
export default {
    filters:{
        type(val){
            switch (val){
                case 1:
                    return "primary";
                case 2:
                    return "warning";
                default:
                    return "info";
            }
        },
        stypeName(val){
            switch (val){
                case 1:
                    return "新添";
                case 2:
                    return "修复";
                default:
                    return "改变";
            }
        }
    },
};