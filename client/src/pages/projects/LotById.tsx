import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import {getLotByID} from "../../services/lots.services.ts";
import {Layout} from "../Layout.tsx";

export function LotById(){
    const { id } = useParams();
    const navigate = useNavigate()
    useEffect(() => {
            if(id === undefined) return navigate('/lotes')
            getLotByID(id).then((res) => {
                if (typeof res === "string") return navigate('/404')
                console.log(res)
            });
    }, [id]);
    return (
        <Layout title={"Lote"}>
            <div>
                <h1>Lote</h1>
            </div>
        </Layout>
    )
}