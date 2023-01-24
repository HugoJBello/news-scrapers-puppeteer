npm run build
pm2 stop puppeteer_news_scraper
pm2 delete puppeteer_news_scraper
pm2 start npm --name "puppeteer_news_scraper" -- start

pm2 stop puppeteer_jobrunner
pm2 delete puppeteer_jobrunner
pm2 start "npm run jobRunner" --name "puppeteer_jobrunner"