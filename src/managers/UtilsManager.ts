import { createHash } from "node:crypto"

const sha256 =(content:string) => {  
    return createHash('sha256').update(content).digest('hex')
}


export default class UtilsManager {
        static createIdFromUrl(url:string){
            return sha256(url)
        }
}
