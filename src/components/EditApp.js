import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "./form/Input";
import { Select } from "./form/Select";
import { TextArea } from "./form/TextArea";
import Swal from "sweetalert2";
import { useHandleDelete } from "../utils/HandleDel";
import { useAuth } from "../context/AuthContext";
import { formatUnixTimestamp } from "../utils/Unix2Ymd";
import { NavBar } from "./NavBar";
import { useMemo } from "react";

/**
 * EditApp displays a form to edit or create an application.
 * It fetches app data if editing an existing app and handles form submission.
 * It also includes validation and error handling.
 * It uses Bootstrap for styling and SweetAlert2 for alerts.
 * It creates a new app if the id param is 0. In this case it is not necessary to fetch data from the backend.
 *
 * @component
 * @returns
 */


const EditApp = () => {

    const { jwtToken, sessionChecked } = useAuth();

    const navigate = useNavigate();
    const { id } = useParams();
    const appId = parseInt(id || "0", 10);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({}); // Initialize as an empty object
    // const [thisapp, setThisapp] = useState({
    //     id: 0,
    //     name: "",
    //     release: "",
    //     path: "",
    //     init: "",
    //     web: "",
    //     title: "",
    //     created: "",
    //     updated: "",
    // });
    /**
 * App model defining all possible fields. Used for initializing new apps and ensuring consistency.
 * Fields not used in the form can be included for future expansion or backend compatibility.
 */

/**
 * Options for the release select dropdown. Perhaps these should be fetched from the backend in the future.
 */
    const appModel = useMemo(() => ({
        id: 0,
        name: "",
        release: "",
        path: "",
        init: "",
        web: "",
        title: "",
        created: 0,
        updated: 0,
        description: "",
        positioningStmt: "",
        logo: "",
        category: "",
        platform: [],
        developer: "",
        licenseType: "",
        size: 0,
        compatibility: [],
        integrationCapabilities: [],
        developmentStack: [],
        apiDocumentation: "",
        securityFeatures: [],
        regulatoryCompliance: [],
        revenueStreams: [],
        customerSegments: [],
        channels: [],
        valueProposition: "",
        pricingTiers: [],
        partnerships: [],
        costStructure: [],
        customerRelationships: [],
        unfairAdvantage: "",
        roadmap: "",
        versionControl: "",
        errorRate: 0,
        averageResponseTime: 0,
        uptimePercentage: 0,
        keyActivities: [],
        activeUsers: 0,
        userRetentionRate: 0,
        userAcquisitionCost: 0,
        churnRate: 0,
        monthlyRecurringRevenue: 0,
        userFeedback: [],
        backupRecoveryOptions: [],
        localizationSupport: [],
        accessibilityFeatures: [],
        teamStructure: [],
        dataBackupLocation: "",
        environmentalImpact: "",
        socialImpact: "",
        intellectualProperty: [],
        fundingsInvestment: 0,
        exitStrategy: "",
        analyticsTools: [],
        keyMetrics: [],
        url: "",
        landingPage: "",
    }), []);
    const [thisapp, setThisapp] = useState({ ...appModel });

    // const releaseOptions = [
    //     { id: "A", value: "1.0.0" },
    //     { id: "B", value: "1.0.1" },
    //     { id: "C", value: "1.0.2" },
    //     { id: "D", value: "1.1.0" },
    //     { id: "E", value: "1.2.0" },
    //     { id: "F", value: "2" },
    //     { id: "G", value: "3.0.1" },
    //     { id: "H", value: "4.1.0" },
    // ];

    const [releaseOptions, setReleaseOptions] = useState([]);
    // In useEffect, add a fetch for options
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/releases`, { headers: { Authorization: `Bearer ${jwtToken}` } })
            .then(res => res.json())
            .then(data => setReleaseOptions(data));  // Assuming backend returns [{ id: "1.0.0", value: "1.0.0" }, ...]

    }, [jwtToken]);

 /**
 * Fetches app data when editing an existing app (appId !== 0).
 * Initializes form for creating a new app if appId is 0.
 * Validates session and token before fetching.
 * Displays alerts and navigates to login if session or token is invalid.
 */
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
                    setThisapp({ ...appModel });
                }
            } catch (err) {
                console.error("Error fetching app data:", err);
                setError(err.message || "Error fetching app data");
            }
        };

        fetchData();
    }, [appId, navigate, jwtToken, sessionChecked, appModel]);

    /**
     *
     * @returns {boolean} True if the form is valid, false otherwise.
     * This function checks that all required fields are filled.
     * In the future, more complex validation rules can be added here.
     */
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

    if (error) {
        Swal.fire({
            title: 'Error!',
            text: 'General Error in app edition',
            icon: 'error',
            confirmButtonText: 'OK',
        });
    }

    /**
     * the form is only shown when the session is checked and valid
     * and the token is valid. Otherwise, the user is redirected to login.
     * If the appId is 0, the form is shown for creating a new app.
     * It uses form components from the form folder.
     * Props are passed down to the form components as needed.
     * It is necessary that the form components show all the props passed to them. If not, the form component will not work properly.
     * ie it is possible to have an Input here without placeholder, but the Input component must have a placeholder prop (even if empty) to avoid React warnings.
    */
    return (
        <>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"></link>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"></link>

            <NavBar />
            <div className="container py-4">
                <h2 className="mb-4"><i className="bi bi-pencil-square me-2"></i>{appId === 0 ? 'Add App' : 'Edit App'}</h2>
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="id" value={thisapp.id} readOnly />
                    <Input
                        label={"App Name"}
                        id={"appName"}
                        className={"form-control"}
                        type={"text"}
                        name={"name"}
                        placeholder="Enter app name"
                        value={thisapp.name}
                        onChange={handleChange}
                        errorMsg={errors.name}
                    />
                    <Select
                        label={"App Release"}
                        id={"appRelease"}
                        name={"release"}
                        className={"form-select"}
                        options={releaseOptions}
                        value={thisapp.release}
                        onChange={handleChange}
                        errorMsg={errors.release}
                    />
                    <Input
                        label={"App Path"}
                        id={"appPath"}
                        className={"form-control"}
                        type={"text"}
                        name={"path"}
                        placeholder="Enter app path"
                        value={thisapp.path}
                        onChange={handleChange}
                        errorMsg={errors.path}
                    />
                    <Input
                        label={"App Init"}
                        id={"appInit"}
                        className={"form-control"}
                        type={"text"}
                        name={"init"}
                        placeholder="Enter app init"
                        value={thisapp.init}
                        onChange={handleChange}
                        errorMsg={errors.init}
                    />
                    <Input
                        label={"App Web"}
                        id={"appWeb"}
                        className={"form-control"}
                        type={"text"}
                        name={"web"}
                        placeholder="Enter app web"
                        value={thisapp.web}
                        onChange={handleChange}
                        errorMsg={errors.web}
                    />
                    <TextArea
                        label={"App Title"}
                        id={"appTitle"}
                        name={"title"}
                        title={"App Title"}
                        className={"form-control"}
                        type={"textarea"}
                        rows={3}
                        placeholder="Enter app title"
                        value={thisapp.title}
                        onChange={handleChange}
                        errorDiv={"text-danger"}
                        errorMsg={errors.title}
                    />
                    <Input
                        label={"Created"}
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
                    <Input
                        label={"Updated"}
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
                    <div className="d-flex gap-2">
                        <button className="btn btn-success" type="submit">
                            <i className="bi bi-save"></i> Save
                        </button>
                        {thisapp.id > 0 && (
                            <button type="button" className="btn btn-secondary" onClick={handleDelete}>
                                <i className="bi bi-arrow-left me-1"></i> Delete
                            </button>

                        )}
                    </div>

                </form>
            </div>
        </>
    );
};

export { EditApp };