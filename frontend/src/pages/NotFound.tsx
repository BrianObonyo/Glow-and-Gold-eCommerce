import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container narrow center page-pad">
      <h1 className="h2">Page not found</h1>
      <Link to="/" className="btn btn-primary">Back home</Link>
    </div>
  );
}
