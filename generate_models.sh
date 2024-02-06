#!/bin/bash

rails generate model Assignment professor:references time_block:references course:references classroom:references --no-migration --skip-collision-check
rails generate model Classroom room:string is_lab:integer room_capacity:integer --no-migration --skip-collision-check
rails generate model Course name:string identifier:string needs_lab:integer course_size:integer --no-migration --skip-collision-check
rails generate model CoursePreference professor:references course:references priority:integer --no-migration --skip-collision-check
rails generate model Professor name:string --no-migration --skip-collision-check
rails generate model TimeBlock identifier:string is_double:integer --no-migration --skip-collision-check
rails generate model TimePreference professor:references time_block:references priority:integer --no-migration --skip-collision-check