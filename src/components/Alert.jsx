const Alert = ({ message, type }) => {
	return <p className={`alert ${type === 'error' ? 'error' : 'success'} show`}>{message}</p>
};

export default Alert;