export class WebScraper {
  // async write_json(url) {
  //   const data = await this.scrape_website(url);
  //   const json_data = JSON.stringift(data);

  //   fs.writeFile("database.json", dictstring, function (err, result) {
  //     if (err) console.log("error", err);
  //   });
  // }
  constructor(option_types) {
    this.option_types = option_types;
  }

  async scrape_website(url) {
    // Make sure this website is hosted
    const parser = new DOMParser();
    console.log("Scraping confluence for URL " + url);
    var raw_html = await fetch(url).then((res) => res.text());
    return this.disassemble_html(parser.parseFromString(raw_html, "text/html"));
  }

  disassemble_html(raw_html) {
    // Apply a filter to only pick up the heading rows in the parent table
    const rows = raw_html.querySelectorAll(
      "#main-content > table > tbody > tr"
    );
    let data_items = [];
    for (var i = 0; i < rows.length; i++) {
      var row_dict = this.process_row(rows[i]);
      if (row_dict) {
        if (this.option_types.includes(row_dict["type"])) {
          data_items.push(row_dict);
        }
      }
    }
    return data_items;
  }

  process_row(row) {
    var tds = row.querySelectorAll("td");
    // This regex doesnt work the best. Doesnt cope with /s or spaces
    const abbr_pattern =
      /\b(?:[A-Z]{2}[:alpha:]*)|(?:[A-Z][a-z][A-Z][:alpha:]*)/;
    var dict_temp = {
      word_key: undefined,
      definition: undefined,
      reference: undefined,
      type: undefined,
    };
    if (tds[0]) {
      dict_temp["word_key"] = tds[0].innerText;
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
      if (dict_temp["word_key"].match(abbr_pattern)) {
        dict_temp["type"] = "abbr";
      } else {
        dict_temp["type"] = "gen";
        dict_temp["word_key"] = dict_temp["word_key"].toLowerCase();
      }
      return dict_temp;
    } else {
      return undefined;
    }
  }
}
