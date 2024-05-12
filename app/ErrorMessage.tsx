interface ErrorMessageProps {
  error: Error;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  return <div>An error occurred: {error.message}</div>;
};

export default ErrorMessage;
