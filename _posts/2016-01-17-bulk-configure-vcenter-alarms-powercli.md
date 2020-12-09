---
id: 742
title: Bulk configure vCenter Alarms with PowerCLI
date: 2016-01-17T15:44:29+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=742
permalink: /bulk-configure-vcenter-alarms-powercli/
post_views_count:
  - "1053"
xyz_fbap:
  - "1"
xyz_lnap:
  - "1"
xyz_twap:
  - "1"
categories:
  - VMware
tags:
  - alarm
  - bulk
  - vcenter
  - vmware
---
I was recently asked if it was possible to update vCenter alarms in bulk with email details. So i set about writing the below script, basically this script will go through looking for any alarms that match the name you specify and set the email as required.  
<!--more-->

  
This is a really basic script and can easily be modified to set alarms how you want them. 

<pre class="lang:ps decode:true " >$MinutesToRepeat = "10"
$alarms = @("Testing Alarm")
$cluster = Get-Cluster "Test Cluster"
$AdminEmail = "your@email.com"
foreach ($alarm in $alarms) {
    Set-AlarmDefinition -Name $alarm -AlarmDefinition $alarm -ActionRepeatMinutes $MinutesToRepeat | %{
        $_ | Get-AlarmAction -ActionType "SendEmail" | Remove-AlarmAction -Confirm:$false 
        $_ | New-AlarmAction -Email -To $AdminEmail | %{
            $_ | New-AlarmActionTrigger -StartStatus Green -EndStatus Yellow 
            $_ | New-AlarmActionTrigger -StartStatus Red -EndStatus Yellow
            $_ | New-AlarmActionTrigger -StartStatus Yellow -EndStatus Green
        }

    }
    $AlarmAction = Get-Alarmdefinition -Name $alarm | Get-AlarmAction -ActionType 'SendEmail'
    $AlarmAction.Trigger | Where {($_.StartStatus -eq 'Yellow') -And ($_.EndStatus -eq 'Red')} | Remove-AlarmActionTrigger -Confirm:$False
    $AlarmAction | New-AlarmActionTrigger -StartStatus Yellow -EndStatus Red -Repeat
}</pre>

To edit multiple alarms at once simply change the $alarms variable as below:

<pre class="lang:default decode:true " >$alarms = @("Test Alarm1", "Test Alarm2")</pre>

One thing you will probably notice is that we set the &#8220;Yellow&#8221; to &#8220;Red&#8221; status after everything else, the reason for this is that it is set by default when creating the alarm definition and we need to unset this before resetting with the required notification type.