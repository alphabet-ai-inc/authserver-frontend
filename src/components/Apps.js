import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from 'react-router-dom';

const Apps = () => {
    const [apps, setApps] = useState([]);
    const { jwtToken } = useOutletContext();
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

    useEffect( () => {
        if (jwtToken === "") {
            navigate("/login");
            return
        }
        const headers= new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`${process.env.REACT_APP_BACKEND}/apps`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setApps(data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [jwtToken, navigate]);

    return (
        <div>
            <h2>Apps</h2>
            <Link
                to="/admin/thisapp/0"
                className="list-group-item list-group-item-action"
            >
            <h3> 
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
    )
}
export default Apps;