type TNavData = {
    admin: Menu[],
    user: Menu[],
}

type Menu = {
    name: String,
    name_th: String,
    url: String,
    icon?: JSX.Element,
    sub_menu?: SubMenu[]
}
type SubMenu = {
    name: String,
    name_th: String,
    url: String,
}

export default TNavData