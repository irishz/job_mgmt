import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
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
  Select,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios, { AxiosResponse } from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaSave } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import IJob from "../../types/Job/job-types";
import IProgram from "../../types/Program/ProgramTypes";
import currency from "../../util/Currency";
import optStatusList from "../../util/jobStatusList";
import ErrMessage from "./ErrMessage";

function JobEdit() {
  const API_URL = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const {
    _id,
    topic,
    job_no,
    job_detail_1,
    job_detail_2,
    staff_req,
    department_req,
    act_finish_date,
    est_finish_date,
    ref_loss_cost_reduction,
    share_cost,
    approved_by,
    control_by,
    customize_cost,
    responsible_staff,
    status,
    delay_reason,
    progress,
    job_type,
  }: IJob = location.state;
  const navigate = useNavigate();
  const [isBtnLoading, setisBtnLoading] = useState<boolean>(false);
  const [programList, setprogramList] = useState<IProgram[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      control_by: control_by || "",
      customize_cost: customize_cost || 0,
      status: status || "",
      delay_reason: delay_reason || "",
      act_finish_date: act_finish_date
        ? moment(est_finish_date).format("YYYY-MM-DD").toString()
        : "",
      est_finish_date: est_finish_date
        ? moment(est_finish_date).format("YYYY-MM-DD").toString()
        : "",
      job_type: job_type,
    },
  });
  const toast = useToast();

  type FormInput = {
    est_finish_date: string;
    act_finish_date: string;
    control_by: string;
    customize_cost: number;
    status: string;
    progress?: number;
    delay_reason: string;
    job_type: string;
  };

  useEffect(() => {
    axios.get(`${API_URL}/program`).then((res: AxiosResponse) => {
      setprogramList(res.data);
    });

    return () => {
      setprogramList([]);
    };
  }, []);

  function calProgress(status: string): number {
    return optStatusList.filter(({ name }) => name === status)[0].percent;
  }

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    const jobProgress = calProgress(data.status);
    const formData = Object.assign({ progress: jobProgress }, data);
    console.log(formData);
    setisBtnLoading(true);
    axios.put(`${API_URL}/job/${_id}`, formData).then((res) => {
      setisBtnLoading(false);
      toast({
        title: res.data.msg,
        description: "กำลังกลับไปยังหน้าก่อนหน้า...",
        position: "bottom-right",
        status: "success",
        duration: 3000,
        onCloseComplete: () => navigate(-1),
      });
    });
  };

  return (
    <Flex m={5} direction="column" justifyContent={"space-between"} gap={4}>
      <Heading>
        {topic} ({job_no})
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)} id="job-form">
        <Grid templateColumns={"repeat(12, 1fr)"} gap={3}>
          <GridItem colSpan={5}>
            <FormControl>
              <FormLabel>Detail #1</FormLabel>
              <Textarea
                defaultValue={job_detail_1}
                readOnly
                color={"gray.500"}
                bgColor={"gray.100"}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={5}>
            <FormControl>
              <FormLabel>Detail #2</FormLabel>
              <Textarea
                defaultValue={job_detail_2}
                readOnly
                bgColor={"gray.100"}
                color={"gray.500"}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>Approved By</FormLabel>
              <Input
                readOnly
                placeholder={approved_by?.name}
                bgColor={"gray.100"}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>Staff Request</FormLabel>
              <Input
                readOnly
                placeholder={staff_req?.name}
                bgColor={"gray.100"}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>Department Request</FormLabel>
              <Input
                readOnly
                placeholder={department_req}
                bgColor={"gray.100"}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={3} display="flex" gap={2}>
            <Divider
              orientation="vertical"
              borderWidth={2}
              w="0"
              borderColor={"gray.400"}
            />
            <FormControl>
              <FormLabel>Ref loss number</FormLabel>
              <Input
                readOnly
                placeholder={ref_loss_cost_reduction}
                bgColor={"gray.100"}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>Share Cost</FormLabel>
              <InputGroup>
                <Input
                  readOnly
                  placeholder={share_cost.toString()}
                  bgColor={"gray.100"}
                />
                <InputRightAddon children={currency.th.symbol} />
              </InputGroup>
            </FormControl>
          </GridItem>
          <GridItem colSpan={2} display="flex" gap={2}>
            <Divider
              orientation="vertical"
              borderWidth={2}
              w="0"
              borderColor={"gray.400"}
            />
            <FormControl>
              <FormLabel>Staff Responsible</FormLabel>
              <Input
                readOnly
                placeholder={responsible_staff?.name}
                bgColor={"gray.100"}
              />
            </FormControl>
          </GridItem>

          {/* Divider */}
          <GridItem colSpan={12}>
            <Flex align="center">
              <Divider />
              <Text px="2" whiteSpace={"nowrap"} fontWeight="bold">
                Input Form
              </Text>
              <Divider my={5} />
            </Flex>
          </GridItem>

          {/* Input Section */}
          <GridItem colSpan={3}>
            <FormControl>
              <FormLabel>
                Estimate Finish Date
              </FormLabel>
              <Input
                borderColor={errors.est_finish_date ? "red.400" : "#dfe5ec"}
                type={"date"}
                {...register("est_finish_date", {
                  required: "กรุณาใส่วันที่คาดว่าจะเสร็จ!",
                  min: {
                    value: moment().format(),
                    message: 'วันที่คาดว่าจะเสร็จต้องมากกว่าวันปัจจุบัน'
                  }
                })}
              />
              <ErrMessage message={errors.est_finish_date?.message} />
            </FormControl>
          </GridItem>
          <GridItem colSpan={3}>
            <FormControl>
              <FormLabel>Actual Finish Date</FormLabel>
              <Input
                borderColor={errors.act_finish_date ? "red.400" : "#dfe5ec"}
                type={"date"}
                {...register("act_finish_date", {
                  required:
                    watch("status") === "User Training"
                      ? "กรุณาใส่วันที่ทำเสร็จ"
                      : false,
                })}
                defaultValue=""
              />
              <ErrMessage message={errors.act_finish_date?.message} />
            </FormControl>
          </GridItem>
          <GridItem colStart={7} colEnd={10}>
            <FormControl>
              <FormLabel>Job Type</FormLabel>
              <Select
                borderColor={errors.job_type ? "red.400" : "#dfe5ec"}
                {...register("job_type", { required: "กรุณาเลือกประเภท" })}
                placeholder={job_type || "Please select type!"}
              >
                {programList.length > 0
                  ? programList.map(({ type }) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))
                  : null}
              </Select>
              <ErrMessage message={errors.job_type?.message} />
            </FormControl>
          </GridItem>
          <GridItem colSpan={2} />
          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>Job Control By</FormLabel>
              <Select
                borderColor={errors.control_by ? "red.400" : "#dfe5ec"}
                {...register("control_by", {
                  required: "กรุณาเลือกผู้รับผิดชอบ!",
                })}
              >
                <option value="computer-staff">Computer Staff</option>
                <option value="outsource">Outsource</option>
              </Select>
              <ErrMessage message={errors.control_by?.message} />
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl
              isDisabled={watch("control_by") === "outsource" ? false : true}
            >
              <FormLabel>Customize Cost</FormLabel>
              <InputGroup>
                <Input
                  type={"number"}
                  {...register("customize_cost")}
                  min={0}
                />
                <InputRightAddon children={currency.th.symbol} />
              </InputGroup>
            </FormControl>
          </GridItem>
          <GridItem colSpan={3}>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                {...register("status", { required: "Please select status!" })}
              >
                {optStatusList.map(({ name, percent }) => (
                  <option value={name} key={name}>
                    {name} ({percent}%)
                  </option>
                ))}
              </Select>
              <FormHelperText color={"tomato"}>
                {errors.status?.message}
              </FormHelperText>
            </FormControl>
          </GridItem>
          <GridItem colSpan={5}>
            <FormControl>
              <FormLabel>Reason for delay</FormLabel>
              <Textarea
                borderColor={errors.delay_reason ? "red.400" : "#dfe5ec"}
                placeholder="Delay reason..."
                {...register("delay_reason", {
                  required:
                    moment(watch("act_finish_date")).diff(
                      watch("est_finish_date"),
                      "day"
                    ) > 0
                      ? "กรุณาใส่เหตุผลที่งานล่าช้า"
                      : false,
                })}
              />
              <ErrMessage message={errors.delay_reason?.message} />
            </FormControl>
          </GridItem>
        </Grid>
      </form>
      <Box display="flex" gap={3}>
        <Button
          w={"full"}
          variant={"solid"}
          colorScheme={"teal"}
          leftIcon={<FaSave />}
          isLoading={isBtnLoading}
          loadingText="กำลังบันทึกข้อมูล"
          type="submit"
          form="job-form"
        >
          Save
        </Button>
        <Button
          w={"full"}
          variant={"solid"}
          colorScheme={"red"}
          leftIcon={<ChevronLeftIcon />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>
    </Flex>
  );
}
export default JobEdit;
