# Open Custom Page Function Documentation

This documentation explains how to use the `openCustomPage` JavaScript function to open a custom page in Dynamics 365 Model-Driven Apps. It includes setup instructions, parameter descriptions, usage examples, and credits.

---

## Setup Instructions

To use this function as a command button on a form in Model-Driven Apps:

1. **Add the JavaScript Web Resource**:
   - Create a new JavaScript Web Resource in your solution.
   - Paste the entire `openCustomPage` function code into the Web Resource.

2. **Configure the Command Button**:
   - Open the form editor for the desired entity.
   - Add a new button to the command bar using the Ribbon Workbench or Power Apps Command Designer.
   - Set the button's action to call the `openCustomPage` function.
   - Pass the required parameters such as page name, title, width, height, etc.

3. **Publish the Customizations**:
   - Save and publish all customizations.
   - Test the button on the form to ensure it opens the custom page as expected.

---

## Function Parameters

| Parameter            | Type           | Description |
|----------------------|----------------|-------------|
| `pageName`           | string         | Name of the custom page to open. |
| `title`              | string         | Title of the custom page. Can include placeholders like `{fullname}`. |
| `width`              | string/number  | Width in px or %, e.g., `"600px"` or `"80%"`. Default is `600`. |
| `height`             | string/number  | Height in px or %, e.g., `"400px"` or `"70%"`. Default is `400`. |
| `target`             | number         | 1 = Inline, 2 = Dialog. Default is `2`. |
| `position`           | number         | 1 = Center, 2 = Far side. Default is `1`. |
| `entityName`         | string         | Entity logical name to fetch data for title placeholders. |
| `id`                 | string         | Record ID to fetch data for title placeholders. |
| `saveBeforeOpen`     | boolean        | Whether to save the form before opening. Default is `false`. |
| `refreshAfterClose`  | boolean        | Whether to refresh the form after closing dialog. Default is `false`. |

---

## Usage Example

```javascript
openCustomPage(
    "my_custom_page",
    "Details for {fullname}",
    "80%",
    "70%",
    2,
    1,
    "contact",
    "{12345678-1234-1234-1234-123456789012}",
    true,
    true
);
