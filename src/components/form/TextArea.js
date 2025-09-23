const TextArea = (props) => {

    return (
        <>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"></link>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"></link>
            <div className="mb-3">
                <label htmlFor={props.name} className="form-label fw-bold text-secondary">
                    {props.label}
                </label>
                <textarea
                    id={props.id}
                    name={props.name}
                    className={`${props.className} form-control border-danger ${props.error ? 'is-invalid' : ''}`}
                    type={props.type}
                    placeholder={props.placeholder}
                    title={props.title}
                    value={props.value}
                    onChange={props.onChange}
                    rows={props.rows}
                    errorDiv={props.errorDiv}
                    errorMsg={props.errorMsg}
                ></textarea>
                <div className={props.errorDiv}>{props.errorMsg}</div>
            </div>
        </>
    )
}
export { TextArea };