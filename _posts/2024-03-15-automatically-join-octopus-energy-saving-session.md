---
title: Automatically Join Octopus Energy Saving Sessions
date: 2024-03-15 10:14:35 +0100
image:
  path: assets/img/posts/automatically-join-octopus-energy-saving-session/thumb.png
categories: [Home Automation]
tags: [octopus, ha, saving, session]
pin: false
toc: true
comments: true
---

After missing a few saving sessions with them being announced last minute or the notifications not appearing from the Octopus app I decided to work on automating joining the sessions to avoid missing out.

In order to do this you would need the following:

- An Octopus Energy account
- Home Assistant
- [BottleCapDaves Octopus Integration](https://github.com/BottlecapDave/HomeAssistant-OctopusEnergy)

My automation looks like this:

{% include post-picture.html img="octopus_saving_session.png" alt="Octopus Saving Session Automation" h="200" w="400" shadow="true" align="true" %}

## When

1. Add a new **State** Trigger
2. In the entity field type **Octoplus Saving Session Events**, the entity should popup and you can click it to populate the field

## And if

Add a new **Template** condition with this value:

{% raw %}
```liquid
{{ state_attr('event.octopus_energy_a_89b814e6_octoplus_saving_session_events', 'available_events') | length > 0 }}
```
{% endraw %}

## Then do

In this section I have some custom datetime inputs that are not required, I have them there for a future automation that I had planned but not implemented yet.

### Set start time (call a service)

{% raw %}
```yaml
service: input_datetime.set_datetime
target:
  entity_id: input_datetime.saving_session_start_time
data:
  datetime: |-
    {{
      state_attr('event.octopus_energy_a_123456789_octoplus_saving_session_events', 'available_events')[0]['start']
    }}
```
{% endraw %}

### Set end time (call a service)

{% raw %}
```yaml
service: input_datetime.set_datetime
target:
  entity_id: input_datetime.saving_session_end_time
data:
  datetime: |-
    {{
      state_attr('event.octopus_energy_a_123456789_octoplus_saving_session_events', 'available_events')[0]['end']
    }}
```
{% endraw %}

### Octopus Energy: Join Octoplus saving session event

1. Add an action to Call a service
2. Enter the service name **Octopus Energy: Join Octoplus saving session event**
3. Choose a target entity **OctopusEnergy account-number Saving Session Events**
4. Check the Event Code and add `trigger.event.data['event_code']`

### Notification

Finally I add a notification that sends me a message that a session has been signed up to:

{% raw %}
```yaml
service: notify.device_to_notify
metadata: {}
data:
  message: |-
    {% set event_start =
      state_attr('event.octopus_energy_a_1234567_octoplus_saving_session_events', 'available_events')[0]['start']
    %}
      Joined a new Octopus Energy saving session. It starts at {{ event_start.strftime('%H:%M') }}
      on {{ event_start.day }}/{{ event_start.month }}
```
{% endraw %}

Now you can save this automation and rest easy knowing you will never miss a saving session again.

Full Yaml: 

{% raw %}
```yaml
alias: energy - Join Saving Session
description: ""
trigger:
  - platform: state
    entity_id:
      - event.octopus_energy_a_123456789_octoplus_saving_session_events
condition:
  - condition: template
    value_template: >-
      {{
      state_attr('event.octopus_energy_a_123456789_octoplus_saving_session_events',
      'available_events') | length > 0 }}
action:
  - service: input_datetime.set_datetime
    target:
      entity_id: input_datetime.saving_session_start_time
    data:
      datetime: |-
        {{
          state_attr('event.octopus_energy_a_89b814e6_octoplus_saving_session_events', 'available_events')[0]['start']
        }}
  - service: input_datetime.set_datetime
    target:
      entity_id: input_datetime.saving_session_end_time
    data:
      datetime: |-
        {{
          state_attr('event.octopus_energy_a_123456789_octoplus_saving_session_events', 'available_events')[0]['end']
        }}
  - service: octopus_energy.join_octoplus_saving_session_event
    metadata: {}
    data:
      event_code: trigger.event.data['event_code']
    target:
      entity_id: event.octopus_energy_a_123456789_octoplus_saving_session_events
  - service: notify.mobile
    metadata: {}
    data:
      message: |-
        {% set event_start =
          state_attr('event.octopus_energy_a_123456789_octoplus_saving_session_events', 'available_events')[0]['start'] 
        %}
          Joined a new Octopus Energy saving session. It starts at {{ event_start.strftime('%H:%M') }} 
          on {{ event_start.day }}/{{ event_start.month }}
mode: single
```
{% endraw %}

