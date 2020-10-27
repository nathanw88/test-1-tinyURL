import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, } from "react-router-dom";
import Uploader from "./pages/Uploader/Uploader";
import Photos from "./pages/Photos/Photos";
import NoMatch from "./pages/NoMatch/NoMatch";
import "bootstrap/dist/css/bootstrap.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          
          <Switch>
            <Route exact path="/" component={Uploader} />
            <Route exact path="/photos/:id" component ={Photos}/>
            <Route component={NoMatch} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;