import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatUnixTimestamp } from "../utils/Unix2Ymd";
import "../style/Read.css"
import { useHandleDelete } from "../utils/HandleDel";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { NavBar } from "./NavBar";

const Thisapp = () => {
    const { 
        jwtToken, 
        sessionChecked,
        setJwtToken, 
    } = useAuth();
    let { id } = useParams();

    const navigate = useNavigate();
    const [alertClassName, setAlertClassName] = useState("d-none");
    const [alertMessage, setAlertMessage] = useState("");
    const [thisapp, setThisapp] = useState({}); // <-- Add this line

    const handleEdit = () => {
        navigate(`/editapp/${id}`);
    };

    const handleDelete = useHandleDelete(id);

    const handleClick = (action) => () => {
        if (action === "edit") {
            handleEdit();
        }
        if (action === "delete") {
            handleDelete(); // Call the function returned by the hook
        }
    };

    useEffect(() => {
    // if (!sessionChecked) return; // Wait for session check to complete

    if (!jwtToken) {
        Swal.fire({
            title: 'Token Invalid',
            text: 'Your token is invalid. Please log in again.',
            icon: 'warning',
            confirmButtonText: 'OK'
        }).then(() => {
            setJwtToken(null);
            navigate("/login");
        });
        return;
    }
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`${process.env.REACT_APP_BACKEND_URL}/apps/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setAlertClassName("alert-danger");
                    setAlertMessage(data.message);
                } else {
                    setThisapp(data);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }, [id, jwtToken, sessionChecked, navigate, setJwtToken]);

    return (
        <>
        <NavBar />  
        <div className="app-container">
            <div className={`alert ${alertClassName}`} role="alert">
                {alertMessage}
            </div>

            <h2 className="title">Thisapp: {thisapp.title}</h2>
            <div className="info-list">
                <small><em>ID: {thisapp.id}</em></small>
                <small><em>Created: {formatUnixTimestamp(thisapp.created)}</em></small>
                <small><em>Name: {thisapp.name}</em></small>
                <small><em>Init: {thisapp.init}</em></small>
                <small><em>Path: {thisapp.path}</em></small>
                <small><em>Release: {thisapp.release}</em></small>
                <small><em>Updated: {formatUnixTimestamp(thisapp.updated)}</em></small>
                <small className="web-info"><em>{thisapp.web}</em></small>

                <button className="btn btn-primary" onClick={handleClick("edit")}>
                    Edit App
                </button>

                {thisapp.id > 0 &&
                    <a href="#!" className="btn btn-danger ms-2" onClick={handleClick("delete")}>Delete App</a>
                }
            </div>
        </div>
        </>
    );
}

export { Thisapp };