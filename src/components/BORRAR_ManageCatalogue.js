// import { useEffect, useState } from "react";
// import { Link, useNavigate, useOutletContext } from 'react-router-dom';

// const ManageCatalogue = () => {
//     const [apps, setApps] = useState([]);
//     const { jwtToken } = useOutletContext();
//     const navigate = useNavigate();

//     useEffect( () => {
//         if (jwtToken === "") {
//             navigate("/login");
//             return
//         }
//         const headers = new Headers();
//         headers.append("Content-Type", "application/json");
//         headers.append("Authorization", "Bearer " + jwtToken);

//         const requestOptions = {
//             method: "GET",
//             headers: headers,
//         }

//         fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/apps`, requestOptions)
//             .then((response) => response.json())
//             .then((data) => {
//                 setApps(data);
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }, [jwtToken, navigate]);

//     return (
//         <div>
//             <h2>Manage Catalogue</h2>
//             <hr />
//             <table className="table table-striped table-hover">
//                 <thead>
//                     <tr>
//                         <th>Name</th>
//                         <th>Release</th>
//                         <th>Title</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {apps.map((m) => (
//                         <tr key={m.id}>
//                             <td>
//                                 <Link to={`/thisapp/${m.id}`}>
//                                     {m.name}
//                                 </Link>
//                             </td>
//                             <td>{m.release}</td>
//                             <td>{m.title}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     )
// }

// export default ManageCatalogue;