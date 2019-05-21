/**
 * Created by wuchuguang on 16-11-4.
 */


export default {
    name:'gen-cate',
    data(){
        return {
            sub_cate:[]
        }
    },
    props:{
        init:{

        }
    },
    methods:{
        click(cate){
            console.log(`click ${cate}`);

        },
        get_title(cate){
            return cate;
        }
    },
    render(h){
        return (
            <div style={{position:'relative'}}>
                <ul style={{position:'absolute',left:'5px',top:'24px'}}>
                    {this.init.map(cate=>{
                        return (
                            <li style={{padding:'2px'}} on-click={()=>{this.click(cate)}}>{this.get_title(cate)}
                                {this.sub_cate.map(cate=>{

                                })}</li>
                        )
                    })}
                </ul>
            </div>
        )
    }
};