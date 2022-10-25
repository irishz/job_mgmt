import { HiHome } from "react-icons/hi";
import { FaTasks } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
import { GoChecklist } from "react-icons/go";
import INavData from "../../types/navdata";

const NavbarMenuList: INavData | undefined = {
  admin: [
    {
      name: "admin-home",
      name_th: "หน้าแรก",
      url: "/",
      icon: <HiHome size="1.2em" />,
    },
    {
      name: "my-job",
      name_th: "งานของฉัน",
      url: "/myjob",
      icon: <FaTasks size="1.2em" />,
    },
    {
      name: "waiting approve",
      name_th: "รอการอนุมัติ",
      url: "/approve",
      icon: <GoChecklist size="1.2em" />,
    },
    {
      name: "report",
      name_th: "ดูรายงาน",
      url: "report",
      icon: <HiDocumentReport size="1.2em" />,
      sub_menu: [{
        name: 'Weekly Report',
        name_th: 'Weekly Report',
        url: '/report-weekly',
      },{
        name: 'Monthly Report',
        name_th: 'Monthly Report',
        url: '/report-monthly',
      }]
    },
  ],
  user: [
    {
      name: "home",
      name_th: "หน้าแรก",
      url: "/",
      icon: <HiHome size="1.2em" />,
    },
    {
      name: "job-new",
      name_th: "ร้องของานใหม่",
      url: "/job/new",
    },
  ],
};

export default NavbarMenuList;
