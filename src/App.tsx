import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
      {/* 사업주 */}
      <Route path="/employer/dashboard" element={<div>사업주 대시보드</div>} />

      {/* 유학생 */}
      <Route path="/student/jobs" element={<div>추천 공고</div>} />
    </Routes>
  );
}

export default App;