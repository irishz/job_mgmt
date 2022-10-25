import {
  Box,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IJob from "../../types/Job/job-types";

function AdminHome() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [jobList, setjobList] = useState<IJob[] | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`${API_URL}/job`).then((res) => {
      setjobList(res.data);
    });
  }, []);

  return (
    <Flex m={3} w="full">
      <Box>
        <TableContainer overflow={"auto"}>
          <Table size={"sm"} variant="simple">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>job no</Th>
                <Th>topic</Th>
                <Th>status</Th>
                <Th>% progress</Th>
                <Th>ref loss</Th>
                <Th>share cost</Th>
                <Th>staff req</Th>
                <Th>dept req</Th>
                <Th>est finish</Th>
                <Th>act finish</Th>
                <Th>approved by</Th>
                <Th>control by</Th>
                <Th>customize_cost</Th>
                <Th>staff responsible</Th>
              </Tr>
            </Thead>
            <Tbody>
              {jobList?.map((job, idx) => (
                <Tr
                  key={job._id}
                  _hover={{ bgColor: "gray.400", cursor: "pointer" }}
                  onClick={() => navigate("/myjob/edit", { state: job })}
                >
                  <Td>{idx + 1}</Td>
                  <Td>{job.job_no}</Td>
                  <Td>{job.topic}</Td>
                  <Td>{job.status}</Td>
                  <Td>{job.progress}</Td>
                  <Td>{job.ref_loss_cost_reduction}</Td>
                  <Td isNumeric>{job.share_cost}</Td>
                  <Td>{job.staff_req?.name}</Td>
                  <Td>{job.department_req}</Td>
                  <Td>{moment(job.est_finish_date).format("DD/MM/YYYY")}</Td>
                  <Td>{moment(job.act_finish_date).format("DD/MM/YYYY")}</Td>
                  <Td>{job.department_req}</Td>
                  <Td>{job.approved_by?.name}</Td>
                  <Td isNumeric>{job.customize_cost || 0}</Td>
                  <Td>{job.responsible_staff?.name}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Flex>
  );
}

export default AdminHome;
