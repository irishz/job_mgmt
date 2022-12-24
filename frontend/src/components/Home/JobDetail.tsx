import {
  Button,
  Container,
  Flex,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import IJob from "../../types/Job/job-types";
import currency from "../../util/Currency";

function JobDetail() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const {
    job_no,
    topic,
    job_detail_1,
    job_detail_2,
    job_type,
    staff_req,
    department_req,
    ref_loss_cost_reduction,
    share_cost,
    status,
    createdAt,
  }: IJob = location.state;

  const [topicProp, settopicProp] = useState(topic);
  const [job_detail_1_Prop, setjob_detail_1_Prop] = useState(job_detail_1);
  const [job_detail_2_Prop, setjob_detail_2_Prop] = useState(job_detail_2);
  const [ref_loss_Prop, setref_loss_Prop] = useState(ref_loss_cost_reduction);
  const [share_cost_Prop, setshare_cost_Prop] = useState(share_cost);
  const toast = useToast();

  const handleUpdateClick = async () => {
    const updateObj = {
      topic: topicProp,
      job_detail_1: job_detail_1_Prop,
      job_detail_2: job_detail_2_Prop,
      ref_loss_cost_reduction: ref_loss_Prop,
      share_cost: share_cost_Prop,
    };

    const job_id = location.state._id;

    axios.put(`${API_URL}/job/${job_id}`, updateObj).then((res) => {
      if (res.status === 200) {
        toast({
          title: res.data.msg,
          description: "กำลังกลับไปยังหน้าหลัก",
          status: "success",
          onCloseComplete: () => navigate(-1),
          duration: 3000
        });
      }
    });
  };

  return (
    <Container
      maxWidth={[
        "container.sm",
        "container.md",
        "container.lg",
        "container.xl",
      ]}
      py={5}
    >
      <Heading fontSize={["14px", "16px", "18px", "20px"]}>
        Job Detail : {job_no}
      </Heading>
      <Flex direction={"column"} gap={2} m={2}>
        <Flex w={"60%"} p={2} direction="column" gap={2}>
          {/* Job Number */}
          <FormControl>
            <InputGroup>
              <InputLeftAddon children="Job Number" />
              <Input type={"text"} readOnly placeholder={job_no} />
            </InputGroup>
          </FormControl>
          {/* Topic */}
          <FormControl>
            <InputGroup>
              <InputLeftAddon children="Topic" />
              <Input
                type={"text"}
                onChange={(e) => settopicProp(e.target.value)}
                value={topicProp}
              />
            </InputGroup>
          </FormControl>
          {/* Detail #1 */}
          <FormControl>
            <InputGroup>
              <InputLeftAddon children="Detail #1" />
              <Textarea
                onChange={(e) => setjob_detail_1_Prop(e.target.value)}
                value={job_detail_1_Prop}
              />
            </InputGroup>
          </FormControl>
          {/* Detail #2 */}
          <FormControl>
            <InputGroup>
              <InputLeftAddon children="Detail #2" />
              <Textarea
                onChange={(e) => setjob_detail_2_Prop(e.target.value)}
                value={job_detail_2_Prop}
              />
            </InputGroup>
          </FormControl>
          {/* Ref loss cost reduction */}
          <FormControl>
            <InputGroup>
              <InputLeftAddon children="Ref loss" />
              <Input
                type={"text"}
                onChange={(e) => setref_loss_Prop(e.target.value)}
                value={ref_loss_Prop}
              />
            </InputGroup>
          </FormControl>
          {/* Share Cost */}
          <FormControl>
            <InputGroup>
              <InputLeftAddon children="Share Cost" />
              <Input
                type={"text"}
                onChange={(e) => setshare_cost_Prop(parseInt(e.target.value))}
                value={share_cost_Prop}
              />
              <InputRightAddon children={currency.th.symbol} />
            </InputGroup>
          </FormControl>
          {/* Status */}
          <FormControl>
            <InputGroup>
              <InputLeftAddon children="Status" />
              <Input type={"text"} readOnly value={status} color="gray.500" />
            </InputGroup>
          </FormControl>
          {/* CreatedAt */}
          <FormControl>
            <InputGroup>
              <InputLeftAddon children="Created At" />
              <Input
                color={"gray.500"}
                type={"text"}
                readOnly
                value={moment(createdAt).format("LLL")}
              />
            </InputGroup>
          </FormControl>
        </Flex>
      </Flex>
      <Flex gap={2}>
        <Button
          variant={"solid"}
          colorScheme={"purple"}
          type="submit"
          onClick={handleUpdateClick}
        >
          อัพเดท
        </Button>
        <Button
          // leftIcon={<ArrowLeftIcon />}
          variant={"solid"}
          colorScheme={"red"}
          onClick={() => navigate(-1)}
        >
          ย้อนกลับ
        </Button>
      </Flex>
    </Container>
  );
}

export default JobDetail;
