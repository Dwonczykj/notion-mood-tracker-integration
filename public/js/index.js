// public/js/index.js

// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);
require('dotenv').config()
console.log(process.env)
import { Client, APIErrorCode } from "@notionhq/client"

const notion = new Client({ auth: process.env.NOTION_KEY })

const databaseId = process.env.NOTION_DATABASE_ID

item_types = [
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
              "text": {
                "content": text
              }
            }
          ]
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
      case ClientErrorCode.RequestTimeout:
        // ...
        break
      case APIErrorCode.ObjectNotFound:
        // ...
        break
      case APIErrorCode.Unauthorized:
        // ...
        break
      // ...
      default:
        // you could even take advantage of exhaustiveness checking
        assertNever(error.code)
    }
  }
}

async function getItem(item_name) {
  try {
    const response = notion.pages.retrieve()
  } catch (error) {
    process_notion_error(error);
  }
}

async function queryNotion(item_name) {
  try {
    const myPage = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "title",
        text: {
          contains: "Work Productivity",
        },
      },
    })
  } catch (error) {
    if (error.code === APIErrorCode.ObjectNotFound) {
      //
      // For example: handle by asking the user to select a different database
      //
    } else {
      // Other error handling code
      console.error(error)
    }
  }
}

addItem("Yurts in Big Sur, California", item_types[0])