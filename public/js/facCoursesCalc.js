//Displays the table of courses, the number of courses needed, and the faculty available to teach them. 

window.onload = startup();

var upDateCourse = [];
courseArray = [];
nameCountArray = [];



function startup() {
    localforage.getItem("currentFacultyCourses", function(err, currFC) {
        // localforage.getItem("oddDayTimes", function(err, OD) {
        localforage.getItem("currentAvailableFaculty", function(err, availFac) {
            console.log(currFC);
            console.log(availFac);
            let index = -1;
            let oldNames = [];
            //THIS SECTION GOES THROUGH THE CFC AND TAKES OUT ANY NAMES OF FACULTY WHO ARE NO LONGER AVAILABLE
            for (let a = 0; a < currFC.length; a++) {

                let currName = currFC[a].Name;
                //console.log(currName);
                index = availFac.indexOf(currName);
                //console.log(currName, index);
                if (index == -1) {
                    console.log(a, currName, index)
                    oldNames.push(currName);
                }
            };
            for (let b = 0; b < oldNames.length; b++) {
                for (let c = 0; c < currFC.length; c++) {
                    if (oldNames[b] === currFC[c].Name) {
                        currFC.splice(c, 1);
                    }
                }
            }
            console.table(currFC);
            /*
                    let oddArray = [];
                    for (var a = 0; a < OD.length; a++) {
                        let cNum = OD[a].CourseNum.split("-")[0] + "-" + OD[a].CourseNum.split("-")[1];
                        oddArray.push(cNum);
                    };
                    let oddNote = "Because " + oddArray + " have one method, but two uneven classes, these will display the teacher name twice."

            */
            localforage.setItem("currentFacultyCourses", currFC, function(err, facCourses) {
                localforage.keys().then(function(keys) {
                    //console.log(keys);
                    tableCreate(facCourses);
                    makeAllNames(facCourses);
                    makeAddSelect(availFac, facCourses);

                });
            });
        });
    });

};


function tableCreate(CFC) {
    console.log('tableCreate'); //THIS CREATES THE TABLE FOR THE COURSES

    document.getElementById('courseNameContainer').innerHTML = "";
    var body = document.body,
        tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.setAttribute('class', 'nameDragTable');
    tbl.setAttribute('id', 'nameDragTable');

    localforage.getItem('currentRequiredCoursesCount', function(err, semesterCourses) {
        //console.table(semesterCourses);
        if (!semesterCourses) {
            alert("There seems to be an error here: you may need to go back and fill in how many sections are needed for the courses. Go to 'Input', then 'Sections'.")
        };

        for (var i = 0; i < semesterCourses.length; i++) {
            var fullCourse = semesterCourses[i].CourseNum;
            courseArray.push(fullCourse);
            var tr = tbl.insertRow();
            for (var j = 0; j < 2; j++) {
                var td = tr.insertCell();
                td.setAttribute('id', ('cell' + j + i));
                td.style.border = '1px solid black';
                td.setAttribute('title', 'First number is the count of those scheduled. Second number is how many are required. Final number is the difference: a positive number means more are needed, a negative number means that there are too many. Yellow color means there are more needed, red that there are fewer needed, and green is just right.  ');
            }
        };


        document.getElementById('courseNameContainer').appendChild(tbl);
        makeCourseBoxes(semesterCourses);

    });

    //initialPopulateTable();	
};

function makeCourseBoxes(tyCourses) { //THIS MAKES THE DROP AREAS FOR EACH COURSE
    console.log('makeCourseBoxes');
    var boxContainer = document.createDocumentFragment();

    //console.table(tyCourses)

    for (var i = 0; i < tyCourses.length; i++) {
        var box = document.createElement("div");
        var boxID = "box" + tyCourses[i].CourseNum;
        //var boxID = tyCourses[i].CourseNum;

        box.setAttribute('id', boxID);
        box.setAttribute('class', 'dropTarget');
        box.setAttribute('ondrop', 'drop(event, this)');
        box.setAttribute('ondragover', "allowDrop(event)");
        //box.onchange = readDragTable;

        document.getElementById("cell" + "1" + i).appendChild(box);
    };
    makeCourseDivs(tyCourses);
    initialPopulateTable();
    //readDragTable();	
};
//THIS ATTCHES THE NAMES BOXES TO THE CORRECT COURSE BOX
function initialPopulateTable() {
    console.log('initialPopulateTable');
    localforage.getItem("currentFacultyCourses", function(err, currArray) {

        //console.log(document.getElementById('holdingPen').innerHTML);
        let lastCourse = "";
        let lastMeth = "";

        for (var c = 0; c < currArray.length; c++) {
            var abName = currArray[c].Name;
            var abMeths = currArray[c].comboMethods;
            //var initMeth = currArray[c].comboMeths;

            for (var d = 0; d < currArray[c].TYCourses.length; d++) {
                var cCourse = currArray[c].TYCourses[d];
                var nameID = abName + "." + (d);
                var boxID = "box" + cCourse;
                var comboMeths = currArray[c].comboMethods[d];
                var thisMeth = currArray[c].Method[d];

                //console.log("Initial: ", cCourse, nameID, boxID, thisMeth, comboMeths);

                var thisBox = document.getElementById(boxID);
                var thisName = document.getElementById(nameID);



                //IF THIS CLASS IS PART OF A SPLIT METHOD (STN/LAB, STN/FLD ETC.) THEN ONLY PLACE THE DRAGGER FOR ONE PART OF IT AND LEAVE THE OTHER IN THE HOLDING BOX. THIS PREVENTS HAVING DOUBLE THE DRAGGERS IN THE COURSE BOX. 


                if (comboMeths !== "") {
                    if (thisMeth !== "FLD" && thisMeth !== "LAB") {
                        console.log("SPLIT? ", cCourse, comboMeths, thisMeth);
                        if (thisName && thisBox) {
                            thisBox.appendChild(thisName);
                        }
                    }


                } else {
                    if (thisName && thisBox) {
                        thisBox.appendChild(thisName);
                    }
                }


            };
        };

    });
    readDragTable();
};

//THIS CHECKS HOW MANY PEOPLE ARE NEEDED FOR EACH COURSE
function readDragTable() {

    console.log("readDragTable");
    //localforage.keys().then(function(keys) {
    //    console.log(keys);
    //});

    document.getElementById("alertDiv").innerHTML = "";
    localforage.getItem("currentSections", function(err, currSec) {
        localforage.getItem('currentRequiredCoursesCount', function(err, courseCount) {
            //console.table(currSec);

            upDateCourse = [];

            for (var a = 0; a < currSec.length; a++) {
                upDateCourse.push({ 'CName': currSec[a][1], 'Req': currSec[a][4] });
            };
            //console.table(upDateCourse);


            for (var i = 0; i < upDateCourse.length; i++) {
                var fubar = document.getElementById('box' + upDateCourse[i].CName).children;
                var tempList = [];
                for (var j = 0; j < fubar.length; j++) {
                    var tempName = fubar[j].id;
                    var bareName = tempName.split('.')[0];

                    //console.log(bareName);
                    tempList.push(bareName);

                }
                upDateCourse[i].courseFac = tempList;
                upDateCourse[i].actual = tempList.length;
                upDateCourse[i].needed = upDateCourse[i].Req - upDateCourse[i].actual;




            };

            let totalFacultyNeeded = 0;
            //SAVE UPDATED COURSES COUNT
            for (var f = 0; f < upDateCourse.length; f++) {
                //console.log(upDateCourse[f]);
                for (var g = 0; g < courseCount.length; g++) {
                    if (upDateCourse[f].CName == courseCount[g].CourseNum) {
                        //console.log(courseCount[g].CourseNum);
                        courseCount[g].Actual = upDateCourse[f].actual;
                        courseCount[g].Needed = upDateCourse[f].needed;
                        courseCount[g].Faculty = upDateCourse[f].courseFac;

                        totalFacultyNeeded = totalFacultyNeeded + upDateCourse[f].needed;

                    };
                }
            };

            localforage.setItem('currentRequiredCoursesCount', courseCount, function(err, CRCC) {

                if (totalFacultyNeeded > 0) {
                    document.getElementById("facultyCount").innerText = totalFacultyNeeded + " sections fewer than needed overall.";
                }
                if (totalFacultyNeeded < 0) {
                    document.getElementById("facultyCount").innerText = totalFacultyNeeded + " sections more than needed overall.";
                }
            });


            //DISPLAY UPDATED COURSES COUNT IN TABLE
            for (var a = 0; a < upDateCourse.length; a++) {
                var targetCell = document.getElementById('cell0' + a);
                let plusOrMinus = -1 * upDateCourse[a].needed; //CHANGES TO + OR -
                let operator = "";
                if (plusOrMinus > 0) { operator = "+" }; //INCLUDES "+" IF POSITIVE


                targetCell.innerHTML = '<strong>' + upDateCourse[a].CName + "</strong><br>" + upDateCourse[a].actual + "/" + upDateCourse[a].Req + "/" + operator + plusOrMinus;
                if (plusOrMinus < 0) {
                    targetCell.style.backgroundColor = "#F3F781";
                };
                if (plusOrMinus === 0) {
                    targetCell.style.backgroundColor = "#A9F5A9";
                };
                if (plusOrMinus > 0) {
                    targetCell.style.backgroundColor = "#F6CECE";
                };
            };
            //saveData(upDateCourse);
        });
    });
};

var facCoursesNameCount = [];

function makeAllNames(pData) { //CALCULATES HOW MANY CLASSES EACH PERSON IS SCHEDULED FOR
    console.log('makeAllNames');
    //console.table(pData);

    for (var i = 0; i < pData.length; i++) {
        var howManyClasses = pData[i].Norm;
        if (howManyClasses < pData[i].TYCourses.length) {
            howManyClasses = pData[i].TYCourses.length;
        };
        for (j = 0; j < howManyClasses; j++) {
            nameDivID = pData[i].Name + '.' + (j);
            makeUpperNameBox(pData[i].Name, nameDivID);
        }
        facCoursesNameCount.push([pData[i].Name, j]);
    };
    // console.table(facCoursesNameCount);
};

function makeUpperNameBox(abName, nameDivID) { //ADDS ALL NAMES TO UPPER NAME BOX. THEY MAY THEN BE MOVED AUTOMATICALLY TO THE CORRECT COURSE.
    console.log('makeUpperNameBox');
    var nameDiv = document.createElement('div');
    nameDiv.setAttribute('class', 'dragger');
    nameDiv.setAttribute('id', nameDivID);
    nameDiv.setAttribute('name', nameDivID);
    nameDiv.setAttribute('draggable', "true");
    nameDiv.setAttribute('ondragstart', "drag(event, this)");
    nameDiv.style.backgroundColor = getNameColor(abName);
    nameDiv.innerHTML = abName;

    holdingPen.appendChild(nameDiv);
};

function makeAddSelect(availArray, facCFC) { //CREATES DROP-MENU FOR NAMES
    console.log('makeAddSelect');
    var facNames = [];
    ////ADDED 30/1/22 TO MAKE SURE AVAIL FAC WAS ADDED TO SELECT, RATHER THAN JUST CFC NAMES
    if (!availArray) {
        for (var i = 0; i < facCFC.length; i++) {
            facNames.push(facCFC[i].Name);
        }
    } else {
        for (let j = 0; j < availArray.length; j++) {
            facNames.push(availArray[j]);
        };
    }

    var sel = document.getElementById("addName");
    sel.innerHTML = "";
    var arrayLen = facNames.length;

    var option = document.createElement("option");
    option.value = "";
    option.text = "Select faculty name";
    sel.appendChild(option);
    for (var i = 0; i < arrayLen; i++) {
        var option = document.createElement("option");
        option.value = facNames[i];
        option.text = facNames[i];
        //console.log(array[i]);
        sel.appendChild(option);
    };
};


function addNameToTable() { //IF NAME ADDED TO TABLE, ADDS NAME BOX AT TOP
    console.log('addNameToTable');
    localforage.getItem("currentFacultyCourses", function(err, cFC) {
        //console.table(cFC);

        var facName = document.getElementById("addName").value;
        if (facName !== "") {
            var ind = cFC.map(function(e) { return e.Name; }).indexOf(facName);
            console.log(ind);

            //cFC[ind].Wants++; 
            console.log("facCoursesCalc: ", cFC[ind].Name);
            //console.table(cFC);

            console.log(facName + "." + (cFC[ind].Wants))
            makeUpperNameBox(facName, facName + "." + (cFC[ind].Actual));

            localforage.setItem("currentFacultyCourses", cFC, function(err, facCourses) {
                //console.table(facCourses);

            });
        };
    });

};

function makeCourseDivs(ttyCourses) {
    console.log('makeCourseDivs');

    for (var a = 0; a < ttyCourses.length; a++) {
        document.getElementById('cell0' + a).innerHTML = '<b>' + ttyCourses[a].CourseNum + "</b> <br>" + ttyCourses[a].Req + "/" + 0 + "/" + 0;
    };
};

function clearHolding() {
    let r = confirm("Are you sure you want to do this? \r\nThis will clear all of the names from the box on the right!");
    if (r == true) {
        const myNode = document.getElementById("holdingPen");
        myNode.innerHTML = '';
    }
};

/*
///BASIC CODE FOR CLEARING TABLE OF NAMES -- NOT FINISHED
function getChildDivs(table) {
    const divs = table.querySelectorAll('div')
    return divs
};

function clearDaysTable() {
    const table = document.getElementById('courseNameContainer');
    //const divs = getChildDivs(table);
    const collection = table.getElementsByClassName("dragger");

    //collection.forEach(collection => {
    for (let i = 0, len = collection.length; i < len; i++) {
        console.log(collection[1]);
    }



    // div.remove();   
    //});
};
*/