const NotFoundPage = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '5rem' }}></i>
        <h1 className="display-1 mt-4">404</h1>
        <h2 className="mb-4">Oops! Page not found.</h2>
        <p className="lead mb-4">The page you are looking for does not exist or has been moved.</p>
        <a href="/" className="btn btn-primary">Go to Home</a>
      </div>
    </div>
  );
};

export default NotFoundPage;
