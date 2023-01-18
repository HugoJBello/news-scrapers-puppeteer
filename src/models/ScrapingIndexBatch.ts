



export interface ScrapingIndexBatchI {
    dateScraping: Date;
    scrapingIndexesIds: string[];
    newspaper: string;
    scraperId: string;
    deviceId: string;
    id:number;
    scrapingIteration:number;
}

export const joiningStr = "====="

