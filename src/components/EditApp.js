import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Input from "./form/Input";
import Select from "./form/Select";
import Textarea from "./form/TextArea";
import Swal from "sweetalert2"

const EditApp = () => {
    const navigate = useNavigate();
    const { jwtToken } = useOutletContext();

    const [error, setError] = useState(null);
    const [errors, setErrors] = useState([]);

    const releaseOptions = [
        { id: "A", value: "1.0.0" },
        { id: "B", value: "1.0.1" },
        { id: "C", value: "1.0.2" },
        { id: "D", value: "1.1.0" },
        { id: "E", value: "1.2.0" },
        { id: "F", value: "2" },
        { id: "G", value: "3.0.1" },
        { id: "H", value: "4.1.0" },
    ]

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }
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
    })

    // get id from the URL
    let { id } = useParams();
    if (id === undefined) {
        id = 0;
    }

    useEffect(() => {
        if (jwtToken === "") {
            navigate("/login");
            return;
        }

        if (id === 0) {
            // adding a new app
            setThisapp({
                id: 0,
                name: "",
                release: "",
                path: "",
                init: "",
                web: "",
                title: "",
                created: 0,
                updated: 0,
            });

            const headers = new Headers();
            headers.append("Content-Type", "application/json");

        } else {
            //     editing an existing app
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", "Bearer " + jwtToken);

            const requestOptions = {
                method: "GET",
                headers: headers,
            };

            fetch(`${process.env.REACT_APP_BACKEND}/admin/apps/${id}`, requestOptions)
                .then((response) => {
                    if (response.status !== 200) {
                        setError("Invalid response code: " + response.status)
                    }
                    return response.json();
                })
                .then((data) => {
                    setThisapp({
                        ...data.thisapp,
                    });
                })

                .catch(err => {
                    console.log(err);
                })
        }
    }, [id, jwtToken, navigate]);


    const handleSubmit = (event) => {
        event.preventDefault();

        let errors = [];
        let required = [
            { field: thisapp.name, name: "name" },
            { field: thisapp.path, name: "path" },
            { field: thisapp.init, name: "init" },
            { field: thisapp.web, name: "web" },
            { field: thisapp.title, name: "title" },
            { field: thisapp.release, name: "release" },
        ]

        required.forEach(function (obj) {
            if (obj.field === '') {
                // Swal.fire({
                //     title: 'Error!',
                //     text: 'You must write a ' + obj.name,
                //     icon: 'error',
                //     confirmButtonText: 'OK',  
                // })
                errors.push(obj.name);
            }
        })

        setErrors(errors);

        if (errors.length > 0) {
            return false;
        }

        // passes validation, so save changes
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        // assume we are adding a new app
        let method = "PUT";
        if (thisapp.id > 0) {
            method = "PATCH";
        }

        const requestBody = thisapp;

        let requestOptions = {
            body: JSON.stringify(requestBody),
            method: method,
            headers: headers,
            // credentials: "include",
        };

        fetch(`${process.env.REACT_APP_BACKEND}/admin/apps/${thisapp.id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data, error);
                } else {
                    navigate("/apps");
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    const handleChange = () => (event) => {
        let value = event.target.value;
        let name = event.target.name;
        setThisapp({
            ...thisapp,
            [name]: value,
        })
    }

    const confirmDelete=()=>{
        Swal.fire({
            title: "Delete App?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then((result) => {
            if (result.isConfirmed) {
                let headers = new Headers();
                headers.append("Authorization", "Bearer " + jwtToken)

                const requestOptions = {
                    method: "DELETE",
                    headers: headers,
                }

                fetch(`${process.env.REACT_APP_BACKEND}/admin/apps/${thisapp.id}`, requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        if(data.error) {
                            console.log(data.error)
                        } else {
                            navigate("/apps");
                        }
                    })
                    .catch(err => {console.log(err)});

            //   Swal.fire({
            //     title: "Deleted!",
            //     text: "Your file has been deleted.",
            //     icon: "success"
            //   });
            }
          });
    }

    if (error !== null) {
        return <div>Error: {error.message}</div>;
    }
    else {
        return (
            <div>
                <h2>Add App</h2>
                <hr />
                {/* {<pre>{JSON.stringify(thisapp, null, 3)}</pre>} */}
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="id" value={thisapp.id} id="id"></input>

                    <Input
                        title={"Name"}
                        className={"form-control"}
                        type={"text"}
                        name={"name"}
                        value={thisapp.name}
                        onChange={handleChange("name")}
                        errorMsg={"Please, enter name"}
                        errorDiv={hasError("name") ? "text-danger" : "d-none"}
                    />
                    <Select
                        title={"Release"}
                        name={"release"}
                        type={"select"}
                        options={releaseOptions}
                        value={thisapp.release}
                        onChange={handleChange("release")}
                        placeHolder={"Choose..."}
                        errorMsg={"Please choose"}
                        errorDiv={hasError("release") ? "text-danger" : "d-none"}
                    />
                    <Input
                        title={"Path"}
                        className={"form-control"}
                        type={"text"}
                        name={"path"}
                        value={thisapp.path}
                        onChange={handleChange("path")}
                        errorMsg={"Please, enter path"}
                        errorDiv={hasError("path") ? "text-danger" : "d-none"}
                    />
                    <Input
                        title={"Init"}
                        className={"form-control"}
                        type={"text"}
                        name={"init"}
                        value={thisapp.init}
                        onChange={handleChange("init")}
                        errorMsg={"Please, enter init"}
                        errorDiv={hasError("init") ? "text-danger" : "d-none"}
                    />
                    <Input
                        title={"Web"}
                        className={"form-control"}
                        type={"text"}
                        name={"web"}
                        value={thisapp.web}
                        onChange={handleChange("web")}
                        errorMsg={"Please, enter web"}
                        errorDiv={hasError("web") ? "text-danger" : "d-none"}
                    />
                    <Textarea
                        title={"Title"}
                        className={"form-control"}
                        type={"textarea"}
                        name={"title"}
                        value={thisapp.title}
                        onChange={handleChange("title")}
                        errorMsg={"Please, enter title"}
                        errorDiv={hasError("title") ? "text-danger" : "d-none"}
                    />
                    {/* <Input
                    title={"Created"}
                    className={"form-control"}
                    type={"text"}
                    name={"created"}
                    value={thisapp.created}
                    readOnly={true}
                    // onChange={handleChange("created")}
                />
                <Input
                    title={"Updated"}
                    className={"form-control"}
                    type={"text"}
                    name={"updated"}
                    value={thisapp.updated}
                    readOnly={true}
                    // onChange={handleChange("updated")}
                /> */}
                    <input type="hidden" name="created" value={thisapp.created} id="created" readOnly></input>
                    <input type="hidden" name="updated" value={thisapp.updated} id="updated" readOnly></input>


                    <hr />

                    <button className="btn btn-primary">Save</button>

                    {thisapp.id > 0 &&
                    <a href="#!" className="btn btn-danger ms-2" onClick={confirmDelete}>Delete App</a>
                    }
                </form>
            </div>
        )
    }
}

export default EditApp;