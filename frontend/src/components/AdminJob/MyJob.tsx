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

function MyJob() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [jobList, setjobList] = useState<IJob[] | undefined>(undefined);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

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
    <Box m={2}>
      <Box>
        <Heading>My Job</Heading>
        <SimpleGrid minChildWidth={200} spacing={3} m={2} column={5}>
          {jobList ? (
            jobList?.map((job) => (
              <VStack
                key={job._id}
                cursor={"pointer"}
                h="auto"
                rounded="md"
                boxShadow={"0 2px 4px 0 rgba(0, 0, 0, 0.18)"}
                alignItems="start"
                p={2}
                spacing={1}
                _hover={{ bgColor: "gray.100" }}
              >
                <Text fontWeight={"semibold"}>{job.topic}</Text>
                <Divider borderWidth={1} />
                <Text>JobNo : {job.job_no}</Text>
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
                <Text>
                  DueDate : {moment(job.est_finish_date).format("DD/MM/YYYY")}
                </Text>
                <Flex>
                  <Button
                    size={"sm"}
                    variant="solid"
                    colorScheme={"messenger"}
                    leftIcon={<EditIcon />}
                    onClick={() => navigate("/myjob/edit", { state: job })}
                  >
                    View Detail & Edit
                  </Button>
                </Flex>
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
