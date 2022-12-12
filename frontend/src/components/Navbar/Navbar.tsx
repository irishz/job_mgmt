import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React, { Key, useContext } from "react";
import NavbarMenuList from "./NavbarData";
import AuthContext from "../Context/AuthContext";
import { Link, To, useNavigate } from "react-router-dom";
import { MdSettings } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";

function Navbar() {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    console.log('navigate to home')
    navigate("/", { replace: true });
    localStorage.removeItem("token");
    authCtx?.setuserToken("");
  }
  // console.log(authCtx.userData)
  return (
    <Flex
      justify={"space-between"}
      p={2}
      bgColor="#439cfb"
      color="white"
      alignItems={"center"}
      mb={5}
    >
      <Flex gap={3}>
        {authCtx?.userData?.role === "admin"
          ? NavbarMenuList?.admin.map((menu) => (
              <Link to={menu.url as To} key={menu.name as Key}>
                <Text
                  display="inline-flex"
                  alignItems={"center"}
                  gap={1}
                  p={2}
                  _hover={{
                    bgColor: "#1785FB",
                    borderRadius: 5,
                  }}
                >
                  {menu.icon}
                  {menu.name_th}
                </Text>
              </Link>
            ))
          : NavbarMenuList?.user.map((menu) => (
              <Link to={menu.url as To} key={menu.name as Key}>
                <Text
                  display="inline-flex"
                  alignItems={"center"}
                  gap={1}
                  p={2}
                  _hover={{
                    bgColor: "#1785FB",
                    borderRadius: 5,
                  }}
                >
                  {menu.icon}
                  {menu.name_th}
                </Text>
              </Link>
            ))}
      </Flex>
      <Flex gap={2} alignItems="center">
        <Text>{authCtx?.userData?.name}</Text>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<MdSettings size={20} />}
            variant="ghost"
            _hover={{ bgColor: "blackAlpha.300" }}
            _active={{ bgColor: "blackAlpha.400" }}
          />
          <MenuList color={"gray.600"}>
            <MenuItem
              color={"red"}
              icon={<BiLogOut size={"1.5em"} />}
              onClick={handleLogout}
            >
              ออกจากระบบ
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
}

export default Navbar;
