import { PageScanner } from "./page_scanner";
import { DatabaseMgr } from "./database_mgr";
import { WebScraper } from "./web_scraper"

chrome.storage.sync.get(["option_types"], function (result) {
  const db_mgr = new DatabaseMgr();
  const web_scraper = new WebScraper(result["option_types"]);
  const page_scanner = new PageScanner(db_mgr);

  const url = "https://battagel.github.io/antonium_api/";

  db_mgr.create_db();
  web_scraper
    .scrape_website(url)
    .then((data) =>
      db_mgr
        .bulk_insert_of_confluence(data)
        .then(() => console.log("DB Populated"))
    );

  page_scanner.scan();
  db_mgr.clear_db()
});
