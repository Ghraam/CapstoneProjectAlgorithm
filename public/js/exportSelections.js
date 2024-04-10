import { comAPI } from "./apicall.js";
import { getData } from "./importSections.js";

async function getTimeBlock(block) {
    const timeBlocks = await comAPI('time_blocks', 'index', 'GET');

    block = block.replace(/(\w+)(\d+)/, "$1 $2");
    console.log("Block: ", block);

    let id = null;

    for (const timeBlock of timeBlocks) {
        if (timeBlock.identifier === block) {
            console.log("Found it! ", block, " ", timeBlock.id);
            id = timeBlock.id;
            return id;
        } else {
            // Nothing
        }
    }

}

async function sendData(sectionData) {
    const courseID = sectionData.courseID;
    const section = sectionData.section;
    const id = `${courseID}_${section}`;

    const startTime = sectionData.startTime;
    const endTime = sectionData.endTime;

    const start = await getTimeBlock(startTime);
    const end = await getTimeBlock(endTime);

    const data = [
        {"course_id": sectionData.courseID, "section_num": sectionData.section,
        "professor_id": sectionData.professorID, "start": start, "end": end,
        "classroom_id": sectionData.classroomID}
    ];

    // Make api update call
    await comAPI('sections', 'update', 'PUT', data, id);
}

async function combineData(sectionData) {
    const id = `${sectionData.course}-${sectionData.classroom}-${sectionData.professor}`
    const sisterID = id + "sister";
    const startTime = document.getElementById(id).parentElement.id;
    const endTime = document.getElementById(sisterID).parentElement.id;

    sectionData.startTime = startTime;
    sectionData.endTime = endTime;

    return sectionData;
}

async function parseTableData() {
    console.log("Working")
    try {

        const fullSectionsData = await getData();

        for (const sectionData of fullSectionsData) {
            const data = await combineData(sectionData);
            sendData(data);
        }

        console.log(fullSectionsData);
        // Call a function to process the parsed data
        // ...
    } catch (error) {
        console.error('Error parsing table data:', error);
    }
}

document.getElementById('update-button').addEventListener('click', parseTableData);
