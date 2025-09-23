const CheckBox = (props) => {
    return (
        <>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"></link>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"></link>

            <div className="form-check">
                <input
                    id={props.name}
                    className="form-check-input border-warning"
                    type="checkbox"
                    name={props.name}
                    value={props.value}
                    onChange={props.onChange}
                    checked={props.checked}
                />
                <label className="form-check-label fw-bold text-secondary" htmlFor={props.name}>
                    {props.title}
                </label>
            </div>
        </>
    )
}

export { CheckBox };