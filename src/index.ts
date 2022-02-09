// web/src/js/index.js

// These lines make "require" available
import { createRequire } from "module";
// const require = createRequire(import.meta.url);
require('dotenv').config()
console.log(process.env)
import { Client, APIErrorCode } from "@notionhq/client"
// import { ClientErrorCode } from "@notionhq"

const notion = new Client({ auth: process.env.NOTION_KEY })

const databaseId = process.env.NOTION_DATABASE_ID

var item_types = [
    "Woke up",
    "Coffee",
    "Work Productivity",
    "Walk",
    "Gym",
    "Food",
    "Plan"
]

async function addItem(text, item_type) {
    try {
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                title: {
                    title: [
                        {
                            text: {
                                content: text
                            },
                            type: "text"
                        }
                    ],
                    type: "title"
                },

            },
        })
        console.log(response)
        console.log("Success! Entry added.")
        return response;
    } catch (error) {
        console.error(error.body)
    }
}

function process_notion_error(error) {
    if (isNotionClientError(error)) {
        // error is now strongly typed to NotionClientError
        switch (error.code) {
            // case ClientErrorCode.RequestTimeout:
            //     // ...
            //     break
            case APIErrorCode.ObjectNotFound:
                // ...
                break
            case APIErrorCode.Unauthorized:
                // ...
                break
            // ...
            default:
                // you could even take advantage of exhaustiveness checking
                console.error(error.code)
        }
    }
}

async function getPropertiesForPages() {
    let first_page_props = {};
    try {
        const response = await notion.search({
            query: '', // The query parameter matches against the page titles. If the query parameter is not provided, the response will contain all pages (and child pages) in the results.
            sort: {
                direction: 'ascending',
                timestamp: 'last_edited_time',
            },
            filter: {
                property: "object",
                value: "page" // The value of the property to filter the results by. Possible values for object type include page or database. Limitation: Currently the only filter allowed is object which will filter by type of object (either page or database)
            }
        });
        if ("results" in response) {
            first_page_props = response["results"]["properties"];
            return first_page_props;
        }

    } catch (error) {
        process_notion_error(error);
    }
    return first_page_props;
}

async function create_page_mood_tracker(item_type) {
    try {
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            //     "object": "page",
            //     // "created_time": "2022-02-07T09:03:00.000Z", 
            //     // "last_edited_time": "2022-02-07T09:04:00.000Z", 
            //     // "cover": null, 
            //     "icon": {
            //         "type": "emoji",
            //         "emoji": "☕"
            //     },
            //     "parent": {
            //         "database_id": "bcce6a6f-ed02-49a8-bed9-32331de453d2"
            //     },
            //     "archived": false,
            properties: { //https://developers.notion.com/reference/property-value-object
                "Name": {
                    "title": [
                        {
                            "type": "text",
                            "text": {
                                "content": "Black Coffee",
                                "link": null
                            },
                            "annotations": { "bold": false, "italic": false, "strikethrough": false, "underline": false, "code": false, "color": "default" },
                            "plain_text": "Black Coffee",
                            "href": null
                        }
                    ],
                    "type": "title"
                },
                "Tags": {
                    "type": "multi_select",
                    "multi_select": [
                        {
                            "id": "4e9e63bd-cafe-4bab-b7a2-866c918b6c1f",
                            "name": "Coffee",
                            "color": "brown"
                        }
                    ]
                },
                "Ingredients": {
                    "type": "multi_select",
                    "multi_select": []
                },
                "Healthy": { "type": "checkbox", "checkbox": false },
                "Fish": { "type": "checkbox", "checkbox": false },
                "Meat": { "type": "checkbox", "checkbox": false },
                "Window": { "type": "date", "date": { "start": "2022-02-07T07:15:00.000+00:00", "end": null } },
                "Size": { "type": "select", "select": { "id": "ffcdf1f3-6827-4e47-a83b-e41ee3e7d8c8", "name": "Large", "color": "green" } },
                "Created": { "type": "created_time", "created_time": "2022-02-07T09:03:00.000Z" },

            },
            // "url": "https://www.notion.so/Black-Coffee-c36a1718a5ef492aad448850545e1de2"
        });
        return response;
    } catch (error) {
        process_notion_error(error);
        return error;
    }
}

/// Returns an example page with link https://www.notion.so/gember/Black-Coffee-c36a1718a5ef492aad448850545e1de2 for a coffee log in the mood tracker.
async function get_example_page() {
    const pageId = 'c36a1718a5ef492aad448850545e1de2';
    const response = await notion.pages.retrieve({ page_id: pageId });
    console.log(response);
    return response;
}

(async () => {
    //   var response = await get_example_page();
    //   console.info(response);
})();

export {
    get_example_page,
    create_page_mood_tracker,
    getPropertiesForPages
}

function isNotionClientError(error: any) {
    return true;
    // throw new Error("Function not implemented.");
}
