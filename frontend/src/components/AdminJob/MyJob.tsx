import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Highlight,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios, { AxiosResponse } from "axios";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import IJob from "../../types/Job/job-types";
import AuthContext from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import optStatusList from "../../util/jobStatusList";
import "moment/dist/locale/th";

function MyJob() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [jobList, setjobList] = useState<IJob[] | undefined>(undefined);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  moment.locale("th");

  useEffect(() => {
    if (authCtx?.userData) {
      fetchData();
    }
  }, [authCtx]);

  function fetchData() {
    axios
      .get(`${API_URL}/job/response/${authCtx?.userData?._id}`)
      .then((res) => {
        setjobList(res.data);
      });
    return;
  }

  function getColorFromJobStatus(status: string): string {
    switch (status) {
      case "Scope Program Process":
        return "red";
      // break;
      case "Diagram Process":
        return "orange";
      // break;
      case "Coding Process":
        return "yellow";
      // break;
      case "Testing Process":
        return "teal";
      // break;
      case "User Training":
        return "green";
      // break;
      default:
        return "gray";
      // break;
    }
  }

  return (
    <Box h={"full"} p={3} bgGradient="linear(to-br, #ebf4f5, #b5c6e0)">
      <Box>
        <Flex justifyContent={"space-between"} alignItems="center">
          <Heading>My Job</Heading>
          <Text fontSize={20} fontWeight="semibold">
            {authCtx?.userData?.name} ({authCtx?.userData?.department})
          </Text>
        </Flex>
        <SimpleGrid minChildWidth={200} spacing={3} my={4} column={5}>
          {jobList ? (
            jobList
              ?.sort((a, b) => {
                if (a.progress < b.progress) {
                  return -1;
                } else if (a.progress > b.progress) {
                  return 1;
                } else if (a.est_finish_date < b.est_finish_date) {
                  return -1;
                } else if (a.est_finish_date > b.est_finish_date) {
                  return 1;
                } else {
                  return 0;
                }
              })
              .map((job) => (
                <VStack
                  key={job._id}
                  h="auto"
                  rounded="md"
                  boxShadow={"0 2px 4px 0 rgba(0, 0, 0, 0.18)"}
                  alignItems="start"
                  p={2}
                  spacing={1}
                  bgColor="white"
                  _hover={{ bgColor: "gray.100" }}
                >
                  <Flex
                    w="full"
                    justifyContent={"space-between"}
                    px="2"
                    alignItems={"center"}
                  >
                    <Text fontWeight={"semibold"}>{job.topic}</Text>
                    <EditIcon
                      color={"blue.700"}
                      _hover={{ color: "blue.400" }}
                      onClick={() => navigate("/myjob/edit", { state: job })}
                      cursor="pointer"
                    />
                  </Flex>
                  <Divider borderWidth={1} />
                  <Text color={"GrayText"}>JobNo : {job.job_no}</Text>
                  <Highlight
                    children={job.status}
                    query={optStatusList.map(({ name }) => name)}
                    styles={{
                      bgColor: getColorFromJobStatus(job.status),
                      px: 2,
                      py: 1,
                      rounded: "md",
                    }}
                  />
                  <Text color={"GrayText"}>
                    DueDate : {moment(job.est_finish_date).format("DD/MM/YYYY")}{" "}
                    <strong>
                      {job.progress < 100
                        ? moment(job.est_finish_date).fromNow()
                        : ""}
                    </strong>
                  </Text>
                </VStack>
              ))
          ) : (
            <Text>Job not found!</Text>
          )}
        </SimpleGrid>
      </Box>
    </Box>
  );
}

export default MyJob;
