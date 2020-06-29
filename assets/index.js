$.ajaxSetup({ cache: false });
// check out this project too
// https://studio.code.org/projects/applab/BOljhCcxJA0uHsCIj9X4Pd4BA9gGci5XB4F5WeCWJXI/view

/**
 * Convert stylized size to actual number.
 * @param {string} size Stylized size in form x[KMG], where x is a float.
 */
function sizeUnstyler(size) {
    const unit = size.trim().toUpperCase().slice(-1);
    if (unit === "K") {
        return parseFloat(size) * 1024;
    } else if (unit === "M") {
        return parseFloat(size) * 1048576;
    } else if (unit === "G") {
        return parseFloat(size) * 1073741824;
    } else {
        return parseFloat(size);
    }
}

$.getJSON("assets/projects.json", function (projects) {
    /** Non-standard documentation for @param {Object} projects
    * Metadata for all my projects.
    * Each nested object contains the metadata for the project given by the
    * object's key. They have the following properties:
    * @property {string} name Name which appears on the index
    * @property {string} [path] Path to the project's folder.
    *  If not given, the object's key will be used instead.
    * @property {string} size Size of resources required to load website.
    * @property {Object} [altIcon] Alternative icon if needed.
    * @property {string} altIcon.src Image URL
    * @property {string} altIcon.alt Image alt text
    */

    $(document).ready(function () {
        // clear error message in address element
        $("address").html("Some server at " + window.location.hostname + ".");
        $("h1").html("Index of " + window.location.pathname);
        $("title").html("Index of " + window.location.pathname)

        // get sort settings
        /** query given in url */
        const params = window.location.search.slice(1).split(";");
        /** if sort order should get reversed */
        const reverseOrder = params[1] ? params[1].split("=")[1] === "D" : false;
        var sortedProjectNames;

        // handle sort settings and change links
        // N for Name; M for last Modified; S for Size
        switch (params[0] ? params[0].split("=")[1] : "M") {
            case "M":
                sortedProjectNames = Object.keys(projects).sort(function (a, b) {
                    const dateA = projects[a].modified;
                    const dateB = projects[b].modified;

                    if (dateA < dateB) {
                        return -1;
                    } else if (dateA > dateB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                // change appropriate header link to allow descending sort
                if (reverseOrder) {
                    sortedProjectNames.reverse();
                } else {
                    $(".indexhead .indexcollastmod a").prop("href", "?C=M;O=D");
                }
                break;
            case "S":
                sortedProjectNames = Object.keys(projects).sort(function (a, b) {
                    const sizeA = sizeUnstyler(projects[a].size);
                    const sizeB = sizeUnstyler(projects[b].size);

                    if (sizeA < sizeB) {
                        return -1;
                    } else if (sizeA > sizeB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                if (reverseOrder) {
                    sortedProjectNames.reverse();
                } else {
                    $(".indexhead .indexcolsize a").prop("href", "?C=S;O=D");
                }
                break;
            case "N":
            default:
                sortedProjectNames = Object.keys(projects).sort();
                if (reverseOrder) {
                    sortedProjectNames.reverse();
                } else {
                    $(".indexhead .indexcolname a").prop("href", "?C=N;O=D");
                }
                break;
        }
        // reverse sort order if needed
        // A for Ascending; D for Descending
        if (params[1] === "D") {
            sortedProjectNames.reverse();
        }

        // build the table
        for (let i = 0; i < sortedProjectNames.length; i++) {
            const projectName = sortedProjectNames[i];
            const project = projects[projectName];
            // the only reason why i'm not using for of
            const parity = i % 2 ? "odd" : "even";
            const path = project.path ? project.path : projectName + "/";
            // set icon
            const icon = project.altIcon ? project.altIcon : {
                src: "assets/text.gif",
                alt: "[TXT]"
            };

            // append to table
            $(".indexbreakrow:last").before(`
<tr class="${parity}" id="${projectName}">
<td class="indexcolicon"><img src="${icon.src}" alt="${icon.alt}"></td>
<td class="indexcolname"><a href="${path}">${project.name}</a></td>
<td class="indexcollastmod">${project.modified}</td>
<td class="indexcolsize">${project.size}</td>
</tr>`);
        }
    });
}).fail(function () {
    console.error("uh oh error getting projects.json");
});
