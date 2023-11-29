import './App.css';
import Sidebar from './components/sidebar';
import Header from './components/header';
import CourseCard from './components/course-card';
import { handleRectangleClick } from './api/course-card-api';

function App() {

  const handleCourseCardClick = (courseId) => {
    handleRectangleClick(courseId);
  };

  return (
    <div className="App">
      <Header></Header>
      <Sidebar></Sidebar>
      <div className='content'>
        <CourseCard color="#4CAF50" title="Rectangle 1" onClick={() => handleCourseCardClick(1)}/>
        <CourseCard color="#2196F3" title="Rectangle 2" />
        <CourseCard color="#FFC107" title="Rectangle 3" />
        <CourseCard color="#E91E63" title="Rectangle 4" />
        <CourseCard color="#CCFFE5" title="Rectangle 5" />
        <CourseCard color="#FFCCE5" title="Rectangle 6" />
        <CourseCard color="#606060" title="Rectangle 7" />
      </div>
      
    </div>
  );
}

export default App;
