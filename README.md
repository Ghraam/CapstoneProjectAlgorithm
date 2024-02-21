# README

## Setup
### Rails installation
See [Rails installation guide](https://guides.rubyonrails.org/v5.0/getting_started.html).

#### Dependencies
- `ruby-dev`

### Database setup
Usernames and passwords are set in `config/database.yml`. Configuration is currently as follows:
```yaml
---
username: capstone
password: password1234
```
The server is currently set to use a MySQL database. To change this, edit the `config/database.yml` file. The database is currently set to use the `capstone_scheduling_project` database for development and the `capstone_scheduling_project_test` database for testing. To change this, edit the `config/database.yml` file.
To set up the database, run the following commands:
```bash
mysql -u capstone -p < db-create.sql
rails db:seed
```
### Running the server
To run the server, run the following command:
```bash
rails s
```

## ER Diagram
![ER Diagram](https://i.imgur.com/z0rwrBZ.png)

## API Specification
```json
{
    "sections": {
        "index": {
            "url": "/sections.json",
            "method": "GET",
            "description": "Get all sections"
        },
        "show": {
            "url": "/sections/:id.json",
            "method": "GET",
            "description": "Get a single section"
        },
        "create": {
            "url": "/sections.json",
            "method": "POST",
            "description": "Create a new section"
        },
        "update": {
            "url": "/sections/:id.json",
            "method": "PUT",
            "description": "Update a section"
        },
        "destroy": {
            "url": "/sections/:id.json",
            "method": "DELETE",
            "description": "Delete a section"
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