<style lang="stylus">
    .page{
        width:100%;
        height:100%;
        padding:5px 10px 5px 10px;
        box-sizing: border-box;
        overflow :hidden;
    }
    .fadeInRight{
        animation: fadeInRight 0.55s cubic-bezier(0.455, 0.03, 0.515, 0.955);
    }
    @keyframes fadeInRight {
        0% {
            -webkit-transform: translate3d(400px, 0, 0);
            transform: translate3d(400px, 0, 0);
            opacity: 0; }
        100% {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
            opacity: 1; } }
</style>
<script>
    export default{
        functional:true,
        components:{
        },
        render(createElement, context){
            let data = context.data;
            let staticClass = data.staticClass || "";
            staticClass = `${staticClass} page`;
            Object.assign(data, {staticClass:staticClass})
            return createElement('div', data, context.children)
        }
    }
</script>