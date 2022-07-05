export class WebScraper {
  // async write_json(url) {
  //   const data = await this.scrape_website(url);
  //   const json_data = JSON.stringift(data);

  //   fs.writeFile("database.json", dictstring, function (err, result) {
  //     if (err) console.log("error", err);
  //   });
  // }

  async scrape_website(url) {
    // Make sure this website is hosted
    const parser = new DOMParser();
    console.log("Scraping confluence for URL " + url);
    var raw_html = await fetch(url).then((res) => res.text());
    return this.disassemble_html(parser.parseFromString(raw_html, "text/html"));
  }

  disassemble_html(raw_html) {
    console.log(raw_html);
    // Apply a filter to only pick up the heading rows in the parent table
    const rows = raw_html.querySelectorAll(
      "#main-content > table > tbody > tr"
    );
    console.log(rows);
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
    // Error becaused caused by searching for table rows within an embedded table
    var tds = row.querySelectorAll("td");
    var dict_temp = {
      acronym: undefined,
      definition: undefined,
      reference: undefined,
    };
    if (tds[0]) {
      dict_temp["acronym"] = tds[0].innerText;
      if (tds[1]) {
        dict_temp["definition"] = tds[1].innerHTML;
      }
      if (tds[2]) {
        // Put all references into list and remove ref
        var links = tds[2].querySelectorAll("a");
        var new_links = [];
        if (links !== []) {
          for (var i = 0; i < links.length; i++) {
            new_links.push(links.item(i).outerHTML);
          }
        }
        dict_temp["reference"] = new_links;
      }
      return dict_temp;
    } else {
      return undefined;
    }
  }
}
