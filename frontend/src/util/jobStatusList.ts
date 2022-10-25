type jobStatusType = {
    name: string,
    percent: number
}[]

const optStatusList: jobStatusType = [
    { name: "Scope Program Process", percent: 5 },
    { name: "Diagram Process", percent: 15 },
    { name: "Coding Process", percent: 65 },
    { name: "Testing Process", percent: 75 },
    { name: "User Training", percent: 100 },
]

export default optStatusList