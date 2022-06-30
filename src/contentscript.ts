import { openDB, DBSchema } from "idb";
import { PageScanner } from "./pagescanner";
interface AntoniumDB extends DBSchema {
  acronyms: {
    key: string;
    value: {
      acronym: string;
      definition: string;
      reference: string;
    };
  };
}

async function insert_records(data: any, db: any) {
  console.log("Inserting records");
  console.log(data);
  for (var i = 0; i < data.length; i++) {
    console.log(data[i]);
    db.put("acronyms", data[i]);
  }
}

async function driver() {
  console.log("Driver function");
  let db: any = await openDB<AntoniumDB>("AntonioDB", 1, {
    upgrade(db) {
      console.log("Upgrade needed");
      db.createObjectStore("acronyms", {
        keyPath: "acronym",
      });
    },
  });
  console.log("DB opened");

  // Fill database
  let data: any = await scrape_confluence();
  insert_records(data, db);

  var page_scanner = new PageScanner(db);
  page_scanner.scan();
}
driver();

const types: any = {
  general: window.localStorage.getItem("gen"),
  abbreviated: window.localStorage.getItem("abbr"),
  shortened: window.localStorage.getItem("short"),
  jargon: window.localStorage.getItem("jargon"),
};

async function scrape_confluence() {
  var url = "http://localhost:8000/confluence.html";
  // Make sure this website is hosted

  const parser = new DOMParser();
  console.log("Scraping confluence");
  var raw_html = await fetch(url).then((res) => res.text());

  return disassemble_html(parser.parseFromString(raw_html, "text/html"));
}

function disassemble_html(raw_html: any) {
  const rows = raw_html.querySelectorAll("tr");
  let data_items: Array<any> = [];
  for (var i = 0; i < rows.length; i++) {
    var row_dict = process_row(rows[i]);
    if (row_dict) {
      data_items.push(row_dict);
    }
  }
  return data_items;
}

function process_row(row: any) {
  var tds = row.querySelectorAll("td");
  var dict_temp = {
    acronym: undefined,
    definition: undefined,
    reference: undefined,
  };
  if (tds[0]) {
    dict_temp["acronym"] = tds[0].innerText;
    if (tds[1]) {
      dict_temp["definition"] = tds[1].innerText;
    }
    if (tds[2]) {
      dict_temp["reference"] = tds[2].innerText;
    }
    return dict_temp;
  } else {
    return undefined;
  }
}
