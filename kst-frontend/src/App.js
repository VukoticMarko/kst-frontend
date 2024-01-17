import './App.css';
import 'bulma/css/bulma.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/sidebar/sidebar';
import Header from './components/header/header';
import Login from './components/login/login';
import LoginButton from './components/login/login-button';
import TestIntroduction from './components/test/test-intro';
import LogoutButton from './components/login/logout-button';
import Account from './components/account/account';
import KnowledgeGraph from './components/knowledge-graph/knowledge-graph';
import CourseList from './components/course-card/course-list';
import TestCreator from './components/test-create/test-create';
import { useState } from 'react';
import TestList from './components/test/test-list';
import TestWrapper from './components/test/test-wrapper';
import BasicFlow from './components/knowledge-graph/test-graph';

function App() {

  const [accessToken, setAccessToken] = useState('')

  return (
    <div className="App">

    <Router>
      <Routes>
          <Route path='/kg' element={<KnowledgeGraph></KnowledgeGraph>} />
          <Route path='/test/:testId' element={
          <div>
          <Header/>
          <TestWrapper />
          </div>
          } />          
          <Route path="/login" element={<Login setAccessToken={setAccessToken}/>} />
          <Route
          path="/"
          element={
            <div>
              <Header> 
                  <LoginButton />
              </Header>
              <div className='hs-image'> <img src={require('./images/hs.jpg')} style={{ marginTop: "65px", marginLeft: "20px"}} alt='Home Screen Image'/></div>
            </div>
          }
        />
        <Route path='/courses' element={
          <div>
            <Header> 
                <LogoutButton />
            </Header>
            <Sidebar />
            <div className="content">
              <CourseList/>
            </div>
          </div>
            
          }
        />
        <Route path='/tests/:courseId' element={
          <div>
            <Header><LogoutButton/></Header> 
            <Sidebar />
            <div className="content">
              <TestList/>
            </div>
          </div>  
          }
        />
        <Route path='/createTest/:courseId' element={
        <div>
          <TestCreator></TestCreator>
        </div>  
        }
      />
         <Route path='/testIntroduction/:courseId/:testId' element={
          <div>
            <TestIntroduction/>
          </div>
            
          }
        />
        <Route path='/account' element={
          <div>
            <div className='up-left'>
              <Header> 
                  <LogoutButton />
              </Header>
              <Sidebar />
              <div className='content'><Account /></div>
            </div>
          </div>
          }
        />
        <Route path='/testGraph' element={<BasicFlow/>}/>
      </Routes>
    </Router>
        
    </div>
  );
}

export default App;
