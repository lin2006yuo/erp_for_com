/**
 * Created by wuchuguang on 16-10-28.
 */

export default {
    props:{
        header:{},
        tree:{}
    },

    components:{
        draggable:require('./drag-drop')
    },

    render(h){
        let list = [];
        function gen(tree) {
            return tree.map(node=>{
                list.push(node.name);
                let trees = '';
                if(node.tree && node.tree.length > 0){
                    trees = gen(node.tree)
                }
                return (
                    <tr>
                        <td>{node.name}</td>
                        <td><i>iiiii</i></td>
                    </tr>
                )
            })
        }
        return (
            <table>
                <tr>
                    {this.header.map(head=>{
                        return <th>{head}</th>
                    })}
                </tr>
                <draggable list={list}>
                    {gen(this.tree)}
                </draggable>
            </table>
        )

    }
};
