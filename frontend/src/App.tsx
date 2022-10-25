import { Flex, Box } from "@chakra-ui/layout";
import { useEffect, useMemo, useState } from "react";
import axios, { AxiosResponse } from "axios";
import Login from "./components/Login/Login";
import AuthContext from "./components/Context/AuthContext";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import jwtDecode from "jwt-decode";
import { iUserAPI } from "./types/user-types";
import Navbar from "./components/Navbar/Navbar";
import AdminNav from "./components/Navbar/AdminNav";
import AdminHome from "./components/Admin/AdminHome";
import JobApprove from "./components/AdminJob/JobApprove";
import Unauthorized from "./components/Unauthorized";
import JobContext from "./components/Context/JobContext";
import JobCreate from "./components/Job/JobCreate";
import MonthlyReport from "./components/Report/MonthlyReport";
import WeeklyReport from "./components/Report/WeeklyReport";
import FileUpload from "./components/Home/FileUpload";
import JobDetail from "./components/Home/JobDetail";
import MyJob from "./components/AdminJob/MyJob";
import JobEdit from "./components/AdminJob/JobEdit";

function App() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [userToken, setuserToken] = useState<string>("");
  const [userData, setuserData] = useState<iUserAPI | null>(null);
  const [jobApproveCount, setjobApproveCount] = useState<number>(0);

  const jobCountProviderVal = useMemo(
    () => ({
      jobApproveCount,
      setjobApproveCount,
      increaseJobApproveCount,
      decreaseJobApproveCount,
    }),
    [
      jobApproveCount,
      setjobApproveCount,
      increaseJobApproveCount,
      decreaseJobApproveCount,
    ]
  );

  function increaseJobApproveCount() {
    setjobApproveCount(jobApproveCount + 1);
  }
  function decreaseJobApproveCount() {
    setjobApproveCount(jobApproveCount - 1);
  }

  useEffect(() => {
    let token: string | null = localStorage.getItem("token");

    let userId: String = "";
    // console.log(`token: ${token}`);
    if (token) {
      setuserToken(token);
      //Get userId from token
      const tokenDecoded: { userId: String } = jwtDecode(token);
      userId = tokenDecoded?.userId;
    }

    // get user data by userId
    if (userId) {
      axios.get(`${API_URL}/users/${userId}`).then((res: AxiosResponse) => {
        // console.log(res.data);
        setuserData(res.data);
      });
    }

    //Get Job Count
    axios.get(`${API_URL}/job/wait-approve`).then((res: AxiosResponse) => {
      // console.log(res.data)
      let jobCount: number = res.data.length;
      setjobApproveCount(jobCount);
    });

    return () => {
      setuserData(null);
      setuserToken("");
    };
  }, [userToken]);

  if (!userToken) {
    return <Login setuserToken={setuserToken} />;
  }

  return (
    <AuthContext.Provider
      value={{
        userToken,
        setuserToken: setuserToken,
        userData,
        setuserData: setuserData,
      }}
    >
      <JobContext.Provider value={jobCountProviderVal}>
        <Flex direction={userData?.role === "normal" ? "column" : "row"}>
          {userData?.role === "normal" ? <Navbar /> : <AdminNav />}
          <Box w="full" bgColor={"#fdfdfd"}>
            {userData?.role === "normal" ? (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/job">
                  <Route index element={<Home />} />
                  <Route path="detail" element={<JobDetail />} />
                  <Route path="new" element={<JobCreate />} />
                </Route>
                <Route path="/upload" element={<FileUpload />} />
                <Route path="/unauth" element={<Unauthorized />} />
              </Routes>
            ) : (
              <Routes>
                <Route path="/" element={<AdminHome />} />
                <Route path="/myjob">
                  <Route index element={<MyJob />} />
                  <Route path="edit" element={<JobEdit />} />
                </Route>
                <Route path="/report-weekly" element={<WeeklyReport />} />
                <Route path="/report-monthly" element={<MonthlyReport />} />
                <Route path="/approve" element={<JobApprove />} />
                <Route path="/unauth" element={<Unauthorized />} />
              </Routes>
            )}
          </Box>
        </Flex>
      </JobContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
