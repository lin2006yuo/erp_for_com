
<script>
    export default {
        name: "ui-title",
        functional:true,
        render(createElement, context) {
            const props = context.props || {};
            if(props.filter){

            }
            return createElement('span',{title:context.children}, context.children);
        }
    }
</script>
