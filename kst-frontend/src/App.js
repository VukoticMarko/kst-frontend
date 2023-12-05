import './App.css';
import 'bulma/css/bulma.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Header from './components/header';
import CourseCard from './components/course-card';
import Login from './components/login/login';
import { handleRectangleClick } from './api/course-card-api';
import LoginButton from './components/login/login-button';
import TestCard from './components/test-card';
import TestIntroduction from './components/test-intro';

function App() {

  return (
    <div className="App">

    <Router>
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route
          path="/"
          element={
            <div>
              <Header> 
                  <LoginButton />
              </Header>
              <Sidebar />
             
            </div>
          }
        />
        <Route path='/courses' element={
          <div>
            <Header> 
                <LoginButton />
            </Header>
            <Sidebar />
            <div className="content">
              <CourseCard color="#4CAF50" title="Rectangle 1" />
              <CourseCard color="#2196F3" title="Rectangle 2" />
              <CourseCard color="#FFC107" title="Rectangle 3" />
              <CourseCard color="#E91E63" title="Rectangle 4" />
              <CourseCard color="#CCFFE5" title="Rectangle 5" />
              <CourseCard color="#FFCCE5" title="Rectangle 6" />
              <CourseCard color="#606060" title="Rectangle 7" />
            </div>
          </div>
            
          }
        />
        <Route path='/tests' element={
          <div>
            <Header /> 
            <Sidebar />
            <div className="content">
              <TestCard color="#4CAF50" title="Test Algebre" />
              <TestCard color="#2196F3" title="Kolokvijum Osnova Programiranja" />
            </div>
          </div>
            
          }
        />
         <Route path='/testIntroduction' element={
          <div>
            <TestIntroduction/>
          </div>
            
          }
        />
      </Routes>
    </Router>
        
    </div>
  );
}

export default App;
