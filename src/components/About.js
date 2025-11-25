import React from 'react';

const About = () => {
  return (
    <div className="container py-5">
      {/* Page Header */}
      <div className="row mb-5">
        <div className="col">
          <h1 className="display-4 fw-bold text-primary">About AuthServer</h1>
          <p className="lead text-muted">
            Centralized access and management for our ecosystem of innovative products and services.
          </p>
        </div>
      </div>

      {/* Our Mission & Portfolio */}
      <section className="row mb-5">
        <div className="col-lg-8 mx-auto">
          <h2 className="h3 fw-bold mb-3">
            <i className="bi bi-bullseye me-2 text-primary"></i>
            Our Mission & Portfolio
          </h2>
          <p className="mb-3">
            AuthServer is the central hub for our ecosystem of products and services. Each project within this portfolio is an investment venture funded by AZTech Ventures and developed by dedicated teams. While our teams are diverse, they are united by a common strategy: an unwavering devotion to our customers and a commitment to technological excellence.
          </p>
          <p>
            This application provides a comprehensive overview of each project—its status, features, and development roadmap—offering transparency and insight into our entire operation.
          </p>
        </div>
      </section>

      {/* Our Expertise & Heritage */}
      <section className="row mb-5">
        <div className="col-lg-8 mx-auto">
          <h2 className="h3 fw-bold mb-3">
            <i className="bi bi-award me-2 text-primary"></i>
            Our Expertise & Heritage
          </h2>
          <p className="mb-3">
            We are creators and entrepreneurs with a proven track record of success across multiple industries, including publishing, banking, organizational development, and customer relationship management.
          </p>
          <p>
            Our journey in cloud-based solutions began in 2011 with the launch of our first full-cloud application in Europe. Since then, we have strategically scaled our services using DevOps methodologies, growing from a handful of users to millions, and from a single server to a distributed network of hundreds of servers across multiple regions.
          </p>
        </div>
      </section>

      {/* Our Technological Foundation */}
      <section className="row mb-5">
        <div className="col-lg-8 mx-auto">
          <h2 className="h3 fw-bold mb-3">
            <i className="bi bi-cpu me-2 text-primary"></i>
            Our Technological Foundation
          </h2>
          <p className="mb-3">
            Our reliability is built on a modern, robust technology stack and automated processes.
          </p>
          <ul className="list-unstyled">
            <li className="mb-2">
              <i className="bi bi-check-circle-fill text-success me-2"></i>
              <strong>CI/CD & Automation:</strong> Our continuous integration and deployment pipeline ensures we are a trustworthy provider for both end-users and enterprises.
            </li>
            <li className="mb-2">
              <i className="bi bi-check-circle-fill text-success me-2"></i>
              <strong>Modern & Secure Languages:</strong> We leverage leading-edge programming languages like Go and Rust to build secure, stable, and high-performance systems.
            </li>
            <li className="mb-2">
              <i className="bi bi-check-circle-fill text-success me-2"></i>
              <strong>Scalable Infrastructure:</strong> Our services are built on Docker containers, Kubernetes orchestration, and server replication for scalability and resilience.
            </li>
            <li className="mb-2">
              <i className="bi bi-check-circle-fill text-success me-2"></i>
              <strong>Diverse Problem-Solving:</strong> We employ the most effective approach for each challenge, whether it's agent-based modeling, machine learning, artificial intelligence, or a combination of these technologies.
            </li>
          </ul>
        </div>
      </section>

      {/* What is the AuthServer Application? */}
      <section className="row mb-5">
        <div className="col-lg-8 mx-auto">
          <h2 className="h3 fw-bold mb-3">
            <i className="bi bi-question-circle me-2 text-primary"></i>
            What is the AuthServer Application?
          </h2>
          <p className="mb-3">
            The AuthServer application serves two primary functions:
          </p>

          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="card h-100 border-primary">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-info-circle text-primary me-2"></i>
                    Unified Access & Information Hub
                  </h5>
                  <p className="card-text">
                    This is the single source of truth for directories and strategic leaders within our organization. It provides full descriptions of each product and service, access to milestones, analytical data, and complete documentation.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="card h-100 border-success">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-shield-lock text-success me-2"></i>
                    Centralized Authentication Service
                  </h5>
                  <p className="card-text">
                    AuthServer is the secure gateway for all our products. It authenticates users—both developers and consumers—using credentials and biometrics, and then directs them to the appropriate application.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits of a Unified System */}
      <section className="row">
        <div className="col-lg-8 mx-auto">
          <h2 className="h3 fw-bold mb-3">
            <i className="bi bi-graph-up me-2 text-primary"></i>
            Key Benefits of a Unified System
          </h2>
          <p className="mb-4">
            By combining information management and user authentication into a single platform, we achieve unparalleled efficiency and accuracy.
          </p>
          <div className="row">
            <div className="col-md-6 mb-3">
              <h5 className="fw-bold">
                <i className="bi bi-arrow-clockwise text-primary me-2"></i>
                Automated & Real-Time Updates
              </h5>
              <p className="text-muted">
                Information is maintained during normal use. When a developer releases a new version, the version field updates for everyone automatically.
              </p>
            </div>
            <div className="col-md-6 mb-3">
              <h5 className="fw-bold">
                <i className="bi bi-bar-chart-line text-primary me-2"></i>
                Accurate Analytics
              </h5>
              <p className="text-muted">
                Critical data, such as trial or MVP user counts, is generated automatically through login processes, eliminating manual updates.
              </p>
            </div>
            <div className="col-md-6 mb-3">
              <h5 className="fw-bold">
                <i className="bi bi-collection text-primary me-2"></i>
                Centralized Operational Data
              </h5>
              <p className="text-muted">
                Records of backups, reported bugs, and application usage are seamlessly collected for essential insights.
              </p>
            </div>
            <div className="col-md-6 mb-3">
              <h5 className="fw-bold">
                <i className="bi bi-person-badge text-primary me-2"></i>
                Role-Based Access Control
              </h5>
              <p className="text-muted">
                Different users—investors, testers, developers—see only information relevant to their role, ensuring security and clarity.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export { About };