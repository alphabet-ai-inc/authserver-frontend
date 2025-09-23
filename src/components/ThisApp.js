import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatUnixTimestamp } from "../utils/Unix2Ymd";
import { useHandleDelete } from "../utils/HandleDel";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { NavBar } from "./NavBar";

/**
 * 
 * @returns {JSX.Element} ThisApp component displaying details of a specific app.
 * Fetches app data from the backend using the app ID from URL parameters.
 * Displays app details and provides options to edit or delete the app.
 * Handles session validation and redirects to login if the JWT token is invalid.
 */
const ThisApp = () => {
    const {
        jwtToken,
        sessionChecked,
        setJwtToken,
    } = useAuth();
    let { id } = useParams();

    const navigate = useNavigate();
    const [alertClassName, setAlertClassName] = useState("d-none");
    const [alertMessage, setAlertMessage] = useState("");
    const [ThisApp, setThisApp] = useState({}); // <-- Add this line

    /**
     * List of release options for the app.
     * Each option has an ID and a corresponding version value.
     * This is used to display the release version based on the app's release ID.
     * Future improvements could include fetching this list from the backend.
     */
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
/**
 * Effect to fetch app details when the component mounts or when the ID or JWT token changes.
 * Validates the JWT token and redirects to login if invalid.
 * Updates the component state with the fetched app data.
 * In the future, user validation, checking session expiration, and handling token refresh could be more robust.
 * @dependency id - The app ID from URL parameters.
 * @dependency jwtToken - The JWT token for authentication.
 */
    useEffect(() => {

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
                    setThisApp(data);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }, [id, jwtToken, sessionChecked, navigate, setJwtToken]);

    return (
        <>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"></link>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"></link>

            <NavBar />
            <div className="card mb-3 shadow-sm ">
                <div className="card-body">
                    <div className={`alert ${alertClassName}`} role="alert">
                        {alertMessage}
                    </div>

                    <h5 className="card-title">
                        <i className="bi bi-box-seam me-2"></i> {ThisApp.title}
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                        <i className="bi bi-tag-fill me-1"></i> Release: {
                            (() => {
                                const idx = getIndex(ThisApp.release);
                                return idx !== -1 && releaseOptions[idx]
                                    ? releaseOptions[idx].value
                                    : ThisApp.release || '';
                            })()
                        }
                    </h6>
                    <p className="card-text">
                        <i className="bi bi-file-earmark-text me-1"></i><strong>Name: </strong>{ThisApp.name}<br />
                        <i className="bi bi-hash me-1"></i><strong>ID: </strong>{ThisApp.id}<br />
                        <i className="bi bi-calendar-plus me-1"></i><strong>Created: </strong>{formatUnixTimestamp(ThisApp.created)}<br />
                        <i className="bi bi-calendar-check me-1"></i><strong>Updated: </strong>{formatUnixTimestamp(ThisApp.updated)}<br />
                        <i className="bi bi-file-earmark-code me-1"></i><strong>Init: </strong>{ThisApp.init}<br />
                        <i className="bi bi-folder2-open me-1"></i><strong>Path: </strong>{ThisApp.path}<br />
                        <i className="bi bi-globe me-1"></i><strong>Web: </strong>{ThisApp.web}
                    </p>
                    <div className="d-flex gap-2">
                        <button className="btn btn-primary" onClick={handleClick("edit")}>
                            <i className="bi bi-pencil-square me-1" style={{ marginRight: 8 }}></i>
                            Edit App
                        </button>
                        {ThisApp.id > 0 &&
                            <a href="#!" className="btn btn-danger" onClick={handleClick("delete")}>
                                <i className="bi bi-trash me-1" style={{ marginRight: 8 }}></i>
                                Delete App
                            </a>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}
export { ThisApp };