import {JobRunner} from "./JobRunner";

(async ()=>{
    const jobRunner = new JobRunner()
    await jobRunner.runJobs()
})()
