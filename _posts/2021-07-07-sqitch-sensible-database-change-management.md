---
title: Sqitch, Sensible database change management
excerpt: >-
  Sqitch is a fairly new open source database change management tool, allowing for easy
  version control without having to manage hundreds of files.
date: 2021-07-07 00:00:00 +0100
image:
  path: assets/img/posts/sqitch-sensible-database-change-management/thumb.png
categories: [Database, Automation]
tags: [sqitch, db, change, management, database, automation]
---

## Overview

Recently I have been working on a few projects that utilise PostgreSQL databases,
as the projects have grown our team has found it increasingly more difficult to manage
all of the database changes between dev / staging / prod without missing parts of functions
or missing table columns, especially over long development periods.

Due to this I spent the past month looking into many different ways to manage this, we ended
up landing on sqitch, it wasn't the first product tested and below I will run through
some of the others that I found and the issues we saw with them.

## Expectations

So what did our team expect would be delivered by the database change management tool?

Well here is the list:

- Native SQL support
- No limitations on SQL functionality
- Open Source, or have a feature rich community edition that is well supported
- Easily managed version control, ideally without need for new SQL files for each change
- Ability to rollback changes to specific versions
- Unix command line utility for easy automation

## The testing phase

Over about a month I tested the following products:

### Flyway

Flyway was very close to being the chosen product, it had most of our requirements with a
few limitations, but it was the best I had found.

_Pros:_

- Uses native SQL
- Easy file naming

_Cons:_

- A new file is required for every change, this would lead to hundreds of version files
- Inability to rollback to a specific version in time
- Heavily limited functionality on the community edition
- More complex implementation

### Liqibase

Liqibase was looking great, until I discovered that the main language used is XML, SQL is
supported, however most documentation is XML based and I didn't have the time to spend
learning the XML format to eventually find out that some specific feature we use isn't
supported by this format.

All in I found that it was more complex to get started than Flyway and the documentation
wasn't the best.

_Pros:_

- More features in the free version than Flyway
- Diff feature to compare two databases
- Rollback is free
- Utilises one file for migrations

_Cons:_

- XML is the primary language used
- Targeted rollback is an addon

### SQL Alchemy

As this is an ORM it was removed from the running fairly quickly, there is no native SQL
support, which means a high chance of missing SQL functionality, one such feature was
the ability to create and update Postgres functions

_Pros:_

- Uses Python so can be baked into projects
- Development Teams don't need to know/learn SQL

_Cons:_

- Functionality limited to what the developers implement
- Risk of compatibility issues in the future
- No support for native SQL files

### Sqitch

Sqitch was the last option on the table, I found this tool when searching YouTube when a
very early version was being presented.

The idea of Sqitch is to use Version control to track the changes in files, for
our requirements this was perfect. It meant I could update existing SQL files and
Sqitch would know a change was made and could then be deployed.

One downside to this plan is that not all these features are implemented yet. Although
the developers working on the project are making massive strides and I feel it wont
be long until they have achieved the original goal they set out for.

_Pros:_

- Uses native SQL
- Utilises a git like version control system
- You always edit the original file
- Open source allowing you to customise as needed
- Very responsive community
- Ability to support almost any database

_Cons:_

- Some expected features are not implemented yet
- No commercial support, only community based

## Implementation

Now that we have tested and decided that Sqitch is the product for us, its time to
implement the solution.

Installation is super simple, its written in Perl so can be installed on almost any
system, or you can use it within a Docker container.

I won't cover the installation as its easy enough and documented well on the
[sqitch website](http://sqitch.org/).

One thing that I would recommend is to change the default location of the files, by
default Sqitch will add `deploy`, `revert` and `verify` to the root directory. Your
SQL goes inside these directories. I prefer to have these in a separate directory to
keep the root directory tidy, to do this you would run a command similar to below when
initialising your repository:

```shell
sqitch init myApp --top-dir sql --uri https://github.com/totaldebug/sqitch_demo --engine pg
```

This command will tell Sqitch that you want to `init` a sqitch project within the directory
`sql` for the GitHub repository `sqitch_demo` and with the engine `pg` (PostgreSQL) there
are other options and databases supported all listed [here](http://sqitch.org/docs/manual/sqitch-init/)

Once you have initialised the project you are ready to add a change. The basic pattern is:

- Create a branch
- Add SQL changes
- Modify the code as needed
- Commit
- Merge to master

So when first starting out you would want to create the schema to do this you would:

1. Create a branch in your Git repo
2. Run `sqitch add appschema`
3. Edit `sql/deploy/appschema.sql`, `sql/revert/appschema.sql` and `sql/verify/appschema.sql`
4. Run `sqitch deploy db:pg://user@127.0.0.1:5432/sqitch_demo` to deploy the changes
5. Edit any code as normal
6. Run any tests
7. Commit your changes
8. Merge the changes back to the main branch

In order to ensure that your revert SQL is working as expected, it is a good idea to
revert and redeploy your changes:

```shell
sqitch rebase --onto @HEAD^ -y
```

This command will revert the last change, and redeploy it to the database. This is
essentially a shorter way of running:

```shell
sqitch revert --to @HEAD^ -y && sqitch deploy db:pg://user@127.0.0.1:5432/sqitch_demo
```

When the `deploy` command is issued, sqitch will run down the plan file and execute each
change that is required.

If this is the first time deploying Sqitch to a database, it will automatically create
all the required tables to track future deployments and changes.

## Conclusion

I've barely scratched the surface of Sqitch's capabilities. To say how long Git and change
management has been around, its amazing that its taken this long for someone to get it right.
If you are having issues with managing database change, I highly suggest that you try Sqitch.
