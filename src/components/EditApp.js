import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "./form/Input";
import { Select } from "./form/Select";
import { TextArea } from "./form/TextArea";
import Swal from "sweetalert2";
import { useHandleDelete } from "../utils/HandleDel";
import { useAuth } from "../context/AuthContext";
import "../style/Edit.css";
import { formatUnixTimestamp } from "../utils/Unix2Ymd";
import { NavBar } from "./NavBar";

const EditApp = () => {
    const { jwtToken, sessionChecked } = useAuth();

    const navigate = useNavigate();
    const { id } = useParams();
    const appId = parseInt(id || "0", 10);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({}); // Initialize as an empty object
    const [thisapp, setThisapp] = useState({
        id: 0,
        name: "",
        release: "",
        path: "",
        init: "",
        web: "",
        title: "",
        created: "",
        updated: "",
    });

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

    useEffect(() => {
        if (!sessionChecked) return; // Wait for session check to complete
        if (!jwtToken) {
            Swal.fire({
                title: 'Token Invalid',
                text: 'Your token is invalid. Please log in again.',
                icon: 'warning',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate("/login");
            });
            return; // Prevent further execution if token is invalid
        }

        const fetchData = async () => {
            if (!sessionChecked) return; // Wait for session check to complete
            if (!jwtToken) {
                Swal.fire({
                    title: 'Token Invalid',
                    text: 'Your token is invalid. Please log in again.',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate("/login");
                });
                return; // Prevent further execution if token is invalid
            }

            try {
                if (appId !== 0) { // Only fetch if it's an existing app
                    const headers = new Headers({
                        "Content-type": "application/json",
                        "Authorization": "Bearer " + jwtToken,
                    });
                    const requestOptions = {
                        method: "GET",
                        headers: headers,
                    };

                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/apps/${appId}`, requestOptions); // Use appId here
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();
                    setThisapp(data); // Assuming the backend returns the app data directly
                } else {
                    // Initialize for a new app
                    setThisapp({
                        id: 0,
                        name: "",
                        release: "",
                        path: "",
                        init: "",
                        web: "",
                        title: "",
                        created: "",
                        updated: "",
                    });
                }
            } catch (err) {
                console.error("Error fetching app data:", err);
                setError(err.message || "Error fetching app data");
            }
        };

        fetchData();
    }, [appId, navigate, jwtToken, sessionChecked]);

    const validateForm = () => {
        const newErrors = {};

        if (!thisapp.name) newErrors.name = "Name is required";
        if (!thisapp.path) newErrors.path = "Path is required";
        if (!thisapp.init) newErrors.init = "Init is required";
        if (!thisapp.web) newErrors.web = "Web is required";
        if (!thisapp.title) newErrors.title = "Title is required";
        if (!thisapp.release) newErrors.release = "Release is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission

        if (!sessionChecked) {
            Swal.fire({
                title: 'Session is not valid now',
                text: 'Probably, your session expires. Please, log in again.',
                icon: 'warning',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate("/login");
            });

            return; // Wait for session check to complete
        }
        if (!jwtToken) {
            Swal.fire({
                title: 'Token is not valid now',
                text: 'Probably, your token expires. Please, log in again.',
                icon: 'warning',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate("/login");
            });
            return; // Prevent further execution if token is invalid
        }

        if (!validateForm()) {
            Swal.fire({
                title: 'Invalid form',
                text: JSON.stringify(errors) + ' Please correct the errors in the form.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        const now = Math.floor(Date.now() / 1000);
        const isNewApp = thisapp.id === 0;

        const appData = {
            ...thisapp,
            updated: now,
            ...(isNewApp ? { created: now } : {}), // Conditionally add 'created'
        };

        try {
            const headers = new Headers({
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            });
            const method = isNewApp ? "POST" : "PATCH"; // Use POST for creating new apps, PATCH for updating
            const url = `${process.env.REACT_APP_BACKEND_URL}/admin/apps/${isNewApp ? '0' : thisapp.id}`; // Adjust URL for create/update

            const requestOptions = {
                method: method,
                headers: headers,
                body: JSON.stringify(appData)
            };

            const response = await fetch(url, requestOptions);

            if (response.status === 401) {
                Swal.fire({
                    title: 'Session Expired',
                    text: 'Your session has expired. Please log in again.',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate("/login");
                });
                return; // Stop further execution
            }

            const data = await response.json();

            if (!response.ok) {
                // Handle other server-side validation errors or issues
                console.error("Server error:", data);
                Swal.fire({
                    title: 'Server Error',
                    text: data.message || 'An error occurred while saving.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                return;
            }
            // On successful save
            Swal.fire({
                title: 'Success!',
                text: 'App saved successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate(`/editapp/${thisapp.id}`); // Navigate to the details page
            });


        } catch (error) {
            console.error("Error saving app:", error);
            Swal.fire({
                title: 'Error!',
                text: 'An unexpected error occurred.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setThisapp((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDelete = useHandleDelete(thisapp.id, jwtToken);

    const dismissAlert = () => {
        setError(null);
    };

    if (error) {
        Swal.fire({
            title: 'Error!',
            text: 'General Error in app edition',
            icon: 'error',
            confirmButtonText: 'OK',
        });
    }

    return (
        <>
            <NavBar />
            <div className="edit-container">
                <form className="edit-app-form" onSubmit={handleSubmit}>
                    <h2>{appId === 0 ? 'Add App' : 'Edit App'}</h2>
                    <hr />
                    <input type="hidden" name="id" value={thisapp.id} readOnly />
                    <div className="form-group">
                        <label htmlFor="appName">App Name</label>
                        <Input
                            id={"appName"}
                            className={"form-control"}
                            type={"text"}
                            name={"name"}
                            placeholder="Enter app name"
                            value={thisapp.name}
                            onChange={handleChange}
                            errorMsg={errors.name}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="appRelease">App Release</label>
                        <Select
                            id={"appRelease"}
                            name={"release"}
                            className={"form-select"}
                            options={releaseOptions}
                            value={thisapp.release}
                            onChange={handleChange}
                            errorMsg={errors.release}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="appPath">App Path</label>
                        <Input
                            id={"appPath"}
                            className={"form-control"}
                            type={"text"}
                            name={"path"}
                            placeholder="Enter app path"
                            value={thisapp.path}
                            onChange={handleChange}
                            errorMsg={errors.path}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="appInit">App Init</label>
                        <Input
                            id={"appInit"}
                            className={"form-control"}
                            type={"text"}
                            name={"init"}
                            placeholder="Enter app init"
                            value={thisapp.init}
                            onChange={handleChange}
                            errorMsg={errors.init}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="appWeb">App Web</label>
                        <Input
                            id={"appWeb"}
                            className={"form-control"}
                            type={"text"}
                            name={"web"}
                            placeholder="Enter app web"
                            value={thisapp.web}
                            onChange={handleChange}
                            errorMsg={errors.web}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="appTitle">App Title</label>
                        <TextArea
                            id={"appTitle"}
                            name={"title"}
                            className={"form-control"}
                            type={"textarea"}
                            placeholder="Enter app title"
                            value={thisapp.title}
                            onChange={handleChange}
                            errorMsg={errors.title}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="appCreated">App Created</label>
                        <Input
                            id={"appCreated"}
                            className={"form-control"}
                            type={"text"}
                            name={"created"}
                            placeholder="Created is auto-generated"
                            value={
                                thisapp.created
                                    ? formatUnixTimestamp(thisapp.created)
                                    : "Not yet created"
                            }
                            readOnly={true}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="appUpdated">App Updated</label>
                        <Input
                            id={"appUpdated"}
                            className={"form-control"}
                            type={"text"}
                            name={"updated"}
                            placeholder="Updated is auto-generated"
                            value={
                                thisapp.updated
                                    ? formatUnixTimestamp(thisapp.updated)
                                    : "Not yet updated"
                            }
                            readOnly={true}
                        />
                    </div>
                    <hr />
                    <div className="form-action">
                        <button className="btn btn-primary" type="submit">save</button>
                        {thisapp.id > 0 && (
                            <button type="button" className="btn btn-danger ms-2" onClick={handleDelete}>
                                Delete App
                            </button>

                        )}
                    </div>

                    <div className="form-alert hidden" id="formAlert">
                        <p>Error! Please check your inputs.</p>
                        <button onClick={dismissAlert}>OK</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export { EditApp };