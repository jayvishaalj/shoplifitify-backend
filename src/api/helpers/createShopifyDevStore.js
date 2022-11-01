const puppeteer = require('puppeteer');
const { gotoShopifyPartnersPage, loginToShopifyPartners, clickOnStoresMenu, clickOnAddStoreButton, clickOnDevStoreOption, enterStoreNameAndCheckForStoreUrl, enterStorePassword, buildForClientAndCreateStoreButton, clickOnSettingsButton, enterNewUserEmailAndPasswordAndSelectAllPermissions, clickOnSendAndConfirmInviteButton } = require('./automations/shopifyStoreCreationAutomations');

const logger = require('../../config/logger')(module);

module.exports.CreateShopifyDevStore = async (user) => {
    logger.info(`CreateShopifyDevStore: initiated with req ${user}`)
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: {
                width: 1920,
                height: 1080
            },
            userDataDir: "./user_data"
        });
        let page = await gotoShopifyPartnersPage(browser);
        await loginToShopifyPartners(page);
        await clickOnStoresMenu(page);
        await clickOnAddStoreButton(page);
        await clickOnDevStoreOption(page);

        const [isNewStoreName, storeName] = await enterStoreNameAndCheckForStoreUrl(page, user.shop_name)
        if (isNewStoreName) {
            // TODO@JAY : update storeName object
            console.log(storeName)
        }

        await enterStorePassword(page, user.password);
        await buildForClientAndCreateStoreButton(page);
        let pageUrl = await clickOnSettingsButton(page);
        console.log(pageUrl);
        [, , pageUrl] = pageUrl.split('/');
        // TODO @JAY : need to store this url back in firebase
        console.log(pageUrl);
        page = await browser.newPage();
        await enterNewUserEmailAndPasswordAndSelectAllPermissions(page, user.display_name, user.email_id, pageUrl);
        await clickOnSendAndConfirmInviteButton(page);
        await browser.close();
    } catch (error) {
        console.log(error)
        logger.error(`CreateShopifyDevStore: Error while creating Shop, req: ${user}, error: ${error}`)
    }
}
