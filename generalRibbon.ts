
export async function openCustomPage(
    pageName: string,
    title: string,
    entityName = "",
    id = "",
    width: number | string = 600,
    height: number | string = 400,
    target: 1 | 2 | 3 = 2,
    position: 1 | 2 = 1,
    canClose = true,
    imageSrc = "",
    hideHeader = false,
): Promise<void> {
    const defaultWidth = 600;
    const defaultHight = 400;
    const recId = idWithoutBrackets(id);

    if (target === 3) {
        const paneOptions: Xrm.App.PaneOptions = {
            title: title,
            paneId: id,
            width: convertToNumber(width, defaultWidth),
            canClose: canClose,
            imageSrc: imageSrc,
            hideHeader: hideHeader,
        };
        return Xrm.App.sidePanes
            .createPane(paneOptions)
            .then((pane) => {
                pane.navigate({
                    pageType: "custom",
                    name: pageName,
                });
                return true;
            })
            .catch(function (error) {
                // Handle error
                console.log(error.message);
            });
    } else {
        const pageInput: Xrm.Navigation.CustomPage = {
            pageType: "custom",
            name: pageName,
            entityName: entityName,
            recordId: recId,
        };

        const navigationOptions: Xrm.Navigation.NavigationOptions = {
            target: target,
            width: convertToSize(width, defaultWidth),
            height: convertToSize(height, defaultHight),
            position: position,
            title: title,
        };

        Xrm.Navigation.navigateTo(pageInput, navigationOptions)
            .then(function () {
                // Called when page opens
                return true;
            })
            .catch(function (error) {
                // Handle error
                console.log(error.message);
            });
    }
}

function convertToSize(
    input: number | string,
    defaultSize: number,
): number | Xrm.Navigation.NavigationOptions.SizeValue | undefined {
    let result: number | Xrm.Navigation.NavigationOptions.SizeValue | undefined = defaultSize;

    if (typeof input === "number") {
        if (input > 0) {
            result = input;
        }
    } else {
        const parsedInput = Number(input);
        if (isNaN(parsedInput)) {
            if (input.endsWith("px")) {
                const numberPart = Number(input.substring(0, input.length - 2));
                if (!isNaN(numberPart)) {
                    result = { value: numberPart, unit: "px" } as Xrm.Navigation.NavigationOptions.SizeValue;
                }
            } else if (input.endsWith("%")) {
                const numberPart = Number(input.substring(0, input.length - 1));
                if (!isNaN(numberPart)) {
                    result = { value: numberPart, unit: "%" } as Xrm.Navigation.NavigationOptions.SizeValue;
                }
            }
        } else {
            if (parsedInput > 0) {
                result = parsedInput;
            }
        }
    }

    return result;
}

function convertToNumber(input: number | string, defaultSize: number): number | undefined {
    let result: number | undefined = defaultSize;

    if (typeof input === "number") {
        if (input > 0) {
            result = input;
        }
    } else {
        const parsedInput = Number(input);
        if (isNaN(parsedInput)) {
            if (input.endsWith("px")) {
                const numberPart = Number(input.substring(0, input.length - 2));
                if (!isNaN(numberPart)) {
                    result = numberPart;
                }
            } else if (input.endsWith("%")) {
                const numberPart = Number(input.substring(0, input.length - 1));
                if (!isNaN(numberPart)) {
                    result = defaultSize;
                }
            }
        } else {
            if (parsedInput > 0) {
                result = parsedInput;
            }
        }
    }

    return result;
}

export function idWithoutBrackets(id: string): string {
    if (id && id.slice(0, 1) === "{") {
        return id.slice(1, -1);
    } else {
        return id;
    }
}
