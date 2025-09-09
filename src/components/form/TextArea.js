const TextArea =(props) => {
    return (
        <div className="mb-3">
            <label htmlFor={props.name} className="form-label">
                {props.title}
            </label>
                <textarea
                    className={`${props.className} form-control ${props.error ? 'is-invalid' : ''}`}
                    id={props.id}
                    name={props.name}
                    value={props.value}
                    onChange={props.onChange}
                    rows={props.rows}
                    placeholder={props.placeholder}
                />
                <div className={props.errorDiv}>{props.errorMsg}</div>
        </div>
    )
}

export { TextArea };