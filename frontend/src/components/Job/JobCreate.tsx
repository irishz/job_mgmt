import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  List,
  ListItem,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  DragEvent,
  DragEventHandler,
  Key,
  MutableRefObject,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AuthContext from "../Context/AuthContext";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { SubmitHandler, useForm } from "react-hook-form";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import JobContext from "../Context/JobContext";
import { MdCloudUpload } from "react-icons/md";
import { useDropzone } from "react-dropzone";
import { IoMdImages } from "react-icons/io";
import { BsFileEarmarkTextFill } from "react-icons/bs";

function JobCreate() {
  const API_URL = import.meta.env.VITE_API_URL;
  const authCtx = useContext(AuthContext);
  const jobCtx = useContext(JobContext);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [fileList, setfileList] = useState<File[]>([]);
  const [programList, setprogramList] = useState<TProgramType[] | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      topic: "",
      staff_req: "",
      department_req: "",
      job_detail_1: "",
      job_detail_2: "",
      ref_loss_cost_reduction: "",
      share_cost: 0,
      status: "",
      job_type: "",
      attachments: undefined,
    },
  });
  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });
  const filesize = useMemo(() => renderFileSize(), [fileList]);
  const toast = useToast();
  const navigate = useNavigate();

  type JobInput = {
    topic: string;
    staff_req: string;
    department_req: string;
    job_detail_1: string;
    job_detail_2: string;
    ref_loss_cost_reduction: string;
    share_cost: number;
    status: string;
    job_type: string;
    attachments: File[] | undefined;
  };
  type TProgramType = {
    type: string;
  };

  function onDrop(acceptedFiles: File[]) {
    console.log(acceptedFiles);
    setfileList(acceptedFiles);
  }

  const onSubmit: SubmitHandler<JobInput> = (data) => {
    const {
      topic,
      job_detail_1,
      job_detail_2,
      ref_loss_cost_reduction,
      share_cost,
      job_type,
    } = data;
    let formData = data
    // let formData = new FormData();
    if (authCtx?.userData) {
      // formData.append("topic", topic);
      // formData.append("staff_req", authCtx?.userData?._id);
      // formData.append("department_req", authCtx?.userData?.department);
      // formData.append("job_detail_1", job_detail_1);
      // formData.append("job_detail_2", job_detail_2);
      // formData.append("ref_loss_cost_reduction", ref_loss_cost_reduction);
      // formData.append("share_cost", share_cost.toString());
      // formData.append("status", "wait for approve");
      // formData.append("job_type", job_type);
      // fileList.map((file) => formData.append("attachments", file));
      formData.staff_req = authCtx?.userData?._id;
      formData.department_req = authCtx?.userData?.department;
      formData.status = "wait for approve";
      formData.share_cost = data.share_cost;
    //   formData.attachments = fileList
    }
    console.log(formData);
    setisLoading(true);
    setTimeout(() => {
      setisLoading(false);
    }, 1000);

    // const config: AxiosRequestConfig = {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    //   },
    // };
    axios
      .post(`${API_URL}/job`, formData)
      .then((res: AxiosResponse) => {
        if (res) {
          toast({
            title: res.data.msg,
            description: "กำลังกลับไปยังหน้าหลัก",
            status: "success",
            duration: 3000,
          });
          setisLoading(false);
          setTimeout(() => {
            navigate(-1);
          }, 3000);
          jobCtx?.increaseJobApproveCount();
          return;
        }
      })
      .catch((error: AxiosError) => {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: error.message,
          status: "error",
          isClosable: true,
          duration: 10000,
        });
      });
  };

  useEffect(() => {
    axios.get(`${API_URL}/program`).then((res: AxiosResponse) => {
      setprogramList(res.data);
    });
  }, []);

  function handleDeleteFileClick(idx: number) {
    let tempList = [...fileList];
    tempList?.splice(idx, 1);

    setfileList(tempList);
  }

  function renderFileSize(): number {
    let size: number = fileList.reduce((a, b) => a + b.size, 0) / 1024 / 1024;
    return size;
  }

  return (
    <Box>
      <Container maxW={["container.sm", "container.md", "container.lg"]} p={5}>
        <Stack
          borderWidth={1}
          borderRadius={10}
          boxShadow="0 1px 4px 0 rgba( 31, 38, 135, 0.37 )"
          p={3}
          spacing={3}
        >
          <Heading textAlign={"center"} fontSize={32} color={"gray.600"}>
            คำร้องของานใหม่
          </Heading>
          <Divider borderWidth={1} />
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Grid gap={2} templateColumns={"repeat(12, 1fr)"}>
                {/* Topic */}
                <GridItem colSpan={6}>
                  <FormControl
                    flex={1}
                    isRequired
                    isInvalid={errors.topic ? true : false}
                  >
                    <FormLabel>ชื่อหัวข้อ</FormLabel>
                    <Input
                      {...register("topic", { required: "กรุณาใส่ชื่อหัวข้อ" })}
                      type="text"
                      autoFocus
                    />
                    <FormHelperText color={"red"}>
                      {errors.topic?.message}
                    </FormHelperText>
                  </FormControl>
                </GridItem>
                {/* Staff Req */}
                <GridItem colSpan={3}>
                  <FormControl flex={0.5} isReadOnly>
                    <FormLabel>ชื่อผู้ร้องขอ</FormLabel>
                    <Input
                      {...register("staff_req")}
                      type="text"
                      value={authCtx?.userData?.name}
                      color="gray.500"
                    />
                  </FormControl>
                </GridItem>
                {/* Department Req */}
                <GridItem colSpan={3}>
                  <FormControl flex={0.5}>
                    <FormLabel>แผนก</FormLabel>
                    <Input
                      {...register("department_req")}
                      type="text"
                      readOnly
                      value={authCtx?.userData?.department}
                      color="gray.500"
                    />
                  </FormControl>
                </GridItem>
                {/* Job Detail 1 */}
                <GridItem colSpan={6}>
                  <FormControl>
                    <FormLabel>รายละเอียด</FormLabel>
                    <Textarea {...register("job_detail_1")} />
                  </FormControl>
                </GridItem>
                {/* Job Detail 2 */}
                <GridItem colSpan={6}>
                  <FormControl>
                    <FormLabel>รายละเอียด 2</FormLabel>
                    <Textarea {...register("job_detail_2")} />
                  </FormControl>
                </GridItem>
                {/* File Upload */}
                <GridItem colSpan={12}>
                  {fileList.length < 1 ? (
                    <FormControl
                      h="auto"
                      minHeight={200}
                      as={VStack}
                      borderStyle="dashed"
                      borderWidth={2}
                      borderColor={isDragActive ? "teal" : "gray.400"}
                      rounded={"lg"}
                      alignItems={"center"}
                      justifyContent="center"
                      gap={2}
                      py={3}
                      {...getRootProps()}
                    >
                      <MdCloudUpload size={50} color="teal" />
                      <FormLabel
                        fontSize={24}
                        fontWeight={"semibold"}
                        textAlign="center"
                      >
                        ลากไฟล์มาวางที่นี่
                        <Text
                          fontSize={16}
                          fontWeight="normal"
                          color={"gray.600"}
                        >
                          ประเภทไฟล์ที่รองรับ: PDF, XDW, JPEG, PNG.
                        </Text>
                      </FormLabel>
                      <Box textAlign={"center"}>
                        <Button
                          variant={"outline"}
                          colorScheme={"teal"}
                          onClick={open}
                        >
                          เลือกไฟล์
                        </Button>
                        <Text>ขนาดไฟล์สูงสุด: 10 MB</Text>
                      </Box>
                      <input
                        type={"file"}
                        {...getInputProps({
                          onChange: () => {
                            console.log("file changed");
                          },
                        })}
                      />
                    </FormControl>
                  ) : (
                    <Box w="full" px={5}>
                      <List display={"flex"} flexWrap="wrap" gap={2}>
                        {fileList?.map((file, idx) => (
                          <ListItem
                            key={file.name}
                            display={"inline-flex"}
                            borderWidth={1}
                            borderColor="gray.800"
                            p={1}
                            rounded="md"
                            gap={1}
                            alignItems="center"
                            _hover={{
                              borderColor: "blue.500",
                              color: "blue.500",
                            }}
                          >
                            {file.type.includes("image") ? (
                              <IoMdImages />
                            ) : (
                              <BsFileEarmarkTextFill />
                            )}
                            <Text>{file.name}</Text>
                            <CloseIcon
                              fontSize={"0.7em"}
                              _hover={{ color: "red" }}
                              onClick={() => handleDeleteFileClick(idx)}
                            />
                          </ListItem>
                        ))}
                      </List>
                      <Box
                        mt={3}
                        display="flex"
                        justifyContent={"space-between"}
                      >
                        <Text>
                          ไฟล์ทั้งหมด: <strong>{fileList.length}</strong> ไฟล์
                        </Text>
                        <Text>
                          ขนาด: <strong>{filesize.toFixed(2)} MB</strong>
                        </Text>
                      </Box>
                    </Box>
                  )}
                </GridItem>
              </Grid>
              <Button
                type="submit"
                variant={"solid"}
                leftIcon={<AddIcon fontSize={"1.2em"} />}
                colorScheme="orange"
                isLoading={isLoading}
                loadingText="กำลังดำเนินการ"
              >
                ร้องของานใหม่
              </Button>
            </Stack>
          </form>
        </Stack>
      </Container>
    </Box>
  );
}

export default JobCreate;
