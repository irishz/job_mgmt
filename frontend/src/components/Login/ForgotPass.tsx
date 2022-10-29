import { SmallCloseIcon } from "@chakra-ui/icons";
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
  Stack,
  useToast,
} from "@chakra-ui/react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import IPasswordReset from "../../types/password-reset-types";

function ForgotPass() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [isBtnLoading, setisBtnLoading] = useState(false);
  const [isProcessing, setisProcessing] = useState(false);
  const [notFoundUser, setnotFoundUser] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IPasswordReset>();
  const navigate = useNavigate();
  const toast = useToast();
  useMemo(() => {return checkEmployeeCode}, [])

  const onSubmit: SubmitHandler<IPasswordReset> = async (data) => {
    setisBtnLoading(true);
    setTimeout(() => {}, 2000);
    console.log(data);
    axios
      .put(`${API_URL}/users/resetpassword`, data)
      .then((res: AxiosResponse) => {
        if (res.status === 200) {
          setisBtnLoading(true);
          toast({
            title: res.data.msg,
            description: "กำลังกลับไปยังหน้า เข้าสู่ระบบ",
            status: "success",
            duration: 2000,
            onCloseComplete: () => navigate("/", { replace: true }),
          });
        }
      });
  };

  function checkEmployeeCode() {
    setisProcessing(true);
    axios
      .get(`${API_URL}/users/getuser-empcode/${watch("employee_code") || "1"}`)
      .then((res) => {
        if (res.data.msg === "เกิดข้อผิดพลาด, ไม่พบผู้ใช้!") {
          toast({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่พบข้อมูล, กุรณาตรวจสอบรหัสพนักงาน",
            status: "error",
            isClosable: true,
          });
          setnotFoundUser(true);
          setisProcessing(false);
          return;
        }
        console.log("user found");
        setnotFoundUser(false);
        setisProcessing(false);
      });
  }

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
            <Heading color="gray.700">เปลี่ยนรหัสผ่าน</Heading>
          </Box>
          {/* Input */}
          <FormControl>
            <FormLabel color="gray.700">รหัสพนักงาน</FormLabel>
            <InputGroup>
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
                maxLength={7}
                placeholder="xxxxxxx"
                onBlur={checkEmployeeCode}
                color="gray.600"
              />
              {isProcessing ? (
                <InputRightElement
                  children={
                    <CircularProgress
                      isIndeterminate
                      size={"1.2em"}
                      color="gray"
                    />
                  }
                />
              ) : notFoundUser ? (
                <InputRightElement
                  children={
                    <SmallCloseIcon
                      w={5}
                      h={5}
                      rounded="full"
                      color={"red"}
                      bgColor="red.300"
                      p={0.5}
                    />
                  }
                />
              ) : null}
            </InputGroup>
            <FormHelperText color={"red"}>
              {errors.employee_code?.message}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel color="gray.700">รหัสผ่านใหม่</FormLabel>
            <Input
              {...register("new_password", {
                required: "กรุณาใส่รหัสผ่าน",
                minLength: { value: 6, message: "รหัสผ่านขั้นต่ำ 6 ตัวอักษร" },
              })}
              color="gray.600"
              bgColor={"whiteAlpha.700"}
              borderColor={errors.new_password ? "red.500" : "whiteAlpha.600"}
              type={"password"}
              placeholder="******"
            />
            <FormHelperText color="red">
              {errors.new_password?.message}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel color="gray.700">ยืนยันรหัสผ่าน</FormLabel>
            <Input
              {...register("confirm_password", {
                required: "กรุณาใส่รหัสผ่าน",
                validate: (value) =>
                  value === watch("new_password") || "รหัสผ่านไม่ตรงกัน",
              })}
              color="gray.600"
              bgColor={"whiteAlpha.700"}
              borderColor={
                errors.confirm_password ? "red.500" : "whiteAlpha.600"
              }
              type={"password"}
              placeholder="******"
            />
            <FormHelperText color="red">
              {errors.confirm_password?.message}
            </FormHelperText>
          </FormControl>
          {/* Login Button */}
          <HStack>
            <Button
              w={"50%"}
              type="submit"
              variant={"solid"}
              bgColor={isBtnLoading ? "#688DB7" : "#235185"}
              color="white"
              _hover={{ bgColor: "#1a3b61" }}
              boxShadow={"0 1px 4px 0 rgba(0,0,0, 0.37)"}
              isLoading={isBtnLoading}
              loadingText="เปลี่ยนรหัสผ่าน"
              disabled={notFoundUser ? true : false}
            >
              เปลี่ยนรหัสผ่าน
            </Button>
            <Button
              w="50%"
              variant={"outline"}
              colorScheme={"pink"}
              onClick={() => navigate("/", { replace: true })}
            >
              ยกเลิก
            </Button>
          </HStack>
        </Stack>
      </Flex>
    </form>
  );
}

export default ForgotPass;
