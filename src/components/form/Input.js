import { forwardRef } from "react";

const Input = forwardRef((props, ref) => {
    return (
        <>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"></link>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"></link>
            <div className="mb-3">
                <label htmlFor={props.name} className="form-label fw-bold text-secondary">
                    {props.label}
                </label>
                <input
                    id={props.id}
                    name={props.name}
                    title={props.title}
                    className="form-control border-primary"
                    type={props.type}
                    data-testid={props['data-testid']}
                    ref={ref}
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={props.onChange}
                    autoComplete={props.autoComplete}
                    readOnly={props.readOnly}
                />
                <div className={props.errorDiv}>{props.errorMsg}</div>
            </div>
        </>
    )
})
export { Input };