import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import Dashboard from './components/Dashboard';
import About from './components/About';
import Setting from './components/Setting';
import Menubar from './components/Menubar';
import TaskInfo from './components/TaskInfo';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Menubar />
        <Routes>
          <Route path='/' element={<Dashboard />}></Route>
          {/* <Route path='/task' element={<Tasks />}></Route> */}
     
          <Route path='/info/:id' element={<TaskInfo />}></Route>
          <Route path='/about' element={<About />}></Route>
          <Route path='/setting' element={<Setting />}></Route>
          {/* <Route path='/newtask' element={<NewTask />}></Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
