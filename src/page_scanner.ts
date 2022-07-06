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
    var on_word: boolean = false;
    var end_word: number = 0;
    const len: number = paragraph.length;

    for (var ptr: number = len - 1; ptr >= 0; ptr--) {
      let char = paragraph[ptr];

      if (char === ">") {
        // found beginning of a tag
        on_tag = true;
        if (on_word) {
          // beginning of tag is the end of a word
          paragraph = await this.process_word(ptr + 1, end_word, paragraph);
          on_word = false;
        }
        continue;
      }
      if (char == "<" && on_tag) {
        // found end of tag
        on_tag = false;
        continue;
      }
      if (!on_tag) {
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

  async process_word(word_start: number, word_end: number, para_text: string) {
    // Look into instead of returning, use by reference to edit para_text
    var word = para_text.substring(word_start, word_end + 1);

    // Query word
    var new_word = await this.query_word(word);
    // Change word in para
    para_text =
      para_text.slice(0, word_start) + new_word + para_text.slice(word_end + 1);
    //console.log(para_text);
    return para_text;
  }

  async query_word(word: string) {
    // Query the DB for the word
    var query = await this.query_db(word.toLowerCase());

    // if the word exists compile a abbr tag
    if (!query) {
      // Try without case correction
      query = await this.query_db(word);
      if (!query) {
        return word;
      }
    }

    const abbr_tag: string = this.tooltip(query, word);
    return abbr_tag;
  }

  async query_db(word: string): Promise<any> {
    return this.db.get("word_key", word);
  }

  tooltip(word: any, original_word: string) {
    // Error with words that are already links for some reason
    var formatted_links = "<ul>";
    for (var i = 0; i < word.reference.length; i++) {
      formatted_links += "<li>" + word.reference[i] + "</li>";
    }
    formatted_links += "</ul>";

    if (word.type === "gen") {
      word.word_key = this.capitalizeWords(word.word_key);
    }
    return (
      "<div class='tooltip'>" +
      original_word +
      "<span class='tooltiptext'><b>" +
      word.word_key +
      "</b><br><br>" +
      word.definition +
      "<br><br>" +
      formatted_links +
      "</span></div>"
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
                min-width: 300px
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
