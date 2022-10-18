# Chat 2.0
# Important Note:  This program is not finished!

## To do:
Most of the programming for Chat is done, but here is what there is left to do:
 - Fix Errors
 - Release Version 2.0
 - Make Chat Chrome Extension
 
 **Note:** _The following description and list of main features is describing the completed Chat program, not as it is currently._

## Description:
A fairly simple chat system in which you can create your own chat room and use it at any time.  You can even generate links that will automatically enter your name, chat room ID, and chat room password.  With scarcely any loading time, this program works on new and very old web browsers.  Basically, if a web browser supports javascript, then it will probably support all required functionality of this program.  This program is availible on any device with a web browser, including Linux Devices.  It will soon be available as a chrome extension.

## List of main features:
 - Chat room generating where you can enter a word, number, or phrase as your chat room ID.
 - Chat room protection with password.
 - Generating links that will automatically enter your name, room ID, and password into the website.
 - Messages can be written in HTML, which allows **bold**, _italics_, ~~strikethrough~~, underline, audio, pictures, and more.*
 - Very little loading time.
 - Works well on nearly any device with any web browser that can support javascript.
 - Works well on Linux Devices, such as Raspberry Pi.
 - Available as a Chrome extension.  With this extension, one click can take you to your chat room at any time.
 - Free, with no cost to users and no "upgrade plan" or advertisements to tempt you.
 
 ##### \*Note: Any media in a message (e.g. Pictures, audio, videos) must be linked elsewhere - you cannot upload files to this chat.  Get the link to a media by right-clicking on it and selecting "copy image address" or "copy audio address", etc.  You can get links to your own files by uploading them to another website and copying the link.

## How to format a message:
To make something in your message bold, type it like this: `<b>Words Words Words</b>`

Notice that `<b>` is at the beginning and `</b>` is at the end.

The same concept applies to many other text features.  Use `<i>` and `</i>` for italics, `<u>` and `</u>` for underline, and `<s>` and `</s>` for strikethrough.  To move on to the next line, use `<br>`.  You do not need to include a `</br>`.

If you were to type this:
```
<b>Hello, Friend!</b><br>
Today I am doing <i>PROGRAMMING</i>!<br>
<b><i>You should <s>not</s> do programming too!</i></b>
```
you would get the following result:

<br />

**Hello, Friend!** <br />
Today I am doing _PROGRAMMING_! <br />
***You should ~~not~~ do programming too!*** <br />
<br />

To insert a link, use the following syntax:
```
<a href="https://google.com">Click me!</a>
```

this would produce the following result:

[Click Me!](https://google.com)


## How to insert media:

If the URL to your image is [https://avatars.githubusercontent.com/u/71152561](https://avatars.githubusercontent.com/u/71152561), then you would write the following to insert this image with a 100 pixels by 100 pixels size:
```
<img src="https://avatars.githubusercontent.com/u/71152561" width="100px" height="100px">
```

Again, you can obtain the URL to an image by right-clicking on it and selecting "Copy Image Address".  A similar concept goes for an audio recording:
```
<audio controls><source src="https://www.fjhmusic.com/audio/B1886.mp3" type="audio/mpeg"></audio>
```

The main difference here is that you will need to include the audio URL _and_ the audio type.  The audio type could be "audio/mpeg", "audio/mp3", "audio/ogg", or something else depending on the end of the name of the file (e.g. .mp3).

To insert a youtube video, just right click on a youtube video and select "<> Copy Embed Code".  The now copied programming can be directly inserted into a Chat message.

If you want to know how to insert something else into your message, just research how to insert it with html.  You will probably be able to find something that will allow you to insert whatever you need into your message.

Although you have permission to use html in your messages, it is recommended that you DO NOT include buttons, scripts, and other such interactive elements for security reasons.  Such messages may be immediately removed from the Chat website.
