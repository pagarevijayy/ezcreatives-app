# ezCreative App

Image Builder

- menubar
- acitvity-bar (single image vs multiple images)
- left section (form)
  - single image mode
  - multiple image mode (connect googlesheet with specified fields)
- right section
  - Button: Export Images
  - preview image

---

### Single Image Mode

- Template ID
- Fields
  - Quote
  - SubQuote/Author
  - Image URL (cors enabled)
  - SocialHandle
  - MainContentPadding
  - MainContentFont
  - MainContentFontSize
  - MainContentFontColor
  - BackgroundColor (linear/gradient)
- Button: Preview Image

### Multiple Images Mode

- Fields
  - google-sheet url (access enabled, with proper fields)
- Button: Generate Preview

### Engineering

id -> configuration json + component

---

1. Accept only one design prop in form of object - templateConfig {...old}
