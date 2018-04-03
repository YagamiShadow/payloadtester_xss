# XSS Test Project

## Introduction

This project is intended to show and test various XSS Payloads

## Installation

Installation and execution see README.md in corresponding subfolders

## Subfolders

### Easy Stored and reflected Xss

`./storedreflected/`

### Access to sensitive Information in sessions
`./sessions/`

[-] TODO Setup fake login and redirect to info to own server
```
<script>
window.location.replace("http://localhost/loginpage/LoginPage.htm");
</script>
```

[-] Warum AMCV gesetzt, kommt nicht von Docker rein, kommt von Node rein, sessions in node code anschauen, an Parametern liegt es nicht.


### HTTP Requests
- With arbitrary content to arbitrary destinations

#### Example

##### Introduction 
- XMLHttpRequest

##### Permanent CSRF-Requests

##### KeyLogger
- Install KeyLogger Keyboard Event Listener addEventListener

### HTML Modification

#### Example

##### Introduction
- Arbitrary Modification to HTML

##### Bitcoin Mining

##### Fake Login Page
- Insert Fake Login into the page

### Check for Browser Exploits

#### Example

##### Introduction
- Enumerate Client Information

##### Heap Exploits
