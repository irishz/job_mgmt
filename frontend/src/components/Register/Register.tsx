import {
  Box,
  Button,
  CircularProgress,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BsPersonPlusFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import ICreateUserForm from "../../types/create-user-types";
import RoleT from "../../types/role-types";

function Register() {
  const [isBtnSaveLoading, setisBtnSaveLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateUserForm>({});
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const roleList: RoleT = [
    {
      name: "ผู้ใช้ทั่วไป",
      value: "normal",
    },
    {
      name: "IT Staff",
      value: "admin",
    },
    {
      name: "ผู้จัดการ",
      value: "manager",
    },
  ];
  const toast = useToast();

  const onSubmit: SubmitHandler<ICreateUserForm> = async (data) => {
    setisBtnSaveLoading(true);
    axios.post(`${API_URL}/users`, data).then((res: AxiosResponse) => {
      if (res.data.msg === "รหัสพนักงานนี้มีในระบบอยู่แล้ว") {
        toast({
          title: res.data.msg,
          status: "error",
          isClosable: true,
          onCloseComplete: () => setisBtnSaveLoading(false),
        });
        return;
      }
      if (res.data.msg === "Data not found!") {
        toast({
          title: "เกิดข้อผิดพลาด!",
          description: "ไม่พบข้อมูล",
          status: "error",
          isClosable: true,
          onCloseComplete: () => setisBtnSaveLoading(false),
        });
        return;
      }
      setisBtnSaveLoading(false);
      toast({
        title: res.data.msg,
        description: "กำลังกลับไปยังหน้าเข้าสู่ระบบ",
        status: "success",
        duration: 3000,
        onCloseComplete: () => navigate("/", { replace: true }),
      });
    });
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Flex
        flexDirection="column"
        w="100wh"
        h="100vh"
        bgGradient="linear(to-br, #439cfb, #f187fb)"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          p={5}
          gap={2}
          w={"2xl"}
          border={"2px solid rgba(255,255,255, 0.18)"}
          borderRadius={10}
          bgColor={"whiteAlpha.300"}
          boxShadow={"0 8px 32px 0 rgba( 31, 38, 135, 0.37 )"}
          backdropFilter={"blur(1.5px)"}
        >
          {/* Logo Heading */}
          <Box textAlign={"center"}>
            <Heading color="gray.700">ละทะเบียน</Heading>
          </Box>
          {/* Input */}
          <Flex gap={3}>
            <FormControl>
              <FormLabel color="gray.700">รหัสพนักงาน</FormLabel>
              <Input
                {...register("employee_code", {
                  required: "กรุณาใส่รหัสพนักงาน",
                  minLength: {
                    value: 7,
                    message: "รหัสพนักงานเป็นตัวเลข 7 หลัก",
                  },
                })}
                bgColor={"whiteAlpha.700"}
                borderColor={
                  errors.employee_code ? "red.500" : "whiteAlpha.600"
                }
                type={"text"}
                autoFocus
                maxLength={7}
                placeholder="xxxxxxx"
              />
              <FormHelperText color={"red"}>
                {errors.employee_code?.message}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>ชื่อ</FormLabel>
              <Input
                type={"text"}
                bgColor="whiteAlpha.700"
                borderColor={errors.department ? "red" : "whiteAlpha.600"}
                {...register("name", { required: "กรุณาใส่ชื่อจริง" })}
              />
              <FormHelperText color={"red"}>
                {errors.name?.message}
              </FormHelperText>
            </FormControl>
          </Flex>
          <Flex gap={3}>
            <FormControl>
              <FormLabel>แผนก</FormLabel>
              <Input
                type={"text"}
                bgColor="whiteAlpha.700"
                {...register("department", { required: "กรุณาใส่แผนก" })}
                borderColor={errors.department ? "red" : "whiteAlpha.600"}
              />
              <FormHelperText color={"red"}>
                {errors.department?.message}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>ประเภทผู้ใช้</FormLabel>
              <Select
                bgColor={"whiteAlpha.700"}
                lineHeight="7"
                {...register("role")}
              >
                {roleList.map(({ name, value }) => (
                  <option value={value} key={value}>
                    {name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Flex>
          <FormControl>
            <FormLabel color="gray.700">รหัสผ่าน</FormLabel>
            <Input
              {...register("password", {
                required: "กรุณาใส่รหัสผ่าน",
                minLength: { value: 6, message: "รหัสผ่านขั้นต่ำ 6 ตัวอักษร" },
              })}
              bgColor={"whiteAlpha.700"}
              borderColor={errors.password ? "red.500" : "whiteAlpha.600"}
              type={"password"}
              placeholder="******"
            />
            <FormHelperText color="red">
              {errors.password?.message}
            </FormHelperText>
          </FormControl>
          {/* Login Button */}
          <HStack spacing={3}>
            <Button
              w={"50%"}
              type="submit"
              variant={"solid"}
              bgColor="#235185"
              color="white"
              _hover={{ bgColor: "#1a3b61" }}
              boxShadow={"0 1px 4px 0 rgba(0,0,0, 0.37)"}
              isLoading={isBtnSaveLoading}
              loadingText="ลงทะเบียน"
              leftIcon={<BsPersonPlusFill size={"1.2em"} />}
            >
              ลงทะเบียน
            </Button>
            <Button
              w={"50%"}
              variant={"outline"}
              colorScheme="pink"
              onClick={() => navigate(-1)}
            >
              ยกเลิก
            </Button>
          </HStack>
        </Stack>
      </Flex>
    </form>
  );
}

export default Register;
