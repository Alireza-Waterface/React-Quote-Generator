const Alert = ({ message, type }) => <p className={`alert ${type === 'error' ? 'error' : 'success'} show`}>{message}</p>

export default Alert;