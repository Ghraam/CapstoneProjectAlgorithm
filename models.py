# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Assignment(models.Model):
    professor = models.OneToOneField('Professor', models.DO_NOTHING, primary_key=True)  # The composite primary key (professor_id, time_block_id) found, that is not supported. The first column is selected.
    time_block = models.ForeignKey('TimeBlock', models.DO_NOTHING)
    class_field = models.ForeignKey('Class', models.DO_NOTHING, db_column='class_id')  # Field renamed because it was a Python reserved word.
    classroom = models.ForeignKey('Classroom', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'assignment'
        unique_together = (('professor', 'time_block'),)


class Availabilty(models.Model):
    professor = models.OneToOneField('Professor', models.DO_NOTHING, primary_key=True)  # The composite primary key (professor_id, time_block_id) found, that is not supported. The first column is selected.
    time_block = models.ForeignKey('TimeBlock', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'availabilty'
        unique_together = (('professor', 'time_block'),)


class Class(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=45)
    identifier = models.CharField(max_length=45)
    needs_lab = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'class'


class Classroom(models.Model):
    id = models.IntegerField(primary_key=True)
    room = models.CharField(max_length=45)
    is_lab = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'classroom'


class Preference(models.Model):
    professor = models.OneToOneField('Professor', models.DO_NOTHING, primary_key=True)  # The composite primary key (professor_id, class_id) found, that is not supported. The first column is selected.
    class_field = models.ForeignKey(Class, models.DO_NOTHING, db_column='class_id')  # Field renamed because it was a Python reserved word.
    priority = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'preference'
        unique_together = (('professor', 'class_field'),)


class Professor(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = 'professor'


class TimeBlock(models.Model):
    id = models.IntegerField(primary_key=True)
    identifier = models.CharField(max_length=45)
    is_double = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'time_block'
