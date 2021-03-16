import {BrowserRouter, Switch, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import RealTimeView from './components/realTimeView';
import NavBar from './components/navbar'
import DataTable from './components/datatable'
import Chart from './components/chart'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar/>
        <Switch>
          <Route exact path='/'>
            <RealTimeView/>
          </Route>
          <Route exact path='/datatable'>
            <DataTable />
          </Route>
          <Route exact path='/chart'>
            <Chart />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
