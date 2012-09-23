CameraPi
========

A web application to control cameras supported by gphoto2 and Raspberry Pi.
Please note this has been developed using a Nikon D3s.

Pre-Requisites:
===============
Raspberry Pi
Python 2.7
Bottle 0.10
gphoto2
A compiled C script to reset the USB port - instructions to compile and create the script can be found here: http://askubuntu.com/questions/645/how-do-you-reset-a-usb-device-from-the-command-line


How to use:
===========
There is no installer as such.
Change the settings in camerapi_config.py.  Important settings are:
usbresetpath - the full path to the compiled C script that you created - don't forget to mark it executable!
bottle_staticfilepath - Used by bottle, this the full path to whereever you want to serve static files from.
bottle_* - Other bottle specific settings.

Run the application using:

(sudo) python camerapi.py

Note: I run as sudo because I'm serving on port 80 which is restricted on the RPi.  I run on port 80 because I'm lazy :)


To Do:
======
Create Form to change config value
Option to change config immediately or store as part of a larger request
Ability to send multiple commands to camera at once
Figure out how to store images on the camera
Figure out how to flow errors from gphoto through to web
Ability to set up multiple commands in the client
Create default presets - e.g. for timelapse
Ability to store "presets"
Figure out how to add GPS meta data