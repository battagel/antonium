import { PageScanner } from "./pagescanner";

const types: any = {
  general: window.localStorage.getItem("gen"),
  abbreviated: window.localStorage.getItem("abbr"),
  shortened: window.localStorage.getItem("short"),
  jargon: window.localStorage.getItem("jargon"),
};

var page_scanner = new PageScanner(types);

page_scanner.scan();

var url = "http://localhost:8000/confluence.html";

const parser = new DOMParser();

fetch(url)
  .then((res) => res.text())
  .then((html: any) => {
    disassemble_html(parser.parseFromString(html, "text/html"));
  });

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
