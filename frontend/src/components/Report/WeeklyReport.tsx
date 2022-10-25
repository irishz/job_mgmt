import "@fontsource/sarabun";
import {
  Badge,
  Box,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Grid,
  GridItem,
  List,
  ListItem,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import axios, { AxiosResponse } from "axios";
import { useEffect, useMemo, useState } from "react";
import IJob from "../../types/Job/job-types";
import member from "./ComputerMember";
import moment from "moment";
import optStatusList from "../../util/jobStatusList";

function WeeklyReport() {
  const [jobList, setjobList] = useState<IJob[] | null>(null);
  const [toggleNumber, settoggleNumber] = useState<boolean>(true);
  const API_URL = import.meta.env.VITE_API_URL;
  let successJob: number = 0,
    inprogressJob: number = 0,
    totalJob: number = 0
  useEffect(() => {
    axios.get(`${API_URL}/job`).then((res: AxiosResponse) => {
      console.log(res.data);
      setjobList(res.data);
    });
  }, []);

  if (jobList) {
    successJob = jobList.filter((job) => job.status === "User Training").length;
    inprogressJob = jobList.filter(
      ({status}) => optStatusList.filter(({name}) => name !== 'User Training').map(({name}) => name).includes(status)
    ).length;
    totalJob = jobList.filter((job) => !['wait for approve', 'in progress', 'rejected'].includes(job.status)).length
  }

  function renderJobByPerson(userId: string): number | undefined {
    let jobCountByPerson: number | undefined = 0;
    if (userId) {
      jobCountByPerson = jobList?.filter(
        (job) => job.responsible_staff?._id === userId
      ).length;
    }

    return jobCountByPerson;
  }

  return (
    <Box bgColor="gray.200" w="full" h="100vh" p={5}>
      <Grid
        h={"full"}
        templateColumns={"repeat(12, 1fr)"}
        templateRows={"repeat(3, 1fr)"}
        gap={4}
      >
        <GridItem
          p={5}
          bg={"white"}
          colSpan={3}
          borderRadius={"lg"}
          borderWidth={1}
          borderColor="#F2FCFF"
          boxShadow={"0 2px 8px 0 rgba(0,0,0,0.18)"}
        >
          <Stat>
            <StatLabel color={"gray.600"} fontSize="2xl">
              All Jobs
            </StatLabel>
            <StatNumber color={"gray.700"} fontSize="9xl">
              {totalJob}
            </StatNumber>
          </Stat>
        </GridItem>
        <GridItem
          p={5}
          bg={"white"}
          colSpan={3}
          borderRadius={"lg"}
          borderWidth={1}
          borderColor="#F2FCFF"
          boxShadow={"0 2px 8px 0 rgba(0,0,0,0.18)"}
        >
          <Stack gap={3} h={"full"}>
            <Text color="gray.600" fontSize={"xl"} fontWeight="semibold">
              Job By Person
            </Text>
            <List
              h={"inherit"}
              display={"flex"}
              flexDirection="column"
              justifyContent="space-around"
            >
              {member.map((member) => (
                <ListItem
                  key={member.name_display}
                  display="flex"
                  justifyContent={"space-between"}
                  px={3}
                >
                  <Text>{member.name_display}</Text>
                  <Text>{renderJobByPerson(member.id)}</Text>
                </ListItem>
              ))}
            </List>
          </Stack>
        </GridItem>
        <GridItem
          h={"full"}
          p={5}
          bg={"white"}
          colSpan={3}
          borderRadius={"lg"}
          borderWidth={1}
          borderColor="#F2FCFF"
          boxShadow={"0 2px 8px 0 rgba(0,0,0,0.18)"}
        >
          <VStack>
            <CircularProgress
              value={(successJob / totalJob) * 100}
              color="teal"
              size={"3.2em"}
              onClick={() => settoggleNumber(!toggleNumber)}
            >
              <CircularProgressLabel fontSize={40}>
                {toggleNumber
                  ? successJob
                  : `${((successJob / totalJob) * 100).toFixed(0)}%`}
              </CircularProgressLabel>
            </CircularProgress>
            <Text>Success</Text>
          </VStack>
        </GridItem>
        <GridItem
          p={5}
          bg={"white"}
          colSpan={3}
          borderRadius={"lg"}
          borderWidth={1}
          borderColor="#F2FCFF"
          boxShadow={"0 2px 8px 0 rgba(0,0,0,0.18)"}
        >
          <VStack>
            <CircularProgress
              value={(inprogressJob / totalJob) * 100}
              color="tomato"
              size={"3.2em"}
              onClick={() => settoggleNumber(!toggleNumber)}
            >
              <CircularProgressLabel fontSize={40}>
                {toggleNumber
                  ? inprogressJob
                  : `${((inprogressJob / totalJob) * 100).toFixed(0)}%`}
              </CircularProgressLabel>
            </CircularProgress>
            <Text>In Progress</Text>
          </VStack>
        </GridItem>
        <GridItem
          p={5}
          bg={"white"}
          colSpan={12}
          rowSpan={2}
          borderRadius={"lg"}
          borderWidth={1}
          borderColor="#F2FCFF"
          boxShadow={"0 2px 8px 0 rgba(0,0,0,0.18)"}
        >
          <Box>
            <Tabs variant={'enclosed'}>
              <TabList>
                {member.map((member) => (
                  <Tab key={member.id}>{member.name_display}</Tab>
                ))}
              </TabList>

              <TabPanels overflowX={"auto"}>
                {member.map((member) => (
                  <TabPanel key={member.id}>
                    <TableContainer>
                      <Table variant={"striped"} size="sm" color={"gray.600"}>
                        <Thead fontWeight={"semibold"}>
                          <Tr>
                            <Th>Job No.</Th>
                            <Th>Topic</Th>
                            <Th>Progress (%)</Th>
                            <Th>Date Finish (Actual)</Th>
                            <Th>Date Finish (Estimate)</Th>
                            <Th>Delay Reason</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {jobList
                            ?.filter((job) =>
                              job.responsible_staff?._id?.includes(member.id)
                            )
                            .map((job) => (
                              <Tr>
                                <Td>{job.job_no}</Td>
                                <Td>{job.topic}</Td>
                                <Td>{job.progress}</Td>
                                <Td>
                                  {moment(job.act_finish_date).format(
                                    "DD/MM/YYYY"
                                  )}
                                </Td>
                                <Td>
                                  {moment(job.est_finish_date).format(
                                    "DD/MM/YYYY"
                                  )}
                                </Td>
                                <Td>{job.delay_reason}</Td>
                              </Tr>
                            ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default WeeklyReport;
