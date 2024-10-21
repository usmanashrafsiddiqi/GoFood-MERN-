import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div>
      <div className="container">
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
          <div className="col-md-4 d-flex align-items-center">
            <a href="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
              <strong>GoFood</strong>
            </a>
            <span className="text-muted">© {currentYear} <i>GoFood</i>, Inc</span>
          </div>
  
          <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
            <li className="ms-3">
              <a className="text-muted" href="/" aria-label="Facebook">
                <svg className="bi" width="24" height="24">
                  {/* Replace with actual SVG path for Facebook */}
                  <path d="..." />
                </svg>
              </a>
            </li>
            <li className="ms-3">
              <a className="text-muted" href="/" aria-label="Twitter">
                <svg className="bi" width="24" height="24">
                  {/* Replace with actual SVG path for Twitter */}
                  <path d="..." />
                </svg>
              </a>
            </li>
            <li className="ms-3">
              <a className="text-muted" href="/" aria-label="Instagram">
                <svg className="bi" width="24" height="24">
                  {/* Replace with actual SVG path for Instagram */}
                  <path d="..." />
                </svg>
              </a>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  );
}
