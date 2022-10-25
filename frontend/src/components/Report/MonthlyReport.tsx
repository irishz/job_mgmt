import {
  Box,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios, { AxiosError, AxiosResponse } from "axios";
import moment, { MomentInput } from "moment";
import { Key, useEffect, useState } from "react";

function MonthlyReport() {
  const currYear: String = moment().format("YYYY");
  const lastYear: String = moment().add(-1, "year").format("YYYY");
  const [jobCount, setjobCount] = useState<number>(0);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/job`)
      .then((res: AxiosResponse) => {
        const count: number = res.data.length;
        setjobCount(count);
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  }, []);

  return (
    <Box gap={5}>
      <Box>
        <Heading my={3} color={"gray.600"}>
          Job order of computer department
        </Heading>
        <TableContainer>
          <Table variant={"striped"} size="sm">
            <Thead>
              <Tr>
                <Th rowSpan={2}>Description</Th>
                {/* Cueernt year - 1 */}
                <Th rowSpan={2}>{lastYear}</Th>
                <Th colSpan={12} textAlign="center">
                  Y{currYear}
                </Th>
              </Tr>
              <Tr>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item) => (
                  <Th key={item as Key}>
                    {moment().month(item).format("MMM")}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>1. % Job orders by Item</Td>
                <Td>-</Td>
                <Td>100</Td>
                <Td>100</Td>
                <Td>100</Td>
                <Td>100</Td>
                <Td>100</Td>
                <Td>100</Td>
                <Td>100</Td>
                <Td>100</Td>
                <Td>100</Td>
                <Td>100</Td>
                <Td>100</Td>
                <Td>100</Td>
              </Tr>
              <Tr>
                <Td>2. Job orders by Item</Td>
                <Td>-</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>30</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
              </Tr>
              <Tr>
                <Td>3. Remain + This month by Item</Td>
                <Td>-</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>30</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
              </Tr>
              <Tr>
                <Td>4. Complete by Item</Td>
                <Td>-</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>25</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
              </Tr>
              <Tr>
                <Td>5. Remain by Item</Td>
                <Td>-</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>5</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
              </Tr>
              <Tr>
                <Td>6.% Actual by Item</Td>
                <Td>-</Td>
                <Td>0%</Td>
                <Td>0%</Td>
                <Td>0%</Td>
                <Td>0%</Td>
                <Td>0%</Td>
                <Td>0%</Td>
                <Td>0%</Td>
                <Td>0%</Td>
                <Td>83.33%</Td>
                <Td>0%</Td>
                <Td>0%</Td>
                <Td>0%</Td>
              </Tr>
              <Tr>
                <Td>7. Remain(Item) / Month</Td>
                <Td>-</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>5</Td>
                <Td>0</Td>
                <Td>0</Td>
                <Td>0</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default MonthlyReport;
