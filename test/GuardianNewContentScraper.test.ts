import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {GuardianNewContentScraper} from "../src/scrapers/GuardianNewContentScraper";
import { expect } from 'chai';

require('dotenv').config();

describe('GuardianNewContentScraper 1', function () {
    describe('GuardianNewContentScraper 2', function () {

        const date = new Date()
        const testIndex = {} as ScrapingIndexI
        testIndex.scraperId = "test"
        const scraper = new GuardianNewContentScraper("test","");

        it('GuardianNewContentScraper', async function () {
            //const url ="https://www.theguardian.com/film/2021/jan/06/ham-on-rye-review-subversive-satire" // "https://www.thesun.co.uk/tvandshowbiz/13409249/mark-wright-found-car-stolen-essex/"
            const url = "https://www.theguardian.com/us-news/2022/sep/01/california-last-nuclear-power-plant-keep-open"
            const result = await scraper.extractNewInUrl(url);
            console.log(result);
            expect(result).to.have.property("content")
            expect(result).to.have.property("date")
            expect(result).to.have.property("headline")
            expect(result).to.have.property("description")
            expect(result).to.have.property("scrapedAt")
            expect(result).to.have.property("tags")
            expect(result.tags).not.equal(null)
            expect(result.content).not.equal(null)
            expect(result.content).not.equal(undefined)
            expect(result.content).not.equal('')
            expect(result.date).not.equal(null)

            expect(result.date).not.equal(undefined)
            expect(result.tags).not.equal(undefined)
            expect(result.content).not.equal(undefined)
            expect(result.description).not.equal(undefined)
            expect(result.headline).not.equal(undefined)
            expect(result.url).not.equal(undefined)
        });
    });
});