import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthGuard } from "./guards";
import { PublicRoutes } from "./constants";
import { Suspense, lazy } from "react";
import { NotFound } from "./pages/NotFound";
import { Loading } from "./component/loader/Loading";
import { LeadList } from "./pages/leads/LeadList";
import { renderRoutesByRole } from "./routes/index.routes";

const Login = lazy(() => import("./pages/login/Login"));

function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={<Navigate replace to={"prospectos/lista"} />}
            />
            <Route path={PublicRoutes.LOGIN} element={<Login />} />
            <Route element={<AuthGuard />}>
              <Route path={"prospectos/lista"} element={<LeadList />} />
              <Route path={"prospectos/lista-precalificar-banco"} element={<LeadList status="Precalificar Banco" />} />
              <Route path={"prospectos/lista-precalificar-buro"} element={<LeadList status="Precalificar Buró" />} />
              {renderRoutesByRole()}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </Suspense>
    </>
  );
}

export default App;
