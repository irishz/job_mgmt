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
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiLeftArrow } from "react-icons/bi";
import { BsArrowLeft, BsSave } from "react-icons/bs";
import { FaSave } from "react-icons/fa";
import { Form, useLocation, useNavigate } from "react-router-dom";
import IJob from "../../types/Job/job-types";
import currency from "../../util/Currency";
import optStatusList from "../../util/jobStatusList";

function JobEdit() {
    const API_URL = import.meta.env.VITE_API_URL
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
  }: IJob = location.state;
  const navigate = useNavigate();
  const [isBtnLoading, setisBtnLoading] = useState<boolean>(false);
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
      act_finish_date: moment(act_finish_date).format("YYYY-MM-DD").toString() || "",
      est_finish_date: moment(est_finish_date).format("YYYY-MM-DD").toString() || "",
    },
  });
  const toast = useToast()

  type FormInput = {
    est_finish_date: string,
    act_finish_date: string,
    control_by: string,
    customize_cost: number,
    status: string,
    progress?: number,
    delay_reason: string
  };

  function calProgress(status: string):number {
      return optStatusList.filter(({name}) => name === status)[0].percent
  }

  const onSubmit: SubmitHandler<FormInput> = (data) => {
      const jobProgress = calProgress(data.status)
    const formData = Object.assign({progress: jobProgress} ,data)
    console.log(formData);
    setisBtnLoading(true)
    axios.put(`${API_URL}/job/${_id}`, formData).then((res) => {
        setisBtnLoading(false)
        toast({
            title: res.data.msg,
            description: 'กำลังกลับไปยังหน้าก่อนหน้า...',
            position: 'bottom-right',
            status: 'success',
            duration: 3000,
            onCloseComplete: () => navigate(-1),
        })
    })
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
              <Text px="2" whiteSpace={"nowrap"}>
                Input Form
              </Text>
              <Divider />
            </Flex>
          </GridItem>

          {/* Input Section */}
          <GridItem colSpan={3}>
            <FormControl isRequired>
              <FormLabel>Estimate Finish Date</FormLabel>
              <Input type={'date'} {...register("est_finish_date", {required: 'Please select estimate finish date!'})}/>
            </FormControl>
          </GridItem>
          <GridItem colStart={5} colEnd={8}>
            <FormControl>
              <FormLabel>Actual Finish Date</FormLabel>
              <Input type={'date'} {...register("act_finish_date")} defaultValue=""/>
            </FormControl>
          </GridItem>
          <GridItem colSpan={4}>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>Job Control By</FormLabel>
              <Select
                {...register("control_by", {
                  required: "Please select job control by!",
                })}
              >
                <option value="computer-staff">Computer Staff</option>
                <option value="outsource">Outsource</option>
              </Select>
              <FormHelperText color={"tomato"}>
                {errors.control_by?.message}
              </FormHelperText>
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
                placeholder="Delay reason..."
                {...register("delay_reason")}
              />
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
