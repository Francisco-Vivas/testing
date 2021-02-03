// Francisco Javier Vivas Astudillo.
require("geckodriver");
const { Builder, Key, By, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const options = new firefox.Options();

const driver = new Builder()
  .forBrowser("firefox")
  .setFirefoxOptions(options)
  .build();

describe("Executing test for SDEiT position at Endava", () => {
  beforeAll(async () => {
    jest.setTimeout(15000);
    await driver.get("https://www.amazon.com/");
    await driver.wait(
      until.elementLocated(By.css("input[id='twotabsearchtextbox']")),
      10000
    );
    await driver
      .findElement(By.css("input[id='twotabsearchtextbox']"))
      .sendKeys("Software Test Design", Key.ENTER);
  });

  afterAll(async () => {
    await driver.quit();
  }, 15000);

  it('The title should be "A Practitioner\'s Guide to Software Testing Design"', async () => {
    const selector = "div[data-index='5']";
    await driver.wait(until.elementLocated(By.css(selector)), 10000);
    await driver.findElement(By.css(selector)).click();

    const productTitle = await driver
      .findElement(By.css("span[id='productTitle']"))
      .getText();

    expect(productTitle).toBe("A Practitioner's Guide to Software Test Design");
  });

  it("should be pre-selected the Paperback tab", async () => {
    const selector = "#mediaTab_heading_2 > a > span > div:nth-child(1) > span";
    await driver.wait(until.elementLocated(By.css(selector)), 10000);
    const isPaperbackPreSelected = await driver
      .findElement(By.css(selector))
      .isDisplayed();

    expect(isPaperbackPreSelected).toBeTruthy();
  });

  it("should locate the user in the same country (p.e. Colombia)", async () => {
    const selector = "#glow-ingress-line2";
    await driver.wait(until.elementLocated(By.css(selector)), 10000);
    const userCountry = await driver.findElement(By.css(selector)).getText();
    expect(userCountry).toBe("Colombia");
  });

  it("should be pre-selected the Buy new book option", async () => {
    const selector = "#newAccordionRow_263333 > div > div > a > i";
    await driver.wait(until.elementLocated(By.css(selector)), 10000);
    const isNewSelected = await driver
      .findElement(By.css(selector))
      .getAttribute("class");
    expect(isNewSelected).toBe("a-icon a-accordion-radio a-icon-radio-active");
  });

  it("should add  2 books to the shopping cart", async () => {
    const selector = "#add-to-cart-button";
    await driver.wait(until.elementLocated(By.css(selector)), 10000);

    await driver.findElement(By.css("#a-autoid-2-announce")).click();
    await driver.findElement(By.css("#quantity_1")).click();

    await driver.findElement(By.css(selector)).click();
    const cartCount = await driver
      .findElement(By.css("#nav-cart-count"))
      .getText();

    expect(cartCount).toBe("2");
  });

  it("the subtotal should be the equal to the quantity and price of the selected book in the shopping cart", async () => {
    const toTheCart = "#hlb-view-cart-announce";
    await driver.wait(until.elementLocated(By.css(toTheCart)), 10000);
    await driver.findElement(By.css(toTheCart)).click();

    const subtotalSelector =
      "span[class='a-size-medium a-color-base sc-price sc-white-space-nowrap']";
    await driver.wait(until.elementLocated(By.css(subtotalSelector)), 10000);
    const subtotal = await driver
      .findElement(By.css(subtotalSelector))
      .getText();

    const priceSelector =
      "span[class='a-size-medium a-color-base sc-price sc-white-space-nowrap sc-product-price a-text-bold']";
    await driver.wait(until.elementLocated(By.css(priceSelector)), 10000);
    const price = await driver.findElement(By.css(priceSelector)).getText();

    const quantity = await driver
      .findElement(By.css("span[class='a-dropdown-prompt']"))
      .getText();

    expect(parseFloat(subtotal.replace(/\$/g, ""))).toBe(
      parseFloat(price.replace(/\$/g, "")) * parseFloat(quantity)
    );
  });
});
