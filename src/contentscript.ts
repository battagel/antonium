import { openDB, DBSchema } from "idb";
import { PageScanner } from "./page_scanner";
import { DatabaseMgr } from "./database_mgr";
import { WebScraper } from "./web_scraper";

const db_mgr = new DatabaseMgr();
const web_scraper = new WebScraper();
const page_scanner = new PageScanner(db_mgr);

const url = "http://battagel.github.io/antonium_api/";

db_mgr.create_db();
const data = web_scraper
  .scrape_website(url)
  .then((data) =>
    db_mgr
      .bulk_insert_of_confluence(data)
      .then(() => console.log("DB Populated"))
  );

page_scanner.scan();
