/**
 * Created by wuchuguang on 17-1-13.
 */


export default {
    data(){
        return {};
    },
    props:{
        categories:{
            required:true,
            type:Object
        },
        label:{

        }
    },
    render(h){
        let label = (() =>{
            if(this.label){
                return <label>{this.label}</label>
            }
        })();
        let trees = [];
        let gen = (Class, layout) =>{
            return <ul>
                <li>{Class.title}</li>
            </ul>;
        };
        let gens = (Classes, layout) =>{
            return Classes.map(ClassID=>{
                let Class = this.categories[ClassID];
                return gen(Class, layout);
            });
        };

        trees = gens(this.categories.child_ids || [], 0);
        return (
            <div class="tree-categories">
                {label}
                {trees}
            </div>
        )
    }
};
