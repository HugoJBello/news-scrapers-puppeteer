



export interface ScrapingIndexI {
    dateScraping: Date;
    urlIndex: number;
    pageNewIndex: number;
    pageIndexSection: number;
    maxPages: number;
    newspaper: string;
    reviewsSource: string;
    startingUrls: string[];
    scraperId: string;
    deviceId: string;
    id:number;
    scrapingIteration:number;
}

export const joiningStr = "====="

