const { SHOPIFY_ROOT_ACCOUNT_EMAIL, SHOPIFY_ROOT_ACCOUNT_PASSWORD } = require('../../../config/config');
const { getRandomName } = require('../../../utils');

const logger = require('../../../config/logger')(module);

module.exports.gotoShopifyPartnersPage = async (browser) => {
    const page = await browser.newPage();
    await page.goto('https://partners.shopify.com/organizations', {
        waitUntil: 'networkidle0',
    });
    logger.info("gotoShopifyPartnersPage: Initiated new page successfully");
    return page;
}

module.exports.clickOnLoginButton = async (page) => {
    const loginButton = (await page.$x('//*[@id="ShopifyMainNav"]/ul[2]/li[2]/a'))[0];
    loginButton.click();
    await page.waitForNavigation({
        waitUntil: 'networkidle0',
    });
    logger.info("clickOnLoginButton: Clicked Login button successfully");
}

// eslint-disable-next-line consistent-return
module.exports.loginToShopifyPartners = async (page) => {
    try {
        await page.waitForFunction(
            'document.querySelector("body").innerText.includes("Welcome, JVJ CORP!")', // TODO@JAY: find an alternate to replace name
        );
        // View the speed of your clients’ stores
        logger.info(`loginToShopifyPartners: user already logged in!`)
    } catch (e) {

        try {
            const storesMenuOption = (await page.$x('//*[@id="AppFrameAside"]/div[1]/div/nav/ul[1]/li[1]/a/span'))[0];
            if (storesMenuOption) {
                logger.info("Already logged In on Redirect, so skipping login method!")
                return null;
            }
            throw new Error();
        } catch (error) {
            logger.info(`loginToShopifyPartners: the welcome text was not found on the page, So logging in !`)
            await page.focus('#account_email');
            await page.keyboard.type(SHOPIFY_ROOT_ACCOUNT_EMAIL);

            const loginWithEmailButton = (await page.$x('//*[@id="body-content"]/div[2]/div/div[2]/div/div/div[2]/div/form/button'))[0];
            loginWithEmailButton.click();

            await page.waitForNavigation({
                waitUntil: 'networkidle0',
            });

            await page.focus('#account_password');
            await page.keyboard.type(SHOPIFY_ROOT_ACCOUNT_PASSWORD);

            const loginAccountButton = (await page.$x('//*[@id="login_form"]/div[2]/ul/button'))[0];
            loginAccountButton.click();

            await page.waitForNavigation({
                waitUntil: 'networkidle0',
            });

            logger.info(`loginToShopifyPartners: Successfully logged in!`)
        }
    }
}


module.exports.clickOnStoresMenu = async (page) => {
    const storesMenuOption = (await page.$x('//*[@id="AppFrameAside"]/div[1]/div/nav/ul[1]/li[1]/a/span'))[0];
    storesMenuOption.click();

    await page.waitForNavigation({
        waitUntil: 'networkidle0',
    });

}


module.exports.clickOnAddStoreButton = async (page) => {
    const storesAddButton = (await page.$x('//*[@id="AppFrameMain"]/div/div[1]/div[1]/div/div[2]/a'))[0];
    storesAddButton.click();

    await page.waitForNavigation({
        waitUntil: 'networkidle0',
    });
}


module.exports.clickOnDevStoreOption = async (page) => {
    const devStoreRadioButton = (await page.$x('//*[@id="PolarisChoiceList1"]/ul/li[1]/div/label'))[0];
    devStoreRadioButton.click();

    await page.waitForNavigation({
        waitUntil: 'networkidle0',
    });
}

module.exports.enterStoreNameAndCheckForStoreUrl = async (page, storeName) => {
    await page.focus('#PolarisTextField1');
    await page.keyboard.type(storeName);

    try {
        await page.waitForFunction(
            'document.querySelector("body").innerText.includes("Store URL is unavailable")',
        );
        logger.info("Store URL Not Available ! hence changing name ");

        await page.focus('#PolarisTextField1');
        const newStoreName = `-JVJCorp-${getRandomName()}`;
        await page.keyboard.type(newStoreName);
        return [true, storeName + newStoreName];
    } catch (e) {
        logger.error(`Store URL is available ${storeName}, err :  ${JSON.stringify(e)}`)
        return [false, storeName];
    }
}

module.exports.enterStorePassword = async (page, password) => {
    console.log("Store PWD ", password)
    await page.focus('#PolarisTextField4');
    await page.keyboard.type(password);

    await page.focus('#PolarisTextField5');
    await page.keyboard.type(password);
}

module.exports.buildForClientAndCreateStoreButton = async (page) => {
    const buildForClientRadioButton = (await page.$x('//*[@id="signup_source_details"]/ul/li[1]/label'))[0];
    buildForClientRadioButton.click();
    const createStoreFinalButton = (await page.$x('//*[@id="AppFrameMain"]/div/div/div[2]/div[2]/div/div/div[2]/button'))[0];
    createStoreFinalButton.click();
    await page.waitForNavigation({
        waitUntil: 'networkidle0',
    });
}

module.exports.clickOnSettingsButton = async (page) => {
    await new Promise(r => setTimeout(r, 20000));

    const settingsInStoreButton = (await page.$x('//*[@id="AppFrameNav"]/div/nav/div[2]/div[2]/ul/li/div/a'))[0];
    settingsInStoreButton.click();

    await page.waitForNavigation({
        waitUntil: 'networkidle0',
    });
    await page.waitForNetworkIdle({
        idleTime: 3000,
        timeout: 50000
    });

    return page.url();
}

module.exports.gotoUserAddtionTab = async (page) => {
    const settingsInStoreUsersAndPermissionTab = (await page.$x('//*[@id="SettingsDialog"]/section/div/div[1]/nav/ul/li[4]/div/a'))[0];
    settingsInStoreUsersAndPermissionTab.click();

    await page.waitForNavigation({
        waitUntil: 'networkidle0',
    });

    await page.waitForNetworkIdle({
        idleTime: 3000,
        timeout: 50000
    });
}

module.exports.clickOnAddNewUser = async (page) => {
    const addStaffInStoreButton = (await page.$x('//*[@id="settings-body"]/div/div[2]/div/div[1]/div/div[2]/div[2]/div[2]/div/a'))[0];
    addStaffInStoreButton.click();
    await page.waitForNetworkIdle({
        idleTime: 1000,
        timeout: 50000
    });
}

module.exports.enterNewUserEmailAndPasswordAndSelectAllPermissions = async (page, userName, userEmail, hostURL) => {

    await page.goto(`https://${hostURL}/admin/settings/account/new`, {
        waitUntil: 'networkidle0',
    });

    await page.focus('#PolarisTextField1'); // first name
    await page.keyboard.type(userName);

    await page.focus('#PolarisTextField2'); // last name
    await page.keyboard.type('DEV STORE');

    await page.focus('#PolarisTextField3'); // email
    await page.keyboard.type(userEmail);
    await page.waitForXPath('//span[contains(text(), "Select all")]', 5000);
    const [selectAllPermissionsButton] = await page.$x('//span[contains(text(), "Select all")]');
    console.log(selectAllPermissionsButton, "BUtton REf");
    if (selectAllPermissionsButton) await selectAllPermissionsButton.click();
    else console.log("ERORED HERE ")
}

module.exports.clickOnSendAndConfirmInviteButton = async (page) => {
    const sendInviteButton = (await page.$x('//*[@id="settings-body"]/div/div[2]/div/div[2]/div/div/div[2]/button'))[0];
    sendInviteButton.click();

    await page.waitForNetworkIdle({
        idleTime: 1000,
        timeout: 50000
    });

    await page.waitForXPath('//span[contains(text(), "Confirm")]', 5000);
    const [confirmInviteButton] = await page.$x('//span[contains(text(), "Confirm")]');
    if (confirmInviteButton) await confirmInviteButton.click();
    else console.log("ERORED HERE ")

    await page.waitForNavigation({
        waitUntil: 'networkidle0',
    });
}
