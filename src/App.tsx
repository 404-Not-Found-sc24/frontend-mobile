import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import NavBar from './components/NavBar';
import { BrowserRouter } from 'react-router-dom';
import Travledes from './pages/TravelDes';
import SearchPlace from './pages/SearchPlace';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import { AuthProvider } from './context/AuthContext';
import PlaceInfo from './pages/PlaceInfo';
import MakePlan from './pages/MakePlan';
import MakeDiary from './pages/MakeDiary';
import DiaryDetail from './pages/DiaryDetail';
import PlanDetail from './pages/PlanDetail';
import AddPlaceForm from './pages/AddPlaceForm';
import SearchTravelDes from './pages/SearchTravelDes';
import EventPage from './pages/Event';
import MyPage from './pages/MyPage';
import ScheduleEx from './pages/ScheduleEx';
import MyPlanPage from './pages/MyPlanPage';
import ViewNotice from './pages/ViewNotice';
import MyDiaryDetail from './pages/MyDiaryDetail';
import MyPageSetting from './pages/MyPageSetting';
import FindEmail from './pages/FindEmail';
import FindPassword from './pages/FindPassword';
import PrivateRoute from './components/PrivateRoute';
import AddEvent from './pages/AddEvent';
import AddPromotion from './pages/AddPromotion';
import EditDiary from './pages/EditDiary';
import LoginSuccess from './pages/LoginSuccess';
import ChangePassword from './pages/ChangePassword';
import NotFound from './pages/NotFound';
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  const ErrorFallback = ({ error }: { error: Error }) => (
    <div className="flex h-1/2 justify-center items-center">
      <div className="text-xl">잘못된 접근입니다.</div>
    </div>
  );

  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/loginSuccess" element={<LoginSuccess />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/notice/view" element={<ViewNotice />} />
            <Route path="/findpassword" element={<FindPassword />} />
            <Route path="/findemail" element={<FindEmail />} />
            <Route element={<PrivateRoute />}>
              <Route path="/makediary" element={<MakeDiary />} />
              <Route path="/editdiary" element={<EditDiary />} />
              <Route path="/plandetail" element={<PlanDetail />} />
              <Route path="/diarydetail" element={<DiaryDetail />} />
              <Route path="/mydiarydetail" element={<MyDiaryDetail />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/myplanpage" element={<MyPlanPage />} />
              <Route path="/mypage-setting" element={<MyPageSetting />} />
              <Route path="/changepassword" element={<ChangePassword />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
