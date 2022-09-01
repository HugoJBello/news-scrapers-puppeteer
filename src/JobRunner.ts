
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const cron = require('node-cron')

export class JobRunner {
    async runCommand(command: string): Promise<any>{
        try {
            const { stdout, stderr } = await exec(command)
            console.log('stdout:', stdout)
            console.log('stderr:', stderr)
            return { stdout, stderr }
        } catch (err) {
            console.error(err)
        }
    }

    async jobRestartPm2() {
        const command = "/home/goku/.nvm/versions/node/v15.14.0/bin/pm2 restart all"
        return await this.runCommand(command)
    }

    async runJobs() {
        cron.schedule('0 */2 * * *', async () => {
            console.log("running job restart pm2 every two hours")
            const result = await this.jobRestartPm2()
            console.log(result)
        });
    }
}
