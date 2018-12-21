/**
 * Created by wuchuguang on 16-11-4.
 */


export default {
    props:{
        row:{

        }
    },
    render(h){
        return (
            <div>
                {this.row.columns.map(col=>{
                    <span style={{height:'32px',width:'30%'}}></span>
                })}
            </div>
        )
    }
};