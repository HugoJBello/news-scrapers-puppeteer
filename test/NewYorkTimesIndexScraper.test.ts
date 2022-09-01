
import {ScrapingIndexI} from "../src/models/ScrapingIndex";

import {NewYorkTimesIndexScraper} from "../src/scrapers/NewYorkTimesIndexScraper";
import { expect } from 'chai';

require('dotenv').config();

describe('the nyt index new scraper', function () {
    describe('test index in a for a given new nyt', function () {
        this.timeout(9999999);

        const date = new Date()
        const testIndex = {urlIndex:1, pageNewIndex:2, startingUrls:
                ["https://www.nytimes.com/section/climate",]
        } as ScrapingIndexI

        const scraper = new NewYorkTimesIndexScraper(testIndex);
        scraper.maxPages=1

        

        it('scraping results shoud be not using index', async function () {
            testIndex.pageNewIndex = 2
            testIndex.urlIndex = 0
            const result = await scraper.extractNewsUrlsInSectionPageFromIndexOneIteration();
     

            expect(result).not.equal(undefined)
            expect(scraper.scrapingIndex.pageNewIndex).to.equal(2)
        });
    });
});