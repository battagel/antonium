import { PageScanner } from "./page_scanner";
import { DatabaseMgr } from "./database_mgr";
import { WebScraper } from "./web_scraper"

chrome.storage.sync.get(["option_types"], function (result) {
  const db_mgr = new DatabaseMgr();
  const web_scraper = new WebScraper(result["option_types"]);
  const page_scanner = new PageScanner(db_mgr);

  // const general_url = "https://battagel.github.io/antonium_api/data.json";
  const general_url = undefined
  const hpe_url = "https://confluence.eng.nimblestorage.com/pages/viewpage.action?spaceKey=~bouletp&title=Alphabet+Soup";

  db_mgr.create_db();
  web_scraper
    .scrape(general_url, hpe_url)
    .then((data) =>
      db_mgr
        .bulk_insert_of_confluence(data)
        .then(() => console.log("DB population complete"))
    );

  page_scanner.scan();
  db_mgr.clear_db()
});
