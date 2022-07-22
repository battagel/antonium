export class WebScraper {

  constructor(option_types) {
    this.option_types = option_types;
  }

  async scrape(general_url, hpe_url) {

    if (general_url) {
      console.log("General url found. Scraping...")
      general_data = await this.scrape_website(general_url)
    }

    if (hpe_url) {
      console.log("HPE url found. Scraping...")
      hpe_data = await this.scrape_website(hpe_url)
    }

    var concat_dict = html_data

    return concat_dict
  }

  async scrape_json(general_url) {
    console.log(general_url)
  }

  async scrape_website(url) {
    // Make sure this website is hosted
    const parser = new DOMParser();
    //console.log("Scraping confluence for URL " + url);
    var raw_html = await fetch(url).then((res) => res.text()).catch(console.log("Error found"))
    if (raw_html) {
      return this.disassemble_html(parser.parseFromString(raw_html, "text/html"));
    }
    else {
      console.log("Failed to find data for provided URL " + url)
      return {}
    }
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
          data_items = this.find_dups(row_dict, data_items);
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
      // This sorts to make sure only one word answers are being added
      if (tds[0].innerText.split(" ").length === 1) {
        dict_temp["word_key"] = tds[0].innerText;
        if (tds[1]) {
          dict_temp["definition"] = [tds[1].innerHTML];
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
          dict_temp["reference"] = [new_links];
        }
        if (dict_temp["word_key"].match(abbr_pattern)) {
          dict_temp["type"] = "abbr";
        } else {
          dict_temp["type"] = "gen";
          dict_temp["word_key"] = dict_temp["word_key"].toLowerCase();
        }
        return dict_temp;
      }
    }
    return undefined;
  }

  find_dups(row_dict, data_items) {
    // Check if there are duplicates in the list and append the values under the same key
    for (var i = 0; i < data_items.length; i++) {
      if (row_dict["word_key"] == data_items[i]["word_key"]) {
        var combined_dict = data_items[i]
        combined_dict["definition"].push(row_dict["definition"][0]);
        combined_dict["reference"].push(row_dict["reference"][0]);
        data_items[i] = combined_dict
        return data_items
      }
    }
    data_items.push(row_dict)
    return data_items
  }
}
