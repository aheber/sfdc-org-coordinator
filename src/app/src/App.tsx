import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import OrgOpen from "./components/OrgOpen";

function App() {
  const params = new URLSearchParams(window.location.search);
  let errorMsg;
  if (params.get("error")) {
    errorMsg = <div className="page-error">{params.get("error")}</div>;
  }

  return (
    <div>
      <div className="content-main">
        <Router>
          <Switch>
            <Route exact path="/org/open">
              <OrgOpen />
            </Route>
          </Switch>
        </Router>

        {errorMsg}
      </div>
    </div>
  );
}

export default App;
