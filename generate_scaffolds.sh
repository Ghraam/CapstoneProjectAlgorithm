#!/bin/bash

rails generate scaffold Assignment professor:references time_block:references course:references classroom:references --no-migration --force
rails generate scaffold Classroom room:string is_lab:boolean room_capacity:integer --no-migration --force
rails generate scaffold CoursePreference professor:references course:references priority:integer --no-migration --force
rails generate scaffold Course name:string identifier:string needs_lab:boolean course_size:integer --no-migration --force
rails generate scaffold Professor name:string --no-migration --force
rails generate scaffold TimeBlock identifier:string is_double:boolean --no-migration --force
rails generate scaffold TimePreference professor:references time_block:references priority:integer --no-migration --force