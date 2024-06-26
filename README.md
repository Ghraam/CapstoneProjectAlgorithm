# README

## Setup

### Ruby installation

We recommend using [RVM](https://rvm.io/) to manage your Ruby installation. To install RVM, run the following commands:

```bash
sudo apt install gnupg2
gpg2 --keyserver keyserver.ubuntu.com --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
\curl -sSL https://get.rvm.io | bash -s stable
```

In order to use RVM as a function, you need to run the following command:

```bash
source ~/.rvm/scripts/rvm
```

To install Ruby 3.3.0, run the following command:

```bash
rvm install 3.3.0
```

To use Ruby 3.3.0 and set it as default, run the following command:

```bash
rvm use --default 3.3.0
```

### Dependencies

To install the ruby dependencies, run the following command:

```bash
bundle install
```

To install the python dependencies, run the following command:

```bash
pip install -r requirements.txt
```

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
mysql -u capstone -p < db/schema.sql
rails db:seed
```

## Running the server

To run the server, run the following command:

```bash
bundle exec rails s -b `ip a | grep -A2 "2:" | grep "inet" | awk '{print $2}' | awk -F/ '{print $1}'`
```

## Planned constraints

1. No professor can teach multiple classes in the same timeslot
2. No classroom can have multiple classes in the same timeslot
3. Double block timeslots contain only double block classes
4. No class may start in the second half of a double block
5. Blocks for double block classes must be consecutive to one another
6. Blocks for single block classes must be in corresponding timeslots
7. Professor must be willing to teach the course
8. Professor must be willing to teach during the assigned timeslot
9. Start time must actually be the start time

## Feature List (In progress)

1. ~~Generate schedule button~~
2. Implement scheduling algorithm
3. ~~Implement status endpoint~~
4. ~~Implement search function for editdata.html~~
5. Validation for addData.js
6. ~~Export needs to be linked to the database~~
7. ~~Drag and drop functionality for schedule.html~~
8. ~~Update schedule based on user corrections~~

## ER Diagram

![ER Diagram](https://i.imgur.com/P3yPzr2.png)

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
            "url": "/sections/[:course_id]_[:section_num].json",
            "method": "PUT",
            "description": "Update a section"
        },
        "destroy": {
            "url": "/sections/[:course_id]_[:section_num].json",
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
    "algorithm": {
        "generate": {
            "url": "/generate",
            "method": "POST",
            "description": "Start the algorithm to generate a schedule"
        },
        "status": {
            "url": "/status",
            "method": "GET",
            "description": "Get the status of the algorithm"
        }
    }
}
```

## Sample Output From Script

```json
[{"course_id": 4, "section_num": -1, "professor_id": 1, "start": -1, "end": -1, "classroom_id": 1}, {"course_id": 1, "section_num": -1, "professor_id": 6, "start": -1, "end": -1, "classroom_id": 1}, {"course_id": 1, "section_num": -1, "professor_id": 6, "start": -1, "end": -1, "classroom_id": 1}, {"course_id": 5, "section_num": -1, "professor_id": 12, "start": -1, "end": -1, "classroom_id": 1}, {"course_id": 7, "section_num": -1, "professor_id": 2, "start": -1, "end": -1, "classroom_id": 1}, {"course_id": 7, "section_num": -1, "professor_id": 2, "start": -1, "end": -1, "classroom_id": 1}, {"course_id": 2, "section_num": -1, "professor_id": 6, "start": -1, "end": -1, "classroom_id": 1}, {"course_id": 6, "section_num": -1, "professor_id": 12, "start": -1, "end": -1, "classroom_id": 1}, {"course_id": 8, "section_num": -1, "professor_id": 6, "start": -1, "end": -1, "classroom_id": 1}, {"course_id": 8, "section_num": -1, "professor_id": 6, "start": -1, "end": -1, "classroom_id": 1}, {"course_id": 3, "section_num": -1, "professor_id": 10, "start": -1, "end": -1, "classroom_id": 1}, {"course_id": 4, "section_num": -1, "professor_id": 1, "start": -1, "end": -1, "classroom_id": 1}, {"course_id": 5, "section_num": -1, "professor_id": 12, "start": -1, "end": -1, "classroom_id": 1}, {"course_id": 2, "section_num": -1, "professor_id": 6, "start": -1, "end": -1, "classroom_id": 1}, {"course_id": 6, "section_num": -1, "professor_id": 12, "start": -1, "end": -1, "classroom_id": 1}, {"course_id": 3, "section_num": -1, "professor_id": 10, "start": -1, "end": -1, "classroom_id": 1}]
```
