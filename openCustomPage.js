/**
 * Opens a custom page with optional parameters.
 * 
 * @param {string} pageName - Name of the custom page to open.
 * @param {string} title - The title of the custom page. Can include placeholders like {fullname}.
 * @param {string|number} [width=600] - Width in px or %, e.g., "600px" or "80%".
 * @param {string|number} [height=400] - Height in px or %, e.g., "400px" or "70%".
 * @param {number} [target=2] - 1 = Inline, 2 = Dialog. Default is 2.
 * @param {number} [position=1] - 1 = Center, 2 = Far side. Default is 1.
 * @param {string} [entityName=""] - Entity logical name to fetch data for title placeholders.
 * @param {string} [id=""] - Record ID to fetch data for title placeholders.
 * @param {boolean} [saveBeforeOpen=false] - Whether to save the form before opening.
 * @param {boolean} [refreshAfterClose=false] - Whether to refresh the form after closing dialog.
 */
function openCustomPage(
    pageName,
    title,
    width = 600,
    height = 400,
    target = 2,
    position = 1,
    entityName = "",
    id = "",
    saveBeforeOpen = false,
    refreshAfterClose = false
) {
    const defaultWidth = 600;
    const defaultHeight = 400;

    const pageInput = {
        pageType: "custom",
        name: pageName
    };

    if (entityName.trim().length > 0) {
        pageInput.entityName = entityName;
    }

    if (id.trim().length > 0) {
        pageInput.recordId = idWithoutBrackets(id);
    }

    const openPage = (finalTitle) => {
        const navigationOptions = {
            target: target,
            width: convertToSize(width, defaultWidth),
            height: convertToSize(height, defaultHeight),
            position: position,
            title: finalTitle,
        };

        const openAction = () => {
            try {
                Xrm.Navigation.navigateTo(pageInput, navigationOptions)
                    .then(() => {
                        if (refreshAfterClose && target === 2) {
                            const formContext = Xrm.Page || Xrm.Utility.getGlobalContext().formContext;
                            formContext.data.refresh();
                        }
                    })
                    .catch((error) => {
                        showErrorDialog(error, "Error opening the page.");
                    });
            } catch (e) {
                showErrorDialog(e, "Unexpected error while opening the page.");
            }
        };

        if (saveBeforeOpen) {
            const formContext = Xrm.Page || Xrm.Utility.getGlobalContext().formContext;
            formContext.data.save().then(openAction).catch(error => {
                showErrorDialog(error, "Could not save form before opening the page.");
            });
        } else {
            openAction();
        }
    };

    if (entityName.trim().length > 0 && id.trim().length > 0) {
        fetchEntityFields(title, entityName, id)
            .then(openPage)
            .catch(error => {
                showErrorDialog(error, "Error fetching entity data for title.");
            });
    } else {
        openPage(title);
    }
}
function fetchEntityFields(title, entityName, id) {
    return Xrm.WebApi.retrieveRecord(entityName, id).then(function (entityRecord) {
        return title.replace(/{([^}]+)}/g, function (match, fieldName) {
            return entityRecord[fieldName] || match;
        });
    });
}

function idWithoutBrackets(id) {
    return id.startsWith("{") && id.endsWith("}") ? id.slice(1, -1) : id;
}

function convertToSize(input, defaultSize) {
    let result = { value: defaultSize, unit: "px" };

    if (typeof input === "number") {
        if (input > 0) {
            result.value = input;
        }
    } else if (typeof input === "string") {
        const parsedInput = parseInt(input);
        if (!isNaN(parsedInput)) {
            result.value = parsedInput;
            result.unit = input.includes("%") ? "%" : "px";
        } else if (input.endsWith("px")) {
            result.value = parseInt(input.slice(0, -2));
            result.unit = "px";
        } else if (input.endsWith("%")) {
            result.value = parseInt(input.slice(0, -1));
            result.unit = "%";
        }
    }

    return result;
}

function showErrorDialog(error, message) {
    Xrm.Utility.alertDialog(message + " " + (error.message || ""));
    console.error("Error: ", error);
}
