import { PageScanner } from "./pagescanner";

var page_scanner = new PageScanner();

//page_scanner.scan();

var url = "http://localhost:8000/confluence.html";

const parser = new DOMParser();

var raw_html = fetch(url)
  .then((res) => res.text())
  .then((html: any) => {
    console.log(html);
    disassemble_html(parser.parseFromString(html, "text/html"));
  });

function disassemble_html(raw_html: any) {
  const rows = raw_html.querySelectorAll("tr");
  let data_items: Array<any> = [];
  for (var i = 0; i < rows.length; i++) {
    data_items.push(process_row(rows[i]));
  }
  console.log(data_items);
  return data_items;
}

function process_row(row: any) {
  console.log(row);
  var tds = row.querySelectorAll("td");
  if (tds.length === 3) {
    return {
      acronym: tds[0].innerText,
      definition: tds[1].innerText,
      reference: tds[2].innerText,
    };
  }
}
