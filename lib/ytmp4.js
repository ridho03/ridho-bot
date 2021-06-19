const puppeteer = require('puppeteer')
const text1 = 'ridho'
const text2 = 'bot'
const fs = require('fs-extra')

try {
	(async () => {
		const browser = await puppeteer.launch({
			headless: false,
		});
		const page = await browser.newPage();
		await page
		.goto("https://textpro.me/pornhub-style-logo-online-generator-free-977.html", {
			waitUntil: "networkidle2"
		})
		.then(async () => {
			await page.type("#text-0", text1)
			await page.type("#text-1", text2);
			await page.click("#submit");
			await new Promise(resolve => setTimeout(resolve, 3000));
			const element = await page.$(
				'div[class="btn-group"] > a'
				);
			const text = await (await element.getProperty("href")).jsonValue();
			const urlmp4 = ({
				url: text
			})
			console.log(text)
			browser.close();
		})
		.catch((err => {
			console.log(err)
		}))
	})();
} catch (error) {
	console.log('error bang')
}