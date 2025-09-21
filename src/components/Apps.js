import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { NavBar } from "./NavBar";
// import "../style/Read.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

const Apps = () => {
    const { jwtToken } = useAuth();

    const [apps, setApps] = useState([]);
    const navigate = useNavigate();

    const releaseOptions = [
        { id: "A", value: "1.0.0" },
        { id: "B", value: "1.0.1" },
        { id: "C", value: "1.0.2" },
        { id: "D", value: "1.1.0" },
        { id: "E", value: "1.2.0" },
        { id: "F", value: "2" },
        { id: "G", value: "3.0.1" },
        { id: "H", value: "4.1.0" },
    ];

    function getIndex(id) {
        try {
            return releaseOptions.findIndex(o => o.id === id);
        }
        catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (jwtToken === "") {
            navigate("/login");
            return
        }
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`${process.env.REACT_APP_BACKEND_URL}/apps`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setApps(data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [jwtToken, navigate]);

    return (
        <>
            <NavBar />
            <div className="list-container">
                <h2 style={{ display: "block", textAlign: "center" }}>
                    Apps List
                </h2>
                <Link
                    to="/editapp/0"
                    className="list-group-item list-group-item-action"
                >
                    <h3>
                        <i className="bi bi-plus-circle" style={{ marginRight: 8 }}></i>
                        Add App
                    </h3>
                </Link>
                <hr />
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Release</th>
                            <th>Path</th>
                            <th>Init</th>
                            <th>Web</th>
                            <th>Title</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apps.map((m) => (
                            <tr key={m.id}>
                                <td>
                                    <Link to={`/thisapp/${m.id}`}>
                                        {m.name}
                                    </Link>
                                </td>
                                <td>{m.release ? releaseOptions[getIndex(m.release)].value : m.release}</td>
                                <td>{m.path}</td>
                                <td>{m.init}</td>
                                <td>{m.web}</td>
                                <td>{m.title}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
export { Apps };