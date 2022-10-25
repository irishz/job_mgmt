import { ArrowLeftIcon } from "@chakra-ui/icons";
import { Box, Button, Container, Flex, Heading, Text } from "@chakra-ui/react";
import moment, { MomentInput } from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import IJob from "../../types/Job/job-types";
import currency from "../../util/Currency";

function JobDetail() {
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
      <DataDetail name="JobNo" value={job_no} />
      <DataDetail name="Topic" value={topic} />
      <DataDetail name="Detail #1" value={job_detail_1} />
      <DataDetail name="Detail #2" value={job_detail_2} />
      <DataDetail name="Type" value={job_type} />
      <DataDetail name="Staff Request" value={staff_req.name} />
      <DataDetail name="Department Request" value={department_req} />
      <DataDetail name="Ref Loss No" value={ref_loss_cost_reduction} />
      <DataDetail name="Share Cost" value={share_cost} />
      <DataDetail name="Status" value={status} />
      <DataDetail name="Created At" value={moment(createdAt).format("LLL")} />
      <Button
        leftIcon={<ArrowLeftIcon />}
        variant={"solid"}
        colorScheme={"red"}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
    </Container>
  );
}

export default JobDetail;

interface DetailProps {
  name: string;
  value: string | number;
}

function DataDetail(Props: DetailProps) {
  return (
    <Flex
      gap={2}
      alignItems="center"
      borderColor={"gray.400"}
      borderWidth={1}
      borderRadius="md"
      my={2}
    >
      <Text
        bgColor={"gray.300"}
        borderLeftRadius="inherit"
        borderRightWidth={1}
        borderColor={"inherit"}
        py={1}
        px={2}
      >
        {Props.name} :{" "}
      </Text>
      <Text color={Props.value ? "gray.900": 'gray'}>
        {Props.value || "empty"} {Props.name === "Share Cost" ? currency.th.symbol : ""}
      </Text>
    </Flex>
  );
}
