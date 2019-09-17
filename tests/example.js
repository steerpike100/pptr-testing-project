const puppeteer = require('puppeteer')
const expect = require('chai').expect

const config = require('../lib/config')
const click = require('../lib/helpers').click
const typeText = require('../lib/helpers').typeText
const loadUrl = require('../lib/helpers').loadUrl
const waitForText = require('../lib/helpers').waitForText
const pressKey = require('../lib/helpers').pressKey
const shouldExist = require('../lib/helpers').shouldExist
const shouldNotExist = require('../lib/helpers').shouldNotExist
const getCount = require('../lib/helpers').getCount
const generateID = require('../lib/utils').generateID
const generateNumbers = require('../lib/utils').generateNumbers
const LOGIN_FORM = '#login_form'

describe('My first puppeteer test', () => {
	let browser
	let page

	before(async function () {
		browser = await puppeteer.launch({
			headless: config.isHeadless,
			slowMo: config.slowMo,
			devTools: config.isDevTools,
			timeout: config.launchTimeout,

		})

		page = await browser.newPage()
		await page.setDefaultTimeout(config.waitingTimeout)
		await page.setViewport({
			width: config.viewportWidth,
			height: config.viewportHeight,
		})
	})

	after(async function () {
		await browser.close()
	})

	describe('Login Test', () => {
		it('should navigate to homepage', async() => {
			await loadUrl(page, config.baseURL)
			await shouldExist(page, '#online_banking_features')
		})

		it('should click on sign in button', async() => {
			await click(page, '#signin_button')
			await shouldExist(page, LOGIN_FORM)
		})
		it('should submit login form', async() => {
			await typeText(page, utils.generateID(), '#user_login')
			await typeText(page, utils.generateNumbers(), '#user_password')
			await click(page, '.btn-primary')
			await shouldExist(page, LOGIN_FORM)
		})
		it('should get error message', async() => {
			await waitForText(page, 'body', 'Login and/or password are wrong.')
			await shouldExist(page, LOGIN_FORM)
		})
	})

	describe('Search Test', () =>{
		it('should navigate to the homepage', async () =>{
			await loadUrl(page, config.baseURL)
			await shouldExist(page, '#online_banking_features')
		})
		
		it('should submit search phrase', async () =>{
			await typeText(page, "hello world", '#searchTerm')
			await pressKey(page, 'Enter')
		})
		it('shoulddisplay search results', async () =>{
			await waitForText(page, 'h2', "Search Results")
			await waitForText(page, 'body', "No results were found for the query")
			
		})
	})

	describe('Navbar link tests', () =>{
		it('Navbar Links Test', async () =>{
			await loadUrl(page, config.baseURL)
			await shouldExist(page, '#online_banking_features')
		})
		it('Should have the correct number of links', async () =>{
			//get count of links
			const numberOfLinks = await getCount(page, '#pages-nav > li')
			//assert the count
			expect(numberOfLinks).to.equal(3)
		})
	})

})