import "@fontsource/sarabun";
import {
  Badge,
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Grid,
  GridItem,
  List,
  ListItem,
  Select,
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
import React, { useEffect, useRef, useState } from "react";
import IJob from "../../types/Job/job-types";
import moment from "moment";
import optStatusList from "../../util/jobStatusList";
import { iUserAPI } from "../../types/user-types";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker, Range, RangeKeyDict } from "react-date-range";
import { th } from "date-fns/locale";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import "moment/dist/locale/th";

function WeeklyReport() {
  const [jobList, setjobList] = useState<IJob[] | null>(null);
  const [compMemberList, setcompMemberList] = useState<iUserAPI[] | null>(null);
  const [toggleNumber, settoggleNumber] = useState<boolean>(true);
  const [toggleButton, settoggleButton] = useState<boolean>(false);
  const [allJobsButton, setallJobsButton] = useState<boolean>(true);
  const [filterStatus, setfilterStatus] = useState<string[]>([
    "User Training",
    "Scope Program Process",
    "Diagram Process",
    "Coding Process",
    "Testing Process",
  ]);
  const [startDate, setstartDate] = useState<Date | undefined>(new Date());
  const [endDate, setendDate] = useState<Date | undefined>(new Date());
  const selectInputRef = useRef<HTMLSelectElement>(null);

  const API_URL = import.meta.env.VITE_API_URL;
  let successJob: number = 0,
    inprogressJob: number = 0,
    totalJob: number = 0;

  const selectionRange: Range = {
    startDate,
    endDate,
    key: "selection",
  };

  useEffect(() => {
    if (toggleButton === false) {
      // fetch job list data by date range
      axios
        .get(
          `${API_URL}/job/date-range?startdate=${moment(startDate).format(
            "YYYY-MM-DD"
          )}&enddate=${moment(endDate).format("YYYY-MM-DD")}`
        )
        .then((res: AxiosResponse) => {
          setjobList(res.data);
        });
    }
    setallJobsButton(false);
  }, [toggleButton]);

  useEffect(() => {
    axios.get(`${API_URL}/job`).then((res: AxiosResponse) => {
      setjobList(res.data);
    });

    axios.get(`${API_URL}/users/comp-users`).then((res: AxiosResponse) => {
      setcompMemberList(res.data);
    });
  }, [allJobsButton]);

  if (jobList) {
    successJob = jobList.filter((job) => job.status === "User Training").length;
    inprogressJob = jobList.filter(({ status }) =>
      optStatusList
        .filter(({ name }) => name !== "User Training")
        .map(({ name }) => name)
        .includes(status)
    ).length;
    totalJob = jobList.filter(
      (job) =>
        !["wait for approve", "in progress", "rejected"].includes(job.status)
    ).length;
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

  function handleBtnDateRangeClick() {
    settoggleButton(!toggleButton);
  }

  function handleSelectRange(ranges: RangeKeyDict) {
    setstartDate(ranges.selection.startDate);
    setendDate(ranges.selection.endDate);
    setfilterStatus([]);
  }

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    let status: string = e.target.value;
    switch (status) {
      case "all":
        setfilterStatus([
          "User Training",
          "Scope Program Process",
          "Diagram Process",
          "Coding Process",
          "Testing Process",
        ]);
        break;

      case "success":
        setfilterStatus(["User Training"]);
        break;

      case "in-progress":
        setfilterStatus([
          "Scope Program Process",
          "Diagram Process",
          "Coding Process",
          "Testing Process",
        ]);
        break;

      default:
        break;
    }
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
              {compMemberList?.map((member) => (
                <ListItem
                  key={member.name}
                  display="flex"
                  justifyContent={"space-between"}
                  px={3}
                >
                  <Text>{member.name}</Text>
                  <Text>{renderJobByPerson(member._id)}</Text>
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
                  : successJob
                  ? `${((successJob / totalJob) * 100).toFixed(0)}%`
                  : "0%"}
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
                  : inprogressJob
                  ? `${((inprogressJob / totalJob) * 100).toFixed(0)}%`
                  : "0%"}
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
            <Tabs variant={"enclosed"}>
              <TabList justifyContent={"space-between"} position="relative">
                <Box display={"flex"}>
                  {compMemberList?.map((member) => (
                    <Tab key={member._id}>
                      {member.name}{" "}
                      <Badge
                        mx={1}
                        bgColor="blue.500"
                        color={"white"}
                        transitionDelay="1000ms"
                      >
                        {jobList?.filter(
                          (job) =>
                            job.responsible_staff?._id?.includes(member._id) &&
                            filterStatus?.includes(job.status)
                        ).length || null}
                      </Badge>
                    </Tab>
                  ))}
                </Box>
                <Box position={"absolute"} right={0} boxShadow={2} w="auto">
                  <Box
                    display={"flex"}
                    justifyContent={"end"}
                    mb={1}
                    alignItems="center"
                    gap={2}
                  >
                    <Select
                      ref={selectInputRef}
                      w={"auto"}
                      variant="outline"
                      textUnderlineOffset={0}
                      onChange={(e) => handleStatusChange(e)}
                      p={0}
                      fontSize={14}
                    >
                      <option value="all">ทั้งหมด</option>
                      <option value="success">Success</option>
                      <option value="in-progress">In Progress</option>
                    </Select>
                    {selectionRange ? (
                      <Text
                        fontSize={12}
                        color="gray.600"
                        boxShadow={"0 2px 4px 0 rgba(0,0,0,0.18)"}
                        py={1}
                        px={2}
                        w={40}
                        rounded={"md"}
                        fontWeight="semibold"
                        textAlign={"center"}
                      >
                        {moment(startDate).format("DD/MM/YYYY")} -{" "}
                        {moment(endDate).format("DD/MM/YYYY")}
                      </Text>
                    ) : null}
                    <Button
                      variant={"outline"}
                      colorScheme="blue"
                      leftIcon={
                        toggleButton ? <ArrowUpIcon /> : <ArrowDownIcon />
                      }
                      onClick={handleBtnDateRangeClick}
                    >
                      เลือกวันที่
                    </Button>
                    <Button
                      variant={"outline"}
                      colorScheme="purple"
                      onClick={() => {
                        settoggleButton(false);
                        setallJobsButton(true);
                      }}
                    >
                      ดูทั้งหมด
                    </Button>
                  </Box>
                  {toggleButton === false ? null : (
                    <Stack>
                      <DateRangePicker
                        ranges={[selectionRange]}
                        locale={th}
                        onChange={handleSelectRange}
                      />
                      <Button
                        size={"sm"}
                        variant="solid"
                        colorScheme={"blue"}
                        onClick={() => settoggleButton(false)}
                      >
                        ตกลง
                      </Button>
                    </Stack>
                  )}
                </Box>
              </TabList>

              <TabPanels>
                {compMemberList?.map((member) => (
                  <TabPanel key={member._id}>
                    <TableContainer overflowY={"auto"} h="350">
                      <Table variant={"striped"} size="sm" color={"gray.600"}>
                        <Thead fontWeight={"semibold"}>
                          <Tr>
                            <Th>Job No.</Th>
                            <Th>Topic</Th>
                            <Th>Progress (%)</Th>
                            <Th>Create date</Th>
                            <Th>Date Finish (Actual)</Th>
                            <Th>Date Finish (Estimate)</Th>
                            <Th>Time Left</Th>
                            <Th>Delay Reason</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {jobList
                            ?.filter(
                              (job) =>
                                job.responsible_staff?._id?.includes(
                                  member._id
                                ) && filterStatus?.includes(job.status)
                            )
                            .sort(
                              (a, b) =>
                                new Date(a.est_finish_date).getTime() -
                                new Date(b.est_finish_date).getTime()
                            )
                            .map((job) => (
                              <Tr key={job._id}>
                                <Td>{job.job_no}</Td>
                                <Td>{job.topic}</Td>
                                <Td>{job.progress}</Td>
                                <Td>
                                  {moment(job.createdAt).format("DD/MM/YYYY")}
                                </Td>
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
                                <Td>
                                  {job.progress < 100
                                    ? moment(job.est_finish_date).fromNow()
                                    : ""}
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
