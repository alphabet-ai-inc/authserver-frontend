import Swal from "sweetalert2";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useHandleDelete = (id) => {

    const navigate = useNavigate();

    const { jwtToken } = useAuth();
    const confirmDelete = useCallback(async () => {
        if (!jwtToken) {
            navigate("/login");
            return;
        }

        const result = await Swal.fire({
            title: "Delete App?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                const headers = new Headers({
                    "Authorization": `Bearer ${jwtToken}`
                });

                const requestOptions = {
                    method: "DELETE",
                    headers: headers,
                };

                const response = await
                    fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/apps/${id}`, requestOptions);
                const data = await response.json();

                if (data.error) {
                    Swal.fire({
                        title: 'Error!',
                        text: data.message,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                } else {
                    navigate(`/apps`);
                }
            }
            catch (err) {
                console.error("Error deleting app: ", err);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete the app.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    }, [id, jwtToken, navigate]);

    return confirmDelete;
};
