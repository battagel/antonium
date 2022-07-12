export class PageScanner {
  db: any;

  constructor(db: any) {
    this.db = db;
  }

  scan() {
    const head_element = document.getElementsByTagName("head");
    const content_element = document.getElementById("content")!;

    let text_elements;
    if (content_element) {
      this.insert_style(head_element[0]);
      text_elements = content_element.querySelectorAll(
        "p, h1, h2, h3, h4, h5, h6"
      );
    } else {
      console.log("Not on correct page - no 'content' element");
      return undefined;
    }
    // you can add more in the query using a comma e.g. "p, span"

    for (var i = 0; i < text_elements.length; i++) {
      this.update_paragraph(text_elements[i]);
    }
  }

  async update_paragraph(para_obj: any) {
    // For searching and replacing of words in the paragraph
    var paragraph: string = para_obj.innerHTML;
    const word_pattern = /[a-zA-Z0-9]/;
    var on_tag: boolean = false;
    var end_tag: boolean = false;
    var end_link: number = 0;

    var on_word: boolean = false;
    var end_word: number = 0;
    const len: number = paragraph.length;

    for (var ptr: number = len - 1; ptr >= 0; ptr--) {
      let char = paragraph[ptr];

      if (char === ">") {
        // found beginning of a tag
        on_tag = true;
        if (!end_tag) {
          end_link = ptr;
        }
        if (on_word) {
          // beginning of tag is the end of a word
          paragraph = await this.process_word(ptr + 1, end_word, paragraph);
          on_word = false;
        }
        continue;
      }
      if (on_tag) {
        if (char == "<") {
          // found end of tag
          if (end_tag) {
            // We have found the end tag and now have found the starting tag
            //paragraph = await this.process_link(ptr, end_link, paragraph);
            on_tag = false;
            end_tag = false;
          } else {
            // We have found the end of the closing tag
            end_tag = true;
            continue;
          }
        }
      } else {
        // not in a tag so must be raw text
        if (word_pattern.test(char)) {
          // found a letter
          if (!on_word) {
            // starting word
            on_word = true;
            end_word = ptr;
          } else {
            // middle of word
          }
        } else {
          // found a deliminator
          if (on_word) {
            // found a word!
            // process word
            paragraph = await this.process_word(ptr + 1, end_word, paragraph);
            on_word = false;
          }
        }
      }
    }
    if (on_word == true) {
      on_word = false;
      paragraph = await this.process_word(ptr + 1, end_word, paragraph);
    }
    para_obj.innerHTML = paragraph;
  }

  async process_link(link_start: number, link_end: number, para_text: string) {
    var link = para_text.substring(link_start, link_end + 1);
    if (link.slice(link.length - 4, link.length) === "</a>") {
      // This must be a link

      var new_link = await this.query_link(link);
      para_text =
        para_text.slice(0, link_start) +
        new_link +
        para_text.slice(link_end + 1);
      return para_text;
    } else {
      // Must be some other sort of embedded tag
      console.log("Other embedded tag!");
    }
    return para_text;
  }

  async process_word(word_start: number, word_end: number, para_text: string) {
    // Look into instead of returning, use by reference to edit para_text
    var word = para_text.substring(word_start, word_end + 1);

    // Query word
    const new_word = await this.query_db(word)
    if (new_word) {

      para_text = para_text.slice(0, word_start) + this.tooltip(new_word, word) + para_text.slice(word_end + 1);
    }
    // Change word in para
    //console.log(para_text);
    return para_text;
  }

  async query_link(link: string) {
    // This function does nothing but can be changes later
    // Decided its best not to include links as you cannot
    // embed a div inside of an a tag.

    // Find what ever is in the tags
    // <a href="http://www.google.com">JSON</a>
    //
    // const parser = new DOMParser();
    // this.update_paragraph(parser.parseFromString(link, "text/html"))
  }

  async query_db(word: string): Promise<any> {
    var query = await this.db.get("word_key", word.toLowerCase());

    // if the word exists compile a abbr tag
    if (!query) {
      // Try without case correction
      query = await this.db.get("word_key", word);
      if (!query) {
        return;
      }
    }
    return query;
  }

  tooltip(word: any, original_word: string) {
    console.log(word)
    console.log(original_word)
    // Error with words that are already links for some reason

    if (word.type === "gen") {
      word.word_key = this.capitalizeWords(word.word_key);
    }

    var tooltip_text = "<span class='tooltiptext'><b>" + word.word_key + "</b>"

    for (var i = 0; i < Math.max(word.definition.length, word.definition.length); i++) {
      // Add definitions, then add links
      if (word.definition[i]) {
        tooltip_text += "<hr>" + word.definition[i] + "<br>"
      }

      var formatted_links = "<ul>";
      for (var j = 0; j < word.reference[i].length; j++) {
        formatted_links += "<li>" + word.reference[i][j] + "</li>";
      }
      formatted_links += "</ul>";

      tooltip_text += formatted_links + ""
    }

    return (
      "<div class='tooltip'>" +
      original_word + tooltip_text +
      "</div>"
    );
  }

  capitalizeWords(word: string) {
    var word_array = word.split(" ");
    var capital_word_array = word_array.map((element: string) => {
      return (
        element.charAt(0).toUpperCase() + element.substring(1).toLowerCase()
      );
    });
    return capital_word_array.join(" ");
  }

  insert_style(element: any) {
    element.innerHTML =
      element.innerHTML +
      `
            <style>
            .tooltip {
                    position: relative;
                    display: inline-block;
                    border-bottom: 3px dotted #01A986;
                }

            .tooltip .tooltiptext {
                font-family: Arial;
                visibility: hidden;
                background-color: #ffffff;
                min-width: 300px;
                color: black;
                text-align: left;
                border-radius: 6px;
                border: 1px solid #01A986;
                padding: 10px;
                position: absolute;
                z-index: 100;
                transition: visibility 0s linear 300ms, opacity 300ms;
                top: 150%;
                left: -185%;
                box-shadow: 0px 1px 6px 0px rgba(1, 169, 134, 0.32);
                font-size: 14px;
            }

            .tooltip .tooltiptext::after {
                content: "";
                position: absolute;
                bottom: 100%;
                left: 25%;
                margin-left: -5px;
                border-width: 10px;
                border-style: solid;
                border-color: transparent transparent #01A986 transparent;
            }

            .tooltip:hover .tooltiptext {
                visibility: visible;
            }
            </style>
        `;
  }
}
