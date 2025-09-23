const Select = (props) => {
    return (
        <>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"></link>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"></link>
            <div className="mb-3">
                <label htmlFor={props.name} className="form-label fw-bold text-secondary">
                    {props.label}
                </label>
                <select
                    name={props.name}
                    title={props.title}
                    id={props.id}
                    className={`${props.className} form-control border-success ${props.error ? 'is-invalid' : ''}`}
                    value={props.value}
                    onChange={props.onChange}
                >
                    <option value="">{props.placeHolder}</option>
                    {props.options.map((option) => {
                        return (
                            <option
                                key={option.id}
                                value={option.id}
                            >
                                {option.value}
                            </option>
                        )
                    })}
                    errorDiv={props.errorDiv}
                    errorMsg={props.errorMsg}
                </select>
                <div className={props.errorDiv}>{props.errorMsg}</div>
            </div>
        </>
    )
}
export { Select };