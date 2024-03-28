import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {XatakaContentScraper} from "../src/scrapers/XatakaContentScraper";
import { expect } from 'chai';

require('dotenv').config();

describe('XatakaContentScraper 1', function () {
    describe('XatakaContentScraper 2', function () {
        this.timeout(9999999);

        const date = new Date()
        const testIndex = {} as ScrapingIndexI
        testIndex.scraperId = "test"
        const scraper = new XatakaContentScraper("test","");

        it('XatakaContentScraper', async function () {

            const url = "https://www.xataka.com/movilidad/avisador-detector-e-inhibidor-radar-que-legal-que-no-que-me-puede-multar-dgt-esta-semana-santa"
            const result = await scraper.extractNewInUrl(url, "", 0, 0);
            console.log(result);
            expect(result).to.have.property("content")
            expect(result).to.have.property("date")
            expect(result).to.have.property("headline")
            expect(result).to.have.property("description")
            expect(result).to.have.property("scrapedAt")
            expect(result).to.have.property("tags")
            expect(result).to.have.property("sections")
            expect(result.tags).not.equal(null)
            expect(result.sections).not.equal(null)
            expect(result.figuresText).not.equal(null)
            expect(result.figuresUrl).not.equal(null)
            expect(result.figuresUrl).not.equal([])
            expect( result.figuresUrl ).to.be.an( "array" ).that.is.not.empty
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