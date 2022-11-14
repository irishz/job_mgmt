import { CheckIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Skeleton,
  Spinner,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import moment from "moment";
import React, {
  Key,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import IJob from "../../types/Job/job-types";
import TJobContent from "../../types/Job/job-content-type";
import TJobHeading from "../../types/Job/job-heading-type";
import JobContext from "../Context/JobContext";
import { iUserAPI } from "../../types/user-types";
import AuthContext from "../Context/AuthContext";
import JobTrans from "../../types/JobTrans/jobtrans-types";

function JobApprove() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [jobList, setjobList] = useState<IJob[]>([]);
  const [userList, setuserList] = useState<iUserAPI[]>([]);
  const [jobListSelected, setjobListSelected] = useState<IJob | undefined>(
    undefined
  );
  const [selectedItem, setselectedItem] = useState<string>("");
  const [selectedUser, setselectedUser] = useState<string>("");
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [isModalOpen, setisModalOpen] = useState<boolean>(false);
  const [isBtnApproveLoading, setisBtnApproveLoading] =
    useState<boolean>(false);
  const [reason, setreason] = useState<string>("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const jobCtx = useContext(JobContext);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    console.log("fetch data");
    axios
      .get(`${API_URL}/job/wait-approve`)
      .then((res: AxiosResponse) => {
        //   console.log(res.data);
        setjobList(res.data);
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
    axios
      .get(`${API_URL}/users`)
      .then((res: AxiosResponse) => {
        //   console.log(res.data);
        setuserList(res.data);
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });

    return () => {
      setjobList([]);
    };
  }, [isBtnApproveLoading]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      axios
        .get(`${API_URL}/job/wait-approve`)
        .then((res: AxiosResponse) => {
          //   console.log(res.data);
          setjobList(res.data);
        })
        .catch((error: AxiosError) => console.log(error));
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const jobSelected = jobList.find((job) => selectedItem === job._id);
    if (jobSelected) {
      setjobListSelected(jobSelected);
      return;
    }
    console.log("No job selected!");
    return () => {
      setjobListSelected(undefined);
    };
  }, [selectedItem]);

  function handleListItemClick(job_id: string) {
    if (job_id) {
      setselectedItem(job_id);
    }
  }

  function onOpenModal(): void {
    setisModalOpen(true);
  }
  function onCloseModal(): void {
    setisModalOpen(false);
  }

  async function handleApproveButtonClick() {
    console.log("approve");
    let job_no: string = "";
    let changeStatusJob: boolean = false;
    let insertJobTrans: boolean = false;
    let err_msg: string = "";
    setisBtnApproveLoading(true);
    const name = userList.find((user) => user._id === selectedUser);
    const jobId = selectedItem;
    console.log(selectedItem);
    if (jobId) {
      await axios
        .put(`${API_URL}/job/${jobId}`, {
          status: "in progress",
          responsible_staff: name,
          approved_by: authCtx?.userData?._id,
        })
        .then((res: AxiosResponse) => {
          if (res.status === 200) {
            job_no = res.data?.queryRes?.job_no;
            jobCtx?.decreaseJobApproveCount();
            changeStatusJob = true;
            onCloseModal();
            setjobListSelected(undefined);
            setselectedUser("");
            return;
          }
        })
        .catch((error: AxiosError) => {
          console.log("approve error", error);
        });
    }

    //TODO insert to job transaction table
    const jobTransObj: JobTrans = {
      job_id: jobId,
      approved_by: authCtx?.userData?._id,
      approved_at: moment().format(),
    };
    await axios
      .post(`${API_URL}/jobtrans`, jobTransObj)
      .then((res: AxiosResponse) => {
        if (res.status === 200) {
          insertJobTrans = true
        }
      })
      .catch((error: AxiosError) => {
        console.log("insert jobtrans error", error);
      });

    console.log(changeStatusJob, insertJobTrans, job_no);
    if (changeStatusJob && insertJobTrans) {
      toast({
        title: `อนุมัติ Job หมายเลข ${job_no} สำเร็จ`,
        status: "success",
        position: "bottom-right",
        isClosable: true,
        duration: 3000,
      });
      setselectedItem("");
      setisBtnApproveLoading(false);
      return;
    }
    if (!changeStatusJob && !insertJobTrans) {
      err_msg = "ไม่สามารถอัพเดทและบันทึก job";
    } else if (!changeStatusJob) {
      err_msg = "อัพเดท job status ไม่สำเร็จ!";
    } else if (!insertJobTrans) {
      err_msg = "ไม่สามารถบันทึก job!";
    }
    toast({
      title: "เกิดข้อผิดพลาดบางอย่าง",
      description: err_msg,
      status: "error",
      isClosable: true,
      duration: 99999,
      onCloseComplete: () => {
        setisBtnApproveLoading(false);
      },
    });
  }

  function handleRejectButtonClick(jobId: string) {
    let changeStatusJob: boolean = false;
    let insertJobTrans: boolean = false;
    //TODO change job status to 'rejected' and reason
    axios.put(`${API_URL}/job/${jobId}`, {
      status: "rejected",
      reason,
    });
    //TODO insert to job transaction table
    console.log(`reject : ${reason}`);
    setisLoading(true);
    onClose();

    setTimeout(() => {
      //Reset
      setreason("");
      toast({
        title: "บันทึกข้อมูลสำเร็จ",
        status: "success",
        isClosable: true,
        duration: 3000,
        position: "bottom-right",
      });
      setisLoading(false);
    }, 3000);
  }

  function handleReasonInputChange(value: string) {
    setreason(value);
  }

  return (
    <Flex gap={5}>
      <Flex mt={3} position="sticky" top={0} left={0}>
        <List
          h="95vh"
          m={2}
          w="xs"
          borderWidth={1}
          borderRadius={"md"}
          boxShadow={"0 2px 8px 0 rgba(0, 0, 0, 0.18)"}
          overflowY="auto"
        >
          {jobList.length < 1 ? (
            <Box p={5}>
              <Text fontWeight={"semibold"} color="gray.600">
                No job waiting for approve.
              </Text>
            </Box>
          ) : (
            jobList.map((job, idx) => (
              <ListItem
                key={job._id as Key}
                display={"flex"}
                justifyContent="space-between"
                alignItems={"center"}
                p={2}
                borderBottomWidth={1}
                color={"gray.600"}
                _hover={{ bgColor: "blackAlpha.300" }}
                bgColor={selectedItem === job._id ? "blackAlpha.300" : "white"}
                borderTopRadius={idx === 0 ? "md" : "none"}
                onClick={() => handleListItemClick(job?._id)}
                cursor="pointer"
              >
                {job.topic}
                {selectedItem === job._id ? null : (
                  <ListIcon as={ChevronRightIcon} />
                )}
              </ListItem>
            ))
          )}
        </List>
      </Flex>
      <Flex my={5} mr={5} w="full" overflowY={"auto"}>
        {jobListSelected ? (
          <Flex w="100%" py={3}>
            <Stack color="gray.700" w="inherit">
              <Section
                children={
                  <>
                    <MyContent
                      jobData={jobListSelected}
                      handleRejectButtonClick={handleRejectButtonClick}
                      handleReasonInputChange={handleReasonInputChange}
                      reason={reason}
                      isLoading={isLoading}
                      isBtnApproveLoading={isBtnApproveLoading}
                      isOpen={isOpen}
                      onOpen={onOpen}
                      onClose={onClose}
                      onOpenModal={onOpenModal}
                    />
                  </>
                }
              />
            </Stack>
          </Flex>
        ) : null}
      </Flex>

      {/* Approve Modal*/}
      <Modal isOpen={isModalOpen} onClose={onCloseModal} isCentered size={"lg"}>
        <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(7px)" />
        <ModalContent>
          <ModalHeader>Choose staff for the job</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ButtonGroup
              variant={"outline"}
              display="flex"
              flexDirection={{ base: "row", sm: "column", md: "row" }}
              gap={2}
            >
              {userList
                .filter((user) => user.department.toUpperCase() === "COMPUTER")
                .map((user) => (
                  <Button
                    key={user._id as Key}
                    onClick={() => setselectedUser(user._id)}
                    colorScheme={
                      selectedUser === user._id ? "messenger" : "gray"
                    }
                    rightIcon={
                      selectedUser === user._id ? <CheckIcon /> : undefined
                    }
                  >
                    {user.name}
                  </Button>
                ))}
            </ButtonGroup>
          </ModalBody>
          <ModalFooter w="full" gap={3}>
            <Button
              variant={"solid"}
              colorScheme="teal"
              isDisabled={selectedUser ? false : true}
              onClick={handleApproveButtonClick}
              isLoading={isBtnApproveLoading}
              loadingText="ยืนยัน"
            >
              ยืนยัน
            </Button>
            <Button
              variant={"outline"}
              colorScheme="red"
              onClick={onCloseModal}
            >
              ยกเลิก
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default JobApprove;

function Section({ children }: { children: ReactNode | ReactNode[] }) {
  return <Box pb={5}>{children}</Box>;
}

function MyHeading({ text }: TJobHeading) {
  return (
    <Heading
      fontSize={"md"}
      color="gray.700"
      px={3}
      py={1}
      bgColor="blackAlpha.300"
      borderRadius={"md"}
    >
      {text}
    </Heading>
  );
}

function MyContent({
  jobData,
  handleReasonInputChange,
  handleRejectButtonClick,
  reason,
  isLoading,
  isBtnApproveLoading,
  isOpen,
  onOpen,
  onOpenModal,
  onClose,
}: TJobContent) {
  return (
    <>
      <Section
        children={
          <>
            <MyHeading text="รายละเอียด" />
            <Stack
              justifyContent={"space-between"}
              px={7}
              color="gray.600"
              fontSize={14}
              mt={3}
              spacing={5}
            >
              <Flex>
                <Flex flex={0.2}>
                  <Text>Job Number</Text>
                </Flex>
                <Flex flex={0.8}>
                  <Text>{jobData.job_no}</Text>
                </Flex>
              </Flex>
              <Flex>
                <Flex flex={0.2}>
                  <Text>หัวข้อ</Text>
                </Flex>
                <Flex flex={0.8}>
                  <Text>{jobData.topic}</Text>
                </Flex>
              </Flex>
              <Flex>
                <Flex flex={0.2}>
                  <Text>รายละเอียด1</Text>
                </Flex>
                <Flex flex={0.8}>
                  <Text>{jobData.job_detail_1}</Text>
                </Flex>
              </Flex>
              <Flex>
                <Flex flex={0.2}>
                  <Text>รายละเอียด2</Text>
                </Flex>
                <Flex flex={0.8}>
                  <Text>{jobData.job_detail_2}</Text>
                </Flex>
              </Flex>
              <Flex>
                <Flex flex={0.2}>
                  <Text>ผู้ร้องขอ</Text>
                </Flex>
                <Flex flex={0.8}>
                  <Text>{jobData.staff_req.name}</Text>
                </Flex>
              </Flex>
              <Flex>
                <Flex flex={0.2}>
                  <Text>แผนก</Text>
                </Flex>
                <Flex flex={0.8}>
                  <Text>{jobData.department_req}</Text>
                </Flex>
              </Flex>
              <Flex>
                <Flex flex={0.2}>
                  <Text>สถานะ</Text>
                </Flex>
                <Flex flex={0.8}>
                  <Text>{jobData.status}</Text>
                </Flex>
              </Flex>
              <Flex>
                <Flex flex={0.2}>
                  <Text>สร้างเมื่อ</Text>
                </Flex>
                <Flex flex={0.8}>
                  <Text>
                    {moment(jobData.createdAt).format("DD/MM/YYYY HH:mm")}
                  </Text>
                </Flex>
              </Flex>
            </Stack>
          </>
        }
      />
      <Section
        children={
          <>
            <MyHeading text="Loss" />
            <Stack
              justifyContent={"space-between"}
              px={7}
              color="gray.600"
              fontSize={14}
              mt={3}
              spacing={5}
            >
              <Flex>
                <Flex flex={0.2}>
                  <Text>
                    Ref Loss Number &<br /> Cost Reduction
                  </Text>
                </Flex>
                <Flex flex={0.8}>
                  <Text>{jobData.ref_loss_cost_reduction}</Text>
                </Flex>
              </Flex>
              <Flex>
                <Flex flex={0.2}>
                  <Text>Share Cost</Text>
                </Flex>
                <Flex flex={0.8}>
                  <Text>{jobData.share_cost}</Text>
                </Flex>
              </Flex>
            </Stack>
          </>
        }
      />
      <Section
        children={
          <>
            <MyHeading text="ผู้จัดการอนุมัติ" />
            <Stack
              justifyContent={"space-between"}
              px={7}
              color="gray.600"
              fontSize={14}
              mt={3}
              spacing={5}
            >
              <Flex gap={5}>
                <Button
                  alignItems={"center"}
                  variant={"solid"}
                  colorScheme="teal"
                  leftIcon={<CheckIcon w={3} h={3} />}
                  onClick={onOpenModal}
                >
                  อนุมัติ
                </Button>
                <Popover isOpen={isOpen} onClose={onClose}>
                  <PopoverTrigger>
                    <Button
                      alignItems={"center"}
                      variant={"solid"}
                      colorScheme="red"
                      leftIcon={
                        isLoading ? <Spinner /> : <CloseIcon w={3} h={3} />
                      }
                      onClick={onOpen}
                      isLoading={isLoading}
                      loadingText="ไม่อนุมัติ"
                    >
                      ไม่อนุมัติ
                    </Button>
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent
                      bgColor={"#1c3c4e"}
                      borderColor="#1c3c4e"
                      color="white"
                      blur={"10px"}
                    >
                      <PopoverArrow />
                      <PopoverHeader border={"none"} color="#4ac2c0">
                        หมายเหตุ
                      </PopoverHeader>
                      <PopoverCloseButton onClick={onClose} />
                      <PopoverBody>
                        <FormControl>
                          <Textarea
                            borderTopRadius={"sm"}
                            borderColor="#4ac2c0"
                            size="sm"
                            onChange={(e) =>
                              handleReasonInputChange(e.target.value)
                            }
                            placeholder="ใส่หมายเหตุที่นี่..."
                          />
                        </FormControl>
                      </PopoverBody>
                      <PopoverFooter
                        display={"flex"}
                        justifyContent="end"
                        border={"none"}
                      >
                        <Button
                          variant={"outline"}
                          color="#4ac2c0"
                          borderColor="#2d7675"
                          size={"sm"}
                          onClick={() => handleRejectButtonClick(jobData?._id)}
                          _hover={{ bgColor: "rgb(45, 118, 117, 0.5)" }}
                          disabled={reason.length < 1 ? true : false}
                        >
                          ตกลง
                        </Button>
                      </PopoverFooter>
                    </PopoverContent>
                  </Portal>
                </Popover>
              </Flex>
            </Stack>
          </>
        }
      />
    </>
  );
}
