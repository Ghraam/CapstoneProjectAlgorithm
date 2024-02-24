//Drag and drop functions 

nameCountArray = [];
colorArray = [];
parentID = "";

/*
var negDave = [																//Sound effects, no longer used, but could be reinstated. 
"../helpers/cantdo.wav",
"../helpers/enough_info.wav",
"../helpers/just_what.wav",
"../helpers/enough_info.wav",
"../helpers/quite_sure.wav",
"../helpers/difficult.wav"
];

function generateRandom() {
var rand = Math.floor(Math.random()*negDave.length);
return rand;	
}	

function getRandomNegDave() {
    var randomNum = generateRandom();
        document.getElementById("negaudio").src=negDave[randomNum];
};


window.onerror = function() {
	//localforage.getItem('soundOn', function(err, sound) {
	//console.log("localforage: " + sound);
		//if (sound) {
			//if (sound == "yes") {
				getRandomNegDave() 
				alert("Ooops! Could not drop name there.");
					return true;	
			//};		
		//}; 
	//});
};
*/

function addEventToClass(cls, fx, node = document, e = 'click') {
    Array.from(node.querySelectorAll('.' + cls)).forEach(elem => elem.addEventListener(e, fx));
}

function clickEvent(ev) { console.log('clicked item:', ev.target.id); }

addEventToClass('dragger', clickEvent);

function allowDrop(ev) { ev.preventDefault(); }

function drag(ev) {
    var id = ev.target.id;
    console.log("ID: ", id);
    ev.dataTransfer.setData("itemid", id);
    var source = id ? document.getElementById(ev.target.id).parentNode.id : '';
    ev.dataTransfer.setData("source", source);
}

function drop(ev, target, el) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");

    if (ev.target.id.indexOf('box') < 0 && ev.target.id.indexOf(',') > -1) {
        target = ev.target.parentNode;
        target.appendChild(document.getElementById(item));
        console.log(target.id);

    };

    var item = ev.dataTransfer.getData("itemid");


    ev.target.appendChild(document.getElementById(item));

    var startCourse = ev.dataTransfer.getData("source");
    console.log(startCourse);
    if (startCourse.includes("box")) {
        var startCourse = startCourse.slice(3, startCourse.length);
    };
    var endCourse = target.id;
    console.log(endCourse, ev);

    if (endCourse === "trash") {
        console.log("sending to trash");
        trashName(item, startCourse);
    } else {

        var facName = item.split(".")[0];
        var cIndex = item.split(".")[1];


        if (endCourse.includes("box")) {
            var endCourse = endCourse.slice(3, endCourse.length);
        };

        console.log("courseIndex is: ", cIndex);
        console.log('Name of dragged item is:', facName);
        console.log('id of startCourse:', startCourse);
        console.log('id of endCourse:', endCourse);


        let moveRecord = facName + " moved from " + startCourse + " to " + endCourse;
        if (startCourse !== endCourse) {
            saveToChangeLog(moveRecord);
        }


        saveDragData(facName, cIndex, startCourse, endCourse);
    };
};


//////////////BIN STUFF  
function trashName(item, sCourse) {
    console.log(item);

    var facName = item.split(".")[0];
    var cIndex = item.split(".")[1];

    console.log("courseIndex is: ", cIndex);
    console.log('Name of dragged item is:', facName);
    console.log('id of startCourse:', sCourse);
    console.log('length of startCourse:', sCourse.length);
    var nameDiv = document.getElementById(item);
    nameDiv.outerHTML = "";
    delete element;

    localforage.getItem('currentFacultyCourses', function(err, CFC) {
        var nameIndex = CFC.map(function(e) { return e.Name; }).indexOf(facName);
        console.log(nameIndex);
        console.table(CFC);
        if (sCourse === "holdingPen" && CFC[nameIndex].Norm > 0) {
            if (CFC[nameIndex].Norm > 0) {
                CFC[nameIndex].Norm = CFC[nameIndex].Norm - 1;
            };
        } else {
            var courseGroup = CFC[nameIndex].TYCourses;
            console.log(courseGroup);
            var courseIndex = courseGroup.indexOf(sCourse);
            CFC[nameIndex].TYCourses.splice(courseIndex, 1);
            CFC[nameIndex].TYTimes.splice(courseIndex, 1);
            if (CFC[nameIndex].Norm > 0) {
                CFC[nameIndex].Norm = CFC[nameIndex].Norm - 1;
            };
        };

        localforage.setItem("currentFacultyCourses", CFC, function(err, facCourses) {
            console.log(item + "deleted!");
            document.getElementById("trashAlert").innerHTML = "One " + facName.split(",")[0] + "<br> deleted!";
            console.log(facCourses[nameIndex].Norm);
        });

    });
};


//////////////END BIN STUFF 


function saveDragData(facName, courseIndex, oldCourse, newCourse) {

    console.log(facName, courseIndex, oldCourse, newCourse);

    localforage.getItem('currentFacultyCourses', function(err, facCs) {
        localforage.getItem('courses', function(err, crses) {
            //console.table(crses);


            var nameIndex = facCs.map(function(e) { return e.Name; }).indexOf(facName);
            var thisCourseIndex = facCs[nameIndex].TYCourses.indexOf(oldCourse);
            console.log(facCs[nameIndex]);
            nextCourseIndex = parseInt(courseIndex) - 1;


            if (oldCourse !== "holdingPen") {
                var csIndex = crses.map(function(e) { return e.num; }).indexOf(newCourse);
                var oldIndex = crses.map(function(e) { return e.num; }).indexOf(oldCourse);

                console.log(oldCourse, oldIndex);
                var oldMethod = crses[oldIndex].meth;
                var newCourseNum = newCourse;
                var oldCourseNum = oldCourse;
                var oldCombo = facCs[nameIndex].comboMethods[courseIndex];
                //var newClassLen = crses[csIndex].classLen;
                //var newCPW = crses[csIndex].perWeek;
                //var newMethod = crses[csIndex].meth;
                //var newCombo = newMethod + "~" + courseIndex + "~" + newCourse;
            } else {
                csIndex = crses.map(function(e) { return e.num; }).indexOf(newCourse);
                var newMethod = crses[csIndex].meth;
                var newCourseNum = newCourse;
                var newClassLen = crses[csIndex].classLen;
                var newCPW = crses[csIndex].perWeek;
                var newCombo = newMethod + "~" + courseIndex + "~" + newCourse;
            }

            //THESE ARE A SHIM TO INCLUDE METHOD AND COMBOMETHODS IN THE CRC, WHICH SEEM, FOR SOME REASON, OCCASIONALLY TO BE MISSING
            if (!facCs[nameIndex].Method) {
                facCs[nameIndex].Method = [];
            }

            if (!facCs[nameIndex].comboMethods) {
                facCs[nameIndex].comboMethods = [];
            }

            console.log(facCs[nameIndex]);
            let LYC = facCs[nameIndex].LYCourses;

            if (oldCourse === "holdingPen") {
                //IF THE DRAGGER COMES FROM THE HOLDING PEN
                console.log("namesDiv to newCourse: ", courseIndex, newCourse);
                //IF THE NEW COURSE METHOD IS SINGLE
                var newCPW = crses[csIndex].perWeek;
                var newMethod = crses[csIndex].meth;
                var newCourseNum = newCourse;
                var newClassLen = crses[csIndex].classLen;
                var newCPW = crses[csIndex].perWeek;
                var newCombo = "";

                console.log(facCs[nameIndex]);
                console.log(newMethod);

                if (newMethod.indexOf(",") < 0) {
                    facCs[nameIndex].TYCourses.push(newCourse);
                    facCs[nameIndex].TYTimes.push("TBD");
                    facCs[nameIndex].classLength.push(newClassLen);
                    facCs[nameIndex].CPW.push(newCPW);
                    facCs[nameIndex].Method.push(newMethod);
                    facCs[nameIndex].comboMethods.push(newCombo);
                } else {
                    //IF THE NEW COURSE METHOD IS DOUBLE
                    console.log(crses[csIndex]);
                    let methOne = crses[csIndex].meth.split(",")[0];
                    let methTwo = crses[csIndex].meth.split(",")[1].trim();
                    let CPWOne = crses[csIndex].perWeek.split(",")[0];
                    let CPWTwo = crses[csIndex].perWeek.split(",")[1];
                    let lenOne = crses[csIndex].classLen.split(",")[0];
                    let lenTwo = crses[csIndex].classLen.split(",")[1];
                    let comboOne = methOne + "~" + csIndex + "~" + newCourse;
                    let comboTwo = methTwo + "~" + csIndex + "~" + newCourse;
                    let startOne = "TBD";
                    let startTwo = "TBD";

                    facCs[nameIndex].TYCourses.push(newCourse);
                    facCs[nameIndex].TYTimes.push(startOne);
                    facCs[nameIndex].classLength.push(lenOne);
                    facCs[nameIndex].CPW.push(CPWOne);
                    facCs[nameIndex].Method.push(methOne);
                    facCs[nameIndex].comboMethods.push(comboOne);

                    facCs[nameIndex].TYCourses.push(newCourse);
                    facCs[nameIndex].TYTimes.push(startTwo);
                    facCs[nameIndex].classLength.push(lenTwo);
                    facCs[nameIndex].CPW.push(CPWTwo);
                    facCs[nameIndex].Method.push(methTwo);
                    facCs[nameIndex].comboMethods.push(comboTwo);

                }

            }

            if (newCourse === "holdingPen") {
                console.table("Initial Drop in holdingPen: ", facCs[nameIndex].TYCourses, facCs[nameIndex].TYTimes, facCs[nameIndex].index);
                console.log("Holding Pen", facCs[nameIndex].TYCourses, crses[oldIndex], "courseIndex: " + courseIndex);
                let matchingIndex = -1;
                for (let h = 0; h < facCs[nameIndex].TYCourses.length; h++) {
                    if (oldCourse === facCs[nameIndex].TYCourses[h]) {

                        console.log("CourseIndex: ", courseIndex, "Matching Index: ", h, "courseList: ", facCs[nameIndex].TYCourses[h]);
                        matchingIndex = h;
                        break;
                    }
                };
                console.log("matchingIndex: ", matchingIndex, facCs[nameIndex].TYCourses[matchingIndex]);
                ////MATCHING INDEX GETS THE FIRST MATCHING COURSE IN THE PERSON'S COURSELIST, THEREBY AVOIDING AN INCORRECT DELETION WHEN NAMES ARE DRAGGED TO THE HOLDING PEN. 

                if (courseIndex > -1) {
                    if (crses[oldIndex].meth.indexOf(",") < 0) {
                        //IF THERE IS ONLY ONE METHOD
                        facCs[nameIndex].TYCourses.splice(matchingIndex, 1);
                        facCs[nameIndex].TYTimes.splice(matchingIndex, 1);
                        facCs[nameIndex].classLength.splice(matchingIndex, 1);
                        facCs[nameIndex].CPW.splice(matchingIndex, 1);
                        facCs[nameIndex].Method.splice(matchingIndex, 1);
                        facCs[nameIndex].comboMethods.splice(matchingIndex, 1);
                    } else {
                        //IF THERE ARE TWO METHODS
                        //DELETE THE FIRST SET OF CLASSES
                        facCs[nameIndex].TYCourses.splice(matchingIndex, 1);
                        facCs[nameIndex].TYTimes.splice(matchingIndex, 1);
                        facCs[nameIndex].classLength.splice(matchingIndex, 1);
                        facCs[nameIndex].CPW.splice(matchingIndex, 1);
                        facCs[nameIndex].Method.splice(matchingIndex, 1);
                        facCs[nameIndex].comboMethods.splice(matchingIndex, 1);
                        //DELETE THE SECOND SET OF CLASSES
                        facCs[nameIndex].TYCourses.splice(matchingIndex, 1);
                        facCs[nameIndex].TYTimes.splice(matchingIndex, 1);
                        facCs[nameIndex].classLength.splice(matchingIndex, 1);
                        facCs[nameIndex].CPW.splice(matchingIndex, 1);
                        facCs[nameIndex].Method.splice(matchingIndex, 1);
                        facCs[nameIndex].comboMethods.splice(matchingIndex, 1);


                    }
                };
                console.log(facCs[nameIndex]);
            };




            if (oldCourse !== "holdingPen" && newCourse !== "holdingPen") {
                console.log(crses[csIndex]);
                newMethod = crses[csIndex].meth;
                oldMethod = crses[oldIndex].meth;
                newClassLen = crses[csIndex].classLen;
                oldCPW = crses[oldIndex].perWeek
                newCPW = crses[csIndex].perWeek;
                let oldClassLen = crses[oldIndex].classLen;
                //facCs[nameIndex].comboMethods[csIndex];

                if (newMethod.indexOf(",") < 0 && oldMethod.indexOf(",") < 0) {
                    //IF BOTH OLD AND NEW COURSES ARE SINGLE METHS
                    let newCombo = "";
                    console.log("No mixed method");
                    console.log("Old: ", oldCourse, oldMethod, oldClassLen, oldCPW, "New: ", newCourse, newMethod, newClassLen, newCPW);
                    facCs[nameIndex].TYCourses[courseIndex] = newCourse;
                    facCs[nameIndex].classLength[courseIndex] = newClassLen;
                    facCs[nameIndex].CPW[courseIndex] = newCPW;
                    facCs[nameIndex].Method[courseIndex] = newMethod;
                    facCs[nameIndex].comboMethods[courseIndex] = newCombo;

                }

                if (newMethod.indexOf(",") > -1 && oldMethod.indexOf(",") < 0) {
                    //IF NEW COURSE IS A DOUBLE AND OLD IS A SINGLE METH
                    let methOne = crses[csIndex].meth.split(",")[0];
                    let methTwo = crses[csIndex].meth.split(",")[1].trim();
                    let CPWOne = crses[csIndex].perWeek.split(",")[0];
                    let CPWTwo = crses[csIndex].perWeek.split(",")[1];
                    let lenOne = crses[csIndex].classLen.split(",")[0];
                    let lenTwo = crses[csIndex].classLen.split(",")[1];
                    let comboOne = methOne + "~" + csIndex + "~" + newCourse;
                    let comboTwo = methTwo + "~" + csIndex + "~" + newCourse;
                    let startOne = "TBD";
                    let startTwo = "TBD";

                    console.log("New is double, old single");

                    console.log("nameIndex: ", nameIndex);
                    console.log("Old: ", oldCourse, oldMethod, oldClassLen, oldCPW, oldCombo, "New: ", newCourse, newMethod, newClassLen, newCPW, newCombo);

                    facCs[nameIndex].TYCourses.splice(courseIndex, 1);
                    facCs[nameIndex].TYTimes.splice(courseIndex, 1);
                    facCs[nameIndex].classLength.splice(courseIndex, 1);
                    facCs[nameIndex].CPW.splice(courseIndex, 1);
                    facCs[nameIndex].Method.splice(courseIndex, 1);
                    facCs[nameIndex].comboMethods.splice(courseIndex, 1);

                    console.log(facCs[nameIndex]);

                    facCs[nameIndex].TYCourses.push(newCourse);
                    facCs[nameIndex].TYTimes.push(startOne);
                    facCs[nameIndex].classLength.push(lenOne);
                    facCs[nameIndex].CPW.push(CPWOne);
                    facCs[nameIndex].Method.push(methOne);
                    facCs[nameIndex].comboMethods.push(comboOne);

                    facCs[nameIndex].TYCourses.push(newCourse);
                    facCs[nameIndex].TYTimes.push(startTwo);
                    facCs[nameIndex].classLength.push(lenTwo);
                    facCs[nameIndex].CPW.push(CPWTwo);
                    facCs[nameIndex].Method.push(methTwo);
                    facCs[nameIndex].comboMethods.push(comboTwo);

                    console.log("nameIndex: ", nameIndex);

                }


                if (newMethod.indexOf(",") < 0 && oldMethod.indexOf(",") > -1) {
                    //IF NEW COURSE IS A SINGLE AND OLD IS A DOUBLE METH
                    console.log("New is single, old double");
                    let onlyMeth = crses[csIndex].meth;
                    let onlyCPW = crses[csIndex].perWeek
                    let onlyLength = crses[csIndex].classLen;
                    let onlyCombo = "";
                    let onlyStart = "TBD";


                    console.log("nameIndex: ", nameIndex);
                    console.log("Old: ", oldCourse, oldMethod, oldClassLen, oldCPW, oldCombo, "New: ", newCourse, onlyMeth, onlyCPW, onlyLength, onlyStart, onlyCombo);
                    /*	
                    	var i = facCs[nameIndex].TYCourses.length;
                    		while (i--) {
                    			if (facCs[nameIndex].TYCourses[i] === oldCourse) {
                    				console.log("Old indices: ", i, facCs[nameIndex].TYCourses[i]);
                    			}	
                    		}
                    */

                    let indexOne = parseInt(courseIndex);
                    let indexTwo = parseInt(courseIndex) + 1;
                    console.log("indicies: ", indexOne, indexTwo);

                    facCs[nameIndex].TYCourses.splice(indexOne, 1);
                    facCs[nameIndex].TYTimes.splice(indexOne, 1);
                    facCs[nameIndex].classLength.splice(indexOne, 1);
                    facCs[nameIndex].CPW.splice(indexOne, 1);
                    facCs[nameIndex].Method.splice(indexOne, 1);
                    facCs[nameIndex].comboMethods.splice(indexOne, 1);

                    //SECOND RUN OF SPLICING USES SAME INDEX, AS OLD INDEX IS GONE
                    facCs[nameIndex].TYCourses.splice(indexOne, 1);
                    facCs[nameIndex].TYTimes.splice(indexOne, 1);
                    facCs[nameIndex].classLength.splice(indexOne, 1);
                    facCs[nameIndex].CPW.splice(indexOne, 1);
                    facCs[nameIndex].Method.splice(indexOne, 1);
                    facCs[nameIndex].comboMethods.splice(indexOne, 1);


                    console.log(facCs[nameIndex]);

                    facCs[nameIndex].TYCourses.push(newCourse);
                    facCs[nameIndex].TYTimes.push(onlyStart);
                    facCs[nameIndex].classLength.push(onlyLength);
                    facCs[nameIndex].CPW.push(onlyCPW);
                    facCs[nameIndex].Method.push(onlyMeth);
                    facCs[nameIndex].comboMethods.push(onlyCombo);



                    console.log("nameIndex: ", nameIndex);

                }


                if (newMethod.indexOf(",") > -1 && oldMethod.indexOf(",") > -1) {
                    //IF NEW COURSE IS A DOUBLE AND OLD IS ALSO A DOUBLE METH
                    let methOne = crses[csIndex].meth.split(",")[0];
                    let methTwo = crses[csIndex].meth.split(",")[1].trim();
                    let CPWOne = crses[csIndex].perWeek.split(",")[0];
                    let CPWTwo = crses[csIndex].perWeek.split(",")[1];
                    let lenOne = crses[csIndex].classLen.split(",")[0];
                    let lenTwo = crses[csIndex].classLen.split(",")[1];
                    let comboOne = methOne + "~" + csIndex + "~" + newCourse;
                    let comboTwo = methTwo + "~" + csIndex + "~" + newCourse;
                    //let startOne = ;
                    //let startTwo = "TBD";

                    console.log("New is double, old double too");

                    console.log("Course 1: ", facCs[nameIndex].TYCourses[thisCourseIndex], facCs[nameIndex].Method[thisCourseIndex], facCs[nameIndex].CPW[thisCourseIndex], facCs[nameIndex].classLength[thisCourseIndex], facCs[nameIndex].comboMethods[thisCourseIndex]);
                    console.log("Course 2: ", facCs[nameIndex].TYCourses[thisCourseIndex + 1], facCs[nameIndex].Method[thisCourseIndex + 1], facCs[nameIndex].CPW[thisCourseIndex + 1], facCs[nameIndex].classLength[thisCourseIndex + 1], facCs[nameIndex].comboMethods[thisCourseIndex + 1]);

                    console.log("Old: ", oldCourse, oldMethod, oldClassLen, oldCPW, oldCombo);
                    console.log("New One: ", newCourse, methOne, lenOne, CPWOne, comboOne);
                    console.log("New Two: ", newCourse, methTwo, lenTwo, CPWTwo, comboTwo);

                    console.log(facCs[nameIndex]);
                    console.log(thisCourseIndex);

                    for (var a = 0; a < facCs[nameIndex].TYCourses.length; a++) {
                        if (facCs[nameIndex].TYCourses[a] === oldCourse) {
                            console.log("Old indices: ", a, facCs[nameIndex].TYCourses[a], facCs[nameIndex].comboMethods[a]);
                        }
                    }


                    /*			
                    			var i = facCs[nameIndex].TYCourses.length;
                    			console.log(oldCourse);
                    				while (i--) {
                    					console.log(facCs[nameIndex].TYCourses[i]);
                    					if (facCs[nameIndex].TYCourses[i] === oldCourse) {
                    						console.log("Found course: ", i, facCs[nameIndex].TYCourses[i]);
                    						facCs[nameIndex].TYCourses.splice(i, 1);
                    						facCs[nameIndex].TYTimes.splice(i, 1);
                    						facCs[nameIndex].classLength.splice(i, 1);
                    						facCs[nameIndex].CPW.splice(i, 1);
                    						facCs[nameIndex].Method.splice(i, 1);
                    						facCs[nameIndex].comboMethods.splice(i, 1);
                    					}	
                    				}
                    */

                    let indexOne = parseInt(courseIndex);
                    let indexTwo = parseInt(courseIndex) + 1;

                    console.log(indexOne, indexTwo, facCs[nameIndex].TYCourses[indexOne], facCs[nameIndex].TYCourses[indexTwo]);
                    /*		
                    	facCs[nameIndex].TYCourses.splice(indexOne, 1);
                    	facCs[nameIndex].TYTimes.splice(indexOne, 1);
                    	facCs[nameIndex].classLength.splice(indexOne, 1);
                    	facCs[nameIndex].CPW.splice(indexOne, 1);
                    	facCs[nameIndex].Method.splice(indexOne, 1);
                    	facCs[nameIndex].comboMethods.splice(indexOne, 1);	
                    	
                    	facCs[nameIndex].TYCourses.splice(indexTwo, 1);
                    	facCs[nameIndex].TYTimes.splice(indexTwo, 1);
                    	facCs[nameIndex].classLength.splice(indexTwo, 1);
                    	facCs[nameIndex].CPW.splice(indexTwo, 1);
                    	facCs[nameIndex].Method.splice(indexTwo, 1);
                    	facCs[nameIndex].comboMethods.splice(indexTwo, 1);
                    */
                    console.log(facCs[nameIndex]);

                    facCs[nameIndex].TYCourses[indexOne] = newCourse;
                    facCs[nameIndex].CPW[indexOne] = CPWOne;
                    facCs[nameIndex].classLength[indexOne] = lenOne;
                    facCs[nameIndex].Method[indexOne] = methOne;
                    facCs[nameIndex].comboMethods[indexOne] = comboOne;
                    if (facCs[nameIndex].comboMethods[indexOne] !== methOne) {
                        facCs[nameIndex].TYTimes[indexOne] = "TBD";
                    }

                    facCs[nameIndex].TYCourses[indexTwo] = newCourse;
                    facCs[nameIndex].CPW[indexTwo] = CPWTwo;
                    facCs[nameIndex].classLength[indexTwo] = lenTwo;
                    facCs[nameIndex].Method[indexTwo] = methTwo;
                    facCs[nameIndex].comboMethods[indexTwo] = comboTwo;
                    //facCs[nameIndex].TYTimes[indexTwo] = "TBD";
                    if (facCs[nameIndex].comboMethods[indexTwo] !== methTwo) {
                        facCs[nameIndex].TYTimes[indexTwo] = "TBD";
                    }




                    console.log(facCs[nameIndex]);

                }


            };




            localforage.setItem("currentFacultyCourses", facCs, function(err, facCourses) {
                console.log(facCourses[nameIndex].TYCourses, facCourses[nameIndex].TYTimes);
                clearTimes(facCourses);
            });

        });
    });

    readDragTable();
};

function clearTimes(facCrs) {
    for (var i = 0; i < facCrs.length; i++) {
        if (facCrs[i].TYCourses.length < facCrs[i].TYTimes.length) {
            console.log("Missing stuff: " + facCrs[i].Name, facCrs[i].TYCourses)
        };
    };
};