import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext} from "react-router-dom";

const Thisapp = () => {
    const [thisapp, setThisapp] = useState({});
    const { jwtToken } = useOutletContext();
    const navigate = useNavigate();

    let { id } = useParams();

    useEffect( () => {
        if (jwtToken === "") {
            navigate("/login");
            return
        }

        const headers = new Headers();
        headers.append("Content-Type", "aplication/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers, 
        }

        fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/apps/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setThisapp(data);
            })
            .catch(err => {
                console.log(err);
            })
        }, [id, jwtToken, navigate]);
        console.log("no pasa por aquí");
    return(
        <div>
            <h2>Thisapp: {thisapp.title}</h2>
            <small><em>{thisapp.name}, {thisapp.release}, {thisapp.init}</em></small>
            <hr />
            <p>{thisapp.updated}, {thisapp.web}</p>
        </div>
    )
}
export default Thisapp;