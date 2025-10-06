/**
 * Apps Component
 * --------------
 * Displays a list of applications fetched from the backend.
 * - Redirects to /login if not authenticated.
 * - Shows a table of apps with details and links to each app's detail page.
 * - Provides a button to add a new app.
 *
 * Dependencies:
 * - React Router (Link, useNavigate)
 * - AuthContext (for JWT token)
 * - Bootstrap and Bootstrap Icons for styling
 *
 * @component
 */

import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { NavBar } from "./NavBar";
// Uncomment the following line if ArrayFieldRenderer is needed
// import { ArrayFieldRenderer } from "../utils/ArrayHandler";
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
    /**
     * Finds the index of a release option by its ID.
     * @param {string} id - The release option ID.
     * @returns {number} The index in the releaseOptions array.
     */

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
        /**
         * Fetches the list of apps from the backend API.
         * Uses the JWT token for authorization.
         * On success, updates the apps state with the fetched data.
         * On failure, logs the error to the console.
         */
    // Helper to transform fields: join arrays to strings, leave others as-is
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

// ...existing code...

// ...existing code...

        fetch(`${process.env.REACT_APP_BACKEND_URL}/apps`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    // data is an array of app rows; filter to display only certain columns
                    setApps(data);
                    console.log("Apps with all the fields: ", data);
                } else {
                    console.log('Unexpected data format (expected array of apps):', data);
                    setApps([]);  // Fallback
                }
            })
            .catch(err => {
                console.log(err);
                setApps([]);
            });
    }, [jwtToken, navigate]);
    return (
        <>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"></link>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"></link>

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
                        {apps?.map?.((m) => (
                            <tr key={m.id}>
                                <td>
                                    <Link to={`/thisapp/${m.id}`}>
                                        {m.name}
                                    </Link>
                                </td>
                                <td>
                                    {(() => {
                                        const index = getIndex(m.release);
                                        return index !== -1 ? releaseOptions[index].value : m.release;
                                    })()}
                                </td>
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