
export default {
    data(){
        return {

        }
    },
    props:{
        headers:{

        },
        datas:{

        },
        options:{

        }
    },
    render(h){
        let headerRow = 1;
        let headers = this.headers.map(header =>{
            header
        });
        return (
            <table>
                {headers}
            </table>
        )
    }
}