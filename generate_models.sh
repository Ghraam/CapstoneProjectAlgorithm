#!/bin/bash

rails generate model Assignment professor:references time_block:references course:references classroom:references --no-migration
rails generate model Classroom room:string is_lab:integer --no-migration
rails generate model Course name:string identifier:string needs_lab:integer --no-migration
rails generate model CoursePreference professor:references course:references priority:integer --no-migration
rails generate model Professor name:string --no-migration
rails generate model TimeBlock identifier:string is_double:integer --no-migration
rails generate model TimePreference professor:references time_block:references priority:integer --no-migration