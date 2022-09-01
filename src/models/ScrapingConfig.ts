

export interface ScrapingConfigI{
    scraperId: string;
    appId: string;
    deviceId:string;
    newspapers:string[];
    useSqliteDb: boolean;
    useMongoDb: boolean;
    scrapingSettings: Map<string, ScrapingSettings>;

}

export interface ScrapingSettings{
    maxPages: number;
    startingUrls:string[];
}
