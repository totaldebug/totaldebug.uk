---
title: "Home Assistant medication notification using Node-RED"
date: 2023-01-06 20:22:00 +0100
categories: [Home Automation, Node-RED]
tags: [nodered, ha, home-assistant, automation, notify, mqtt, stateless]
---

For around 4 years I have had to take medication for Rheumatoid Arthritis once every two weeks, I always forget when I last took the medication and end up skipping which causes me pain.

Due to this I decided I needed a way to log when I take my medication and then a notification on my phone when im due to take it again.

I ended up creating a workflow in Node-RED that will do the following after I scan an NFC tag located on my fridge where I keep the medication:

* Update a `input_datetime` in Home Assistant with the current date and time
* Check every 60 minutes if the medication date is over 13 days ago
* On Monday, check if its been 10 days since last medication, then send a notification reminding me to take my medication that week
* After 14 days, if the `input_datetime` hasn't been updated, send a notification to my mobile and TV every hour until it is reset.

{% include post-picture.html img="node-red-medication-workflow.png" alt="Medication Workflow" %}

Lets look at how I made this.

# Home Assistant Configuration

Some changes need to be made within home assistant to make this work

## Input Datetime

Adding the `input_datetime` entity requires editing the `configuration.yaml` file directly.

Add the following to your configuration:
```yaml
input_datetime:
  name: "Medication Taken Date"
  icon: "mdi:needle"
  has_time: true
  has_date: true
```

> You may change the name and icon to something different here
{: .prompt-note}

Go to Developer Tools -> YAML -> Check Configuration

If that worked hit restart for the new configuration to take.

## NFC Tag

Register an NFC tag (you could also use a button or some other mechanism for this)

> I recommend having the Home Assistant app installed to write the NFC tag
{: .prompt-note}

1. In home assistant: Settings -> Tags -> Add Tag
2. Type a name for the NFC tag (e.g. Medication) click create
3. Once created, in the app click the button that has an arrow into a box
4. Hold the phone next to the NFC tag to register the data

Your NFC tag is now created.

# Node-RED Workflows

## NFC Tag updates

{% include post-picture.html img="tag-workflow.png" alt="Tag Workflow" %}

Add a HA `tag` node with the tag created earlier, ensure the `msg.payload` is set to expression `$now()`:

{% include post-picture.html img="tag-node.png" alt="Tag Node" %}

Link this to a `Date/Time Formatter` node, with the Output Format set to `YYYY-MM-DD HH:mm:ss`

Link this to a HA `call service` node:
* Domain: `input_datetime`
* Service: `set_datetime`
* Entity: Select the entity you created earlier
* Data: Expression `{"datetime": payload}`

{% include post-picture.html img="tag-service-node.png" alt="Tag Service Node" %}

Now click deploy, Scan the NFC tag and it should update the `input_datetime` entity that was created earlier.

## Notifications

{% include post-picture.html img="notify-workflow.png" alt="Notification Workflow" %}

I have two notifications setup, first a notification at the beginning of the week and then a notification every hour on the 14th day until the tag is scanned.

### Notify at beginning of the week after 10 days

Add an `inject` node, under "Repeat" select `at a specific time` set a time, and the day you would like it to run.

Link this to a `current state` node, to get the current date if the `input_datetime` field:

{% include post-picture.html img="notify-get-med-date.png" alt="Notification Workflow" %}

Link this to a `function` node, with the following `On Message` code:

```javascript
var now = Date.now();
var last = new Date(msg.payload)
msg.payload = now - last.valueOf();
return msg;
```
This will calculate the amount of time since the `input_datetime` was set.

Link this to a switch add a switch `>=` with `string` value `864000000` (10 days)

> change the value to the number of millisecond's when you want the notification
{: .prompt-note}

Link a `call service` node with the following:
* Domain: `notify`
* Service: The device you want the notification to go to
* Data: The message to send see example below:

```json
{"message":"You need to take your medication this week.","title":"This Week: Take Medication","data":{"color":"#2DF56D"}}
```

### Notify every 60 minutes after 14 days

This workflow is essentially the same as the 10 day notification with a few tweaks so you can copy the previous workflow and make these changes:

In the `inject` node select `interval` or `interval between times` then every X minutes and select all the days you want it to run.

In the `function` node change the value to `1209600000` for 14 days, or as required for your notification.

I also amended the message, and added an additional notify to my TV, this way it will popup on my TV every 60 minutes to annoy me into getting my medication.

```json
{"message":"You need to take your medication.","title":"Take Medication","data":{"color":"#2DF56D"}}
```

That is everything done, you can now deploy and test.

# Final thoughts

I have now been using this workflow for around 2 months and it has been working great.

The notifications to the TV even annoy my wife which really does make me get my medication out quicker!

If you have any ideas on how I could improve this workflow further, please leave a comment.
