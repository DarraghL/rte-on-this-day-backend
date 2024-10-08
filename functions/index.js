const { onSchedule } = require("firebase-functions/v2/scheduler");
const { setGlobalOptions } = require("firebase-functions/v2");
const { scrapeData } = require("./scraper");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

setGlobalOptions({ region: "europe-west2" });

const getToday = () => {
    const today = new Date();
    return `${today.getDate()}${today.getMonth() + 1}${today.getFullYear()}`;
};

exports.pubsub = onSchedule({
    // Schedule set to 11 PM UTC to account for BST offset
    schedule: "0 23 * * *",
    memory: "1GiB",
    timeoutSeconds: 60  
}, async (event) => {
    console.log("pubsub function triggered");
    try {
        const scrapedData = await scrapeData();
        return db.collection('days').doc(getToday()).set(scrapedData);
    } catch (error) {
        console.error("Error in pubsub function:", error);
        throw new Error(error);
    }
});