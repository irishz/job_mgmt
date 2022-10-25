import React, { useEffect, useState, useContext } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import {
  Box,
  Button,
  Container,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import AuthContext from "../Context/AuthContext";
import moment from "moment";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import JobContext from "../Context/JobContext";
import IJob from "../../types/Job/job-types";
import { Link } from "react-router-dom";

function Home() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [jobList, setjobList] = useState<IJob[] | null>(null);
  const [isJobDelete, setisJobDelete] = useState<boolean>(false);
  const authCtx = useContext(AuthContext);
  const jobCtx = useContext(JobContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const userId = authCtx?.userData?._id;
    if (userId) {
      axios.get(`${API_URL}/job/user/${userId}`).then((res) => {
        setjobList(res.data);
      });
    }
  }, [isJobDelete]);

  function processDeleteJob(job_id: string) {
    const jobToDeleteId = jobList?.find((job) => job._id === job_id)?._id;
    axios
      .delete(`${API_URL}/job/${jobToDeleteId}`)
      .then((res: AxiosResponse) => {
        toast({
          title: res.data.msg,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setisJobDelete(true);
        jobCtx?.decreaseJobApproveCount();
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
    onClose();
  }

  return (
    <Box>
      <Container
        maxW={["container.sm", "container.md", "container.xl"]}
      >
        <Heading fontSize={"2xl"} color="gray.600" mb={5}>
          ยินดีต้อนรับ, คุณ{authCtx?.userData?.name}
        </Heading>

        <TableContainer
          display={"block"}
          overflowX="auto"
        >
          <Table variant={"striped"} size="sm">
            <TableCaption>งานทั้งหมด: {jobList?.length}</TableCaption>
            <Thead>
              <Tr>
                <Th>ลำดับ</Th>
                <Th textAlign={'center'}>JobNo</Th>
                <Th textAlign={'center'}>หัวข้อ</Th>
                <Th textAlign={'center'}>รายละเอียด 1</Th>
                <Th textAlign={'center'}>ประเภท</Th>
                <Th textAlign={'center'}>ผู้ร้องขอ</Th>
                <Th textAlign={'center'}>แผนก</Th>
                <Th textAlign={'center'}>สถานะ</Th>
                <Th textAlign={'center'}>สร้างเมื่อ</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody whiteSpace={'pre-wrap'}>
              {jobList?.map((job, idx) => (
                <Tr
                  key={job._id}
                  borderLeftWidth={2}
                  borderColor={
                    job.status === "in progress"
                      ? "orange"
                      : job.status === "wait for approve"
                      ? "blue.400"
                      : "teal"
                  }
                >
                  <Td textAlign={"center"}>{idx + 1}</Td>
                  <Td
                    textAlign={"center"}
                    textDecoration="underline"
                    textUnderlineOffset={3}
                    color="blue.600"
                    _hover={{ color: "blue.500" }}
                    maxWidth={80}
                  >
                    <Link to="/job/detail" state={job}>
                      <Text>{job.job_no}</Text>
                    </Link>
                  </Td>
                  <Td textAlign={"center"} maxWidth={150}>{job.topic}</Td>
                  <Td overflowWrap={"break-word"}>
                    <Text noOfLines={2} maxWidth={170}>{job.job_detail_1}</Text>
                  </Td>
                  <Td>{job.job_type}</Td>
                  <Td>{job.staff_req.name}</Td>
                  <Td>{job.department_req}</Td>
                  <Td>{job.status}</Td>
                  <Td>{moment(job.createdAt).format("DD/MM/YYYY HH:mm A")}</Td>
                  <Td display="inline-flex">
                    <EditIcon
                      w={4}
                      h={4}
                      color="facebook"
                      _hover={{ color: "facebook.300" }}
                      mx={2}
                      // onClick={() => handleEditDeleteClick(data.id, "edit")}
                    />
                    <DeleteIcon
                      w={4}
                      h={4}
                      color="red"
                      _hover={{ color: "red.300" }}
                      onClick={onOpen}
                    />
                    <Modal isOpen={isOpen} onClose={onClose}>
                      <ModalOverlay bgColor={"blackAlpha.200"} />
                      <ModalContent>
                        <ModalHeader>ยืนยันการลบ Job</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <Text>
                            Job No : <strong>{job.job_no}</strong>
                          </Text>
                          <Text>
                            Topic : <strong>{job.topic}</strong>
                          </Text>
                        </ModalBody>
                        <ModalFooter display={"flex"} gap={3}>
                          <Button
                            variant={"solid"}
                            colorScheme="red"
                            leftIcon={<DeleteIcon />}
                            onClick={() => processDeleteJob(job._id)}
                          >
                            ลบ
                          </Button>
                          <Button variant={"outline"} onClick={onClose}>
                            ยกเลิก
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}

export default Home;
