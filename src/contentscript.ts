const test_db: any = {
  acronyms: "DSCC",
  definition: "Data Services Cloud Console",
  references: "hpe.com",
};

function getParagraphs() {
  const text_elements = document
    .getElementById("content")!
    .querySelectorAll("p, h1, h2, h3, h4");

  // you can add more in the query using a comma e.g. "p, span"

  text_elements.forEach(updateParagraph);
}

function updateParagraph(para_obj: any) {
  // For searching and replacing of words in the paragraph
  var paragraph: string = para_obj.innerHTML;
  const word_pattern = /[a-zA-Z0-9]/;
  var on_tag: boolean = false;
  var on_word: boolean = false;
  var start_word: number = 0;
  var end_word: number = 0;
  const len: number = paragraph.length;

  for (var ptr: number = len - 1; ptr >= 0; ptr--) {
    let char = paragraph[ptr];

    if (char === ">") {
      // found beginning of a tag
      on_tag = true;
      if (on_word) {
        // beginning of tag is the end of a word
        paragraph = process_word(ptr + 1, end_word, paragraph);
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
          paragraph = process_word(ptr + 1, end_word, paragraph);
          on_word = false;
        }
      }
    }
  }
  if (on_word == true) {
    on_word = false;
    paragraph = process_word(ptr + 1, end_word, paragraph);
  }
  para_obj.innerHTML = paragraph;
}

function process_word(
  word_start: number,
  word_end: number,
  para_text: string
): string {
  // Look into instead of returning, use by reference to edit para_text
  var word = para_text.substring(word_start, word_end + 1);
  console.log(word);

  // Query word
  var new_word = "<abbr title='" + word + "'>HPE</abbr>";
  // Change word in para
  para_text =
    para_text.slice(0, word_start) + new_word + para_text.slice(word_end + 1);
  //console.log(para_text);
  return para_text;
}

getParagraphs();
