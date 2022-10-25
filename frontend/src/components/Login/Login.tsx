import { Button } from "@chakra-ui/button";
import {
  FormControl,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/form-control";
import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/layout";
import { Input, useToast } from "@chakra-ui/react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { NavigateFunction, useNavigate } from "react-router-dom";
import ICredentials from "../../types/credentials";
import { user } from "../../types/user-types";

function Login({ setuserToken }: user) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [isLoggingIn, setisLoggingIn] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICredentials>();
  const toast = useToast();
  const navigate: NavigateFunction = useNavigate();

  const onSubmit: SubmitHandler<ICredentials> = async (data) => {
    setisLoggingIn(true);
    // console.log(data);
    axios
      .post(`${API_URL}/users/login`, data)
      .then((res: AxiosResponse) => {
        if (res.status === 200) {
          console.log(res.data);
          setisLoggingIn(false);
          setuserToken(res.data.data.token);
          localStorage.setItem("token", res.data.data.token);
          navigate("/", { replace: true });
        }
      })
      .catch((error: AxiosError) => {
        // console.log(error)
        if (axios.isAxiosError(error) && error.response) {
          toast({
            title: `เกิดข้อผิดพลาด ${error.response?.statusText}: ${error.response.status}`,
            description: error.response?.data.msg,
            status: "error",
            isClosable: true,
            duration: 4000,
            variant: "left-accent",
          });
          setisLoggingIn(false);
        }
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
          w={["sm", "md", "lg", "xl"]}
          border={"2px solid rgba(255,255,255, 0.18)"}
          borderRadius={10}
          bgColor={"whiteAlpha.300"}
          boxShadow={"0 8px 32px 0 rgba( 31, 38, 135, 0.37 )"}
          backdropFilter={"blur(1.5px)"}
        >
          {/* Logo Heading */}
          <Box textAlign={"center"}>
            <Heading color="gray.700">Job Management</Heading>
            <Text>เข้าสู่ระบบ</Text>
          </Box>
          {/* Input */}
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
              borderColor={errors.employee_code ? "red.500" : "whiteAlpha.600"}
              type={"text"}
              autoFocus
              maxLength={7}
            />
            <FormHelperText color={"red"}>
              {errors.employee_code?.message}
            </FormHelperText>
          </FormControl>
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
            />
            <FormHelperText color="red">
              {errors.password?.message}
            </FormHelperText>
          </FormControl>
          {/* Login Button */}
          <Button
            type="submit"
            variant={"solid"}
            bgColor="#235185"
            color="white"
            _hover={{ bgColor: "#1a3b61" }}
            boxShadow={"0 1px 4px 0 rgba(0,0,0, 0.37)"}
            isLoading={isLoggingIn}
            loadingText="กำลังเข้าสู่ระบบ"
          >
            เข้าสู่ระบบ
          </Button>
        </Stack>
      </Flex>
    </form>
  );
}

export default Login;
