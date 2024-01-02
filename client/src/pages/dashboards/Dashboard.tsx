import { Navigate } from "react-router-dom";
import { getLocalStorageRole } from "../../utils";
import { Layout } from "../Layout";
import { PublicRoutes} from "../../constants";

function Dashboard() {
  const role = getLocalStorageRole();
  const renderDashBoard = () => {
    switch (role) {
      case "ADMIN":
        return <h1></h1>;
      case "ADVISOR":
        return <h1>User Dashboard</h1>;
      case "MANAGER":
        return <h1>Manager Dashboard</h1>;
      case "BANK_MANAGER":
        return <h1>Bank Manager Dashboard</h1>;

      case "COMMUNITY_MANAGER":
        return <h1>Community Manager Dashboard</h1>;
      case "RECEPTIONIST":
        return <h1>Receptionist Dashboard</h1>;
      default:
        return <Navigate replace to={PublicRoutes.LOGIN} />;
    }
  };

  return (
    <>
      <Layout title="Dashboard">{renderDashBoard()}</Layout>
    </>
  );
}

export default Dashboard;
