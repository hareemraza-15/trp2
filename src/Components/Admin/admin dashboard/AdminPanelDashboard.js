import React from "react";
import { Container, Image } from "react-bootstrap";

function AdminPanelDashboard() {
  return (
    <React.Fragment>
      <Container fluid>
        <div>
          <Image
            src="/dashboard-image.png"
            width="100%"
            height="100%"
          />
        </div>
      </Container>
    </React.Fragment>
  );
}

export default AdminPanelDashboard;
