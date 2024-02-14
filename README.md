# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

## ER Diagram
![ER Diagram](https://i.imgur.com/dvxh010.png)

## API Specification
```json
{
    "assignments": {
        "index": {
            "url": "/assignments.json",
            "method": "GET",
            "description": "Get all assignments"
        },
        "show": {
            "url": "/assignments/:id.json",
            "method": "GET",
            "description": "Get a single assignment"
        },
        "create": {
            "url": "/assignments.json",
            "method": "POST",
            "description": "Create a new assignment"
        },
        "update": {
            "url": "/assignments/:id.json",
            "method": "PUT",
            "description": "Update an assignment"
        },
        "destroy": {
            "url": "/assignments/:id.json",
            "method": "DELETE",
            "description": "Delete an assignment"
        }
    },
    "classrooms": {
        "index": {
            "url": "/classrooms.json",
            "method": "GET",
            "description": "Get all classrooms"
        },
        "show": {
            "url": "/classrooms/:id.json",
            "method": "GET",
            "description": "Get a single classroom"
        },
        "create": {
            "url": "/classrooms.json",
            "method": "POST",
            "description": "Create a new classroom"
        },
        "update": {
            "url": "/classrooms/:id.json",
            "method": "PUT",
            "description": "Update a classroom"
        },
        "destroy": {
            "url": "/classrooms/:id.json",
            "method": "DELETE",
            "description": "Delete a classroom"
        }
    },
    "course_preferences": {
        "index": {
            "url": "/course_preferences.json",
            "method": "GET",
            "description": "Get all course preferences"
        },
        "show": {
            "url": "/course_preferences/:id.json",
            "method": "GET",
            "description": "Get a single course preference"
        },
        "create": {
            "url": "/course_preferences.json",
            "method": "POST",
            "description": "Create a new course preference"
        },
        "update": {
            "url": "/course_preferences/:id.json",
            "method": "PUT",
            "description": "Update a course preference"
        },
        "destroy": {
            "url": "/course_preferences/:id.json",
            "method": "DELETE",
            "description": "Delete a course preference"
        }
    },
    "courses": {
        "index": {
            "url": "/courses.json",
            "method": "GET",
            "description": "Get all courses"
        },
        "show": {
            "url": "/courses/:id.json",
            "method": "GET",
            "description": "Get a single course"
        },
        "create": {
            "url": "/courses.json",
            "method": "POST",
            "description": "Create a new course"
        },
        "update": {
            "url": "/courses/:id.json",
            "method": "PUT",
            "description": "Update a course"
        },
        "destroy": {
            "url": "/courses/:id.json",
            "method": "DELETE",
            "description": "Delete a course"
        }
    },
    "professors": {
        "index": {
            "url": "/professors.json",
            "method": "GET",
            "description": "Get all professors"
        },
        "show": {
            "url": "/professors/:id.json",
            "method": "GET",
            "description": "Get a single professor"
        },
        "create": {
            "url": "/professors.json",
            "method": "POST",
            "description": "Create a new professor"
        },
        "update": {
            "url": "/professors/:id.json",
            "method": "PUT",
            "description": "Update a professor"
        },
        "destroy": {
            "url": "/professors/:id.json",
            "method": "DELETE",
            "description": "Delete a professor"
        }
    },
    "time_blocks": {
        "index": {
            "url": "/time_blocks.json",
            "method": "GET",
            "description": "Get all time blocks"
        },
        "show": {
            "url": "/time_blocks/:id.json",
            "method": "GET",
            "description": "Get a single time block"
        },
        "create": {
            "url": "/time_blocks.json",
            "method": "POST",
            "description": "Create a new time block"
        },
        "update": {
            "url": "/time_blocks/:id.json",
            "method": "PUT",
            "description": "Update a time block"
        },
        "destroy": {
            "url": "/time_blocks/:id.json",
            "method": "DELETE",
            "description": "Delete a time block"
        }
    },
    "time_preferences": {
        "index": {
            "url": "/time_preferences.json",
            "method": "GET",
            "description": "Get all time preferences"
        },
        "show": {
            "url": "/time_preferences/:id.json",
            "method": "GET",
            "description": "Get a single time preference"
        },
        "create": {
            "url": "/time_preferences.json",
            "method": "POST",
            "description": "Create a new time preference"
        },
        "update": {
            "url": "/time_preferences/:id.json",
            "method": "PUT",
            "description": "Update a time preference"
        },
        "destroy": {
            "url": "/time_preferences/:id.json",
            "method": "DELETE",
            "description": "Delete a time preference"
        }
    },
}