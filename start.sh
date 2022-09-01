pm2 stop puppeteer_news_scraper
pm2 delete puppeteer_news_scraper
pm2 start npm --name "puppeteer_news_scraper" -- start
npm run jobRunner
