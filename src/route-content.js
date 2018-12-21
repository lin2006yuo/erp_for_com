/**
 * Created by wuchuguang on 16-11-14.
 */

export default {
    props:{
        page:{
            required:true,
            type:Object
        }
    },
    created(){},
    update(){
        console.log();
    },
    render(h){
        return <component is={this.page.component}></component>
    }
};
