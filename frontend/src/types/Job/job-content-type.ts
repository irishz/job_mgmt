import IJob from "./job-types"

type TJobContent = {
    jobData: IJob,
    // handleApproveButtonClick: (jobId: string) => void,
    handleRejectButtonClick: (jobId: string) => void,
    handleReasonInputChange: (value: string) => void,
    reason: string,
    isLoading: boolean,
    isBtnApproveLoading: boolean,
    isOpen: boolean
    onOpen: VoidFunction,
    onClose: VoidFunction,
    onOpenModal: VoidFunction,
}

export default TJobContent