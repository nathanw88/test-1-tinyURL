import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Uploader from "./pages/Uploader/Uploader"

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={Uploader} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;