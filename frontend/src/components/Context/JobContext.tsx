import React, { createContext } from "react";

interface IJobContext {
  jobApproveCount: number;
  setjobApproveCount: React.Dispatch<React.SetStateAction<number>>;
  increaseJobApproveCount: VoidFunction;
  decreaseJobApproveCount: VoidFunction;
}

const JobContext = createContext<IJobContext | null>(null);

export default JobContext;
