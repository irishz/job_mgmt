import {
  Badge,
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  Stack,
  Text,
  Tooltip,
  useBoolean,
} from "@chakra-ui/react";
import { Key, useContext, useEffect, useState } from "react";
import AuthContext from "../Context/AuthContext";
import { BiLogOut } from "react-icons/bi";
import { Link, To, useLocation, useNavigate } from "react-router-dom";
import NavbarMenuList from "./NavbarData";
import JobContext from "../Context/JobContext";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

function AdminNav() {
  const authCtx = useContext(AuthContext);
  const jobCtx = useContext(JobContext);
  const [jobCount, setjobCount] = useState(jobCtx?.jobApproveCount);
  const location = useLocation();
  const [show, setshow] = useBoolean(false);
  const navigate = useNavigate();

  function handleLogout() {
    navigate("/", { replace: true });
    localStorage.removeItem("token");
    authCtx?.setuserToken("");
  }

  useEffect(() => {
    setjobCount(jobCtx?.jobApproveCount);
  }, [jobCtx]);

  return (
    <Flex
      left={0}
      top={0}
      w={"15%"}
      flexDirection={"column"}
      justifyContent={"space-between"}
      h="100vh"
      bgColor="gray.800"
      position={"sticky"}
    >
      {/* Nav Header */}
      <Flex justifyContent={"center"}>
        <Heading
          bgGradient="linear(to-r, #6274e7, #8752a3)"
          bgClip={"text"}
          fontSize={["x-small", "small", "md", "xl"]}
          my={3}
          px={2}
        >
          Job Management
        </Heading>
      </Flex>
      {/* Nav Body */}
      <Flex h="full" px={3} py={7} m={0}>
        <Stack w="full">
          {NavbarMenuList?.admin.map((menu) =>
            menu.name === "report" ? (
              <Stack
                key={menu.name as Key}
                onMouseEnter={setshow.on}
                onMouseLeave={setshow.off}
                mb={0}
              >
                <Tooltip label={menu.name} hasArrow>
                  <Flex
                    p={3}
                    key={menu?.name as Key}
                    w="full"
                    justifyContent={"space-between"}
                    _hover={{
                      bgColor: "whiteAlpha.300",
                    }}
                    bgColor={
                      location.pathname.includes("report")
                        ? "whiteAlpha.600"
                        : undefined
                    }
                    borderRadius={5}
                    alignItems={"center"}
                    color="white"
                  >
                    <Text display={"flex"} alignItems={"center"} gap={2}>
                      {menu.icon}
                      {menu.name_th}
                      {menu.name === "waiting approve" ? (
                        <Badge bgColor="tomato" color="white">
                          {jobCount}
                        </Badge>
                      ) : null}
                    </Text>
                    {show ? (
                      <ChevronUpIcon />
                    ) : (
                      <ChevronDownIcon transition={"all 2s linear"} />
                    )}
                  </Flex>
                </Tooltip>
                <Collapse in={show}>
                  {menu?.sub_menu?.map((item) => (
                    <Box
                      key={item.name as Key}
                      color="white"
                      bgColor={
                        location.pathname === item.url
                          ? "whiteAlpha.600"
                          : "whiteAlpha.300"
                      }
                      onClick={setshow.off}
                    >
                      <Link to={item.url as To}>
                        <Text>{item.name}</Text>
                      </Link>
                    </Box>
                  ))}
                </Collapse>
              </Stack>
            ) : (
              <Link key={menu.name as Key} to={menu.url as To}>
                <Text
                  p={3}
                  display={"flex"}
                  gap={2}
                  color="white"
                  bgColor={
                    location.pathname === menu.url
                      ? "whiteAlpha.600"
                      : undefined
                  }
                  alignItems={"center"}
                  borderRadius={5}
                  _hover={{
                    bgColor: "whiteAlpha.300",
                  }}
                >
                  {menu.icon}
                  {menu.name_th}
                  {menu.name === "waiting approve" ? (
                    <Badge bgColor="tomato" color="white">
                      {jobCount}
                    </Badge>
                  ) : null}
                </Text>
              </Link>
            )
          )}
        </Stack>
      </Flex>
      {/* Nav Footer */}
      <Flex borderTopWidth={1} borderTopColor="gray" w="full" py={2} px={4}>
        <Button
          w="full"
          variant={"ghost"}
          leftIcon={<BiLogOut />}
          colorScheme="red"
          onClick={handleLogout}
        >
          ออกจากระบบ
        </Button>
      </Flex>
    </Flex>
  );
}

export default AdminNav;
