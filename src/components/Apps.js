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
                    // console.log("Apps with all the fields: ", data);
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
//     return (
//         <>
//             <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"></link>
//             <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"></link>

//             <NavBar />
//             <div className="list-container">
//                 <h2 style={{ display: "block", textAlign: "center" }}>
//                     Apps List
//                 </h2>
//                 <Link
//                     to="/editapp/0"
//                     className="list-group-item list-group-item-action"
//                 >
//                     <h3>
//                         <i className="bi bi-plus-circle" style={{ marginRight: 8 }}></i>
//                         Add App
//                     </h3>
//                 </Link>
//                 <hr />
//                 <table className="table table-striped table-hover">
//                     <thead>
//                         <tr>
//                             <th>Name</th>
//                             <th>Release</th>
//                             <th>Path</th>
//                             <th>Init</th>
//                             <th>Web</th>
//                             <th>Title</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {apps?.map?.((m) => (
//                             <tr key={m.id}>
//                                 <td>
//                                     <Link to={`/thisapp/${m.id}`}>
//                                         {m.name}
//                                     </Link>
//                                 </td>
//                                 <td>
//                                     {(() => {
//                                         const index = getIndex(m.release);
//                                         return index !== -1 ? releaseOptions[index].value : m.release;
//                                     })()}
//                                 </td>
//                                 <td>{m.path}</td>
//                                 <td>{m.init}</td>
//                                 <td>{m.web}</td>
//                                 <td>{m.title}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </>
//     )
// }
return (
    <>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"></link>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"></link>

        <NavBar />
        <div className="container-fluid py-4">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h2 text-primary mb-1">
                        <i className="bi bi-grid-3x3-gap me-2"></i>
                        Apps List
                    </h1>
                    <p className="text-muted mb-0">Manage and browse your application portfolio</p>
                </div>
                <div className="text-end">
                    <div className="badge bg-light text-dark fs-6 p-2">
                        <i className="bi bi-collection me-1"></i>
                        {apps?.length || 0} {apps?.length === 1 ? 'App' : 'Apps'}
                    </div>
                </div>
            </div>

            {/* Add App Card */}
            <div className="card mb-4 border-dashed bg-light">
                <Link
                    to="/editapp/0"
                    className="card-body text-center p-4 text-decoration-none"
                >
                    <div className="text-primary mb-2">
                        <i className="bi bi-plus-circle display-6"></i>
                    </div>
                    <h3 className="h5 text-dark mb-1">Add New App</h3>
                    <p className="text-muted mb-0">Create a new application entry</p>
                </Link>
            </div>

            {/* Apps Table */}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3 border-bottom">
                    <h5 className="card-title mb-0 text-dark">
                        <i className="bi bi-table me-2"></i>
                        Application Portfolio
                    </h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col" className="ps-4">
                                        <i className="bi bi-app me-1"></i>
                                        Application
                                    </th>
                                    <th scope="col">
                                        <i className="bi bi-tag me-1"></i>
                                        Release
                                    </th>
                                    <th scope="col">
                                        <i className="bi bi-folder me-1"></i>
                                        Path
                                    </th>
                                    <th scope="col">
                                        <i className="bi bi-play-circle me-1"></i>
                                        Init
                                    </th>
                                    <th scope="col">
                                        <i className="bi bi-globe me-1"></i>
                                        Web
                                    </th>
                                    <th scope="col" className="pe-4">
                                        <i className="bi bi-card-heading me-1"></i>
                                        Title
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {apps?.map?.((m) => (
                                    <tr key={m.id} className="app-row">
                                        <td className="ps-4">
                                            <Link
                                                to={`/thisapp/${m.id}`}
                                                className="text-decoration-none d-flex align-items-center"
                                            >
                                                <div className="app-icon bg-primary bg-opacity-10 text-primary rounded p-2 me-3">
                                                    <i className="bi bi-box-seam"></i>
                                                </div>
                                                <div>
                                                    <div className="fw-semibold text-dark">{m.name}</div>
                                                    <div className="text-muted small">ID: {m.id}</div>
                                                </div>
                                            </Link>
                                        </td>
                                        <td>
                                            <span className="badge bg-secondary bg-opacity-25 text-dark">
                                                {(() => {
                                                    const index = getIndex(m.release);
                                                    return index !== -1 ? releaseOptions[index].value : m.release;
                                                })()}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="text-truncate" style={{maxWidth: '200px'}} title={m.path}>
                                                <i className="bi bi-folder2 text-warning me-1"></i>
                                                {m.path}
                                            </div>
                                        </td>
                                        <td>
                                            <code className="bg-light rounded p-1 small">{m.init}</code>
                                        </td>
                                        <td>
                                            {m.web ? (
                                                <a
                                                    href={m.web}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none"
                                                >
                                                    <i className="bi bi-box-arrow-up-right me-1"></i>
                                                    Visit
                                                </a>
                                            ) : (
                                                <span className="text-muted">—</span>
                                            )}
                                        </td>
                                        <td className="pe-4">
                                            <div className="text-truncate" style={{maxWidth: '150px'}} title={m.title}>
                                                {m.title}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {(!apps || apps.length === 0) && (
                        <div className="text-center py-5">
                            <div className="text-muted mb-3">
                                <i className="bi bi-inbox display-4"></i>
                            </div>
                            <h5 className="text-muted">No applications found</h5>
                            <p className="text-muted mb-4">Get started by adding your first application</p>
                            <Link
                                to="/editapp/0"
                                className="btn btn-primary"
                            >
                                <i className="bi bi-plus-circle me-2"></i>
                                Add First App
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats Footer */}
            {apps && apps.length > 0 && (
                <div className="mt-4">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <div className="card bg-primary bg-opacity-10 border-0">
                                <div className="card-body py-3">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-primary bg-opacity-25 rounded p-2 me-3">
                                            <i className="bi bi-collection text-primary"></i>
                                        </div>
                                        <div>
                                            <div className="text-muted small">Total Apps</div>
                                            <div className="h5 mb-0 text-primary">{apps.length}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-success bg-opacity-10 border-0">
                                <div className="card-body py-3">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-success bg-opacity-25 rounded p-2 me-3">
                                            <i className="bi bi-check-circle text-success"></i>
                                        </div>
                                        <div>
                                            <div className="text-muted small">Active</div>
                                            <div className="h5 mb-0 text-success">{apps.filter(app => app.release === 'production').length}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-warning bg-opacity-10 border-0">
                                <div className="card-body py-3">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-warning bg-opacity-25 rounded p-2 me-3">
                                            <i className="bi bi-gear text-warning"></i>
                                        </div>
                                        <div>
                                            <div className="text-muted small">In Development</div>
                                            <div className="h5 mb-0 text-warning">{apps.filter(app => app.release === 'development').length}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-info bg-opacity-10 border-0">
                                <div className="card-body py-3">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-info bg-opacity-25 rounded p-2 me-3">
                                            <i className="bi bi-globe text-info"></i>
                                        </div>
                                        <div>
                                            <div className="text-muted small">Web Apps</div>
                                            <div className="h5 mb-0 text-info">{apps.filter(app => app.web).length}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        <style>{`
            .app-row:hover {
                background-color: #f8f9fa !important;
                transform: translateY(-1px);
                transition: all 0.2s ease;
            }

            .app-icon {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .border-dashed {
                border: 2px dashed #dee2e6 !important;
            }

            .card:hover .border-dashed {
                border-color: #0d6efd !important;
            }

            .table th {
                border-top: none;
                font-weight: 600;
                font-size: 0.875rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #6c757d;
            }

            .table td {
                border-top: 1px solid #f8f9fa;
                vertical-align: middle;
            }

            .card-header {
                background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            }
        `}</style>
    </>
)
}
export { Apps };