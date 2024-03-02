#!/bin/bash

rails generate scaffold Classroom room:string is_lab:boolean room_capacity:integer --no-migration --force
rails generate scaffold CoursePreference professor:references course:references priority:integer --no-migration --force
rails generate scaffold Course name:string identifier:string needs_lab:boolean course_size:integer level:integer double_block:boolean --no-migration --force
rails generate scaffold Professor name:string --no-migration --force
rails generate scaffold Section course:references section_num:integer professor:references start:integer end:integer classroom:references --no-migration --force
rails generate scaffold TimeBlock identifier:string block_type:integer day:integer timeslot:integer --no-migration --force
rails generate scaffold TimePreference professor:references time_block:references priority:integer --no-migration --force