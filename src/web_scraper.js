export class WebScraper {
  async scrape_website(url) {
    // Make sure this website is hosted
    const parser = new DOMParser();
    console.log("Scraping confluence");
    var raw_html = await fetch(url).then((res) => res.text());
    return this.disassemble_html(parser.parseFromString(raw_html, "text/html"));
  }

  disassemble_html(raw_html) {
    const rows = raw_html.querySelectorAll("tr");
    let data_items = [];
    for (var i = 0; i < rows.length; i++) {
      var row_dict = this.process_row(rows[i]);
      if (row_dict) {
        data_items.push(row_dict);
      }
    }
    return data_items;
  }

  process_row(row) {
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
}
