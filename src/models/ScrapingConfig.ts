

export interface ScrapingConfigI{
    scraperId: string;
    apiUrl: string;
    appId: string;
    deviceId:string;
    newspapers:string[];
    useSqliteDb: boolean;
    useMongoDb: boolean;
    waitOnIteration: number;
    waitMinutes: number;
    scrapingSettings: Map<string, ScrapingSettings> | any;

}

export interface ScrapingSettings{
    maxPages: number;
    startingUrls:string[];
    logoUrl: string;
    tag: string;
    
}
