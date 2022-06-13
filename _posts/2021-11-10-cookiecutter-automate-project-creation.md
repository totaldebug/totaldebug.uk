---
title: "Cookiecutter: Automate project creation!"
excerpt: >-
  A command-line utility that creates projects from cookiecutters (project templates),
  e.g. creating a Python package project from a Python package project template.
date: '2021-11-10'
thumb_img: thumb.png
content_img: thumb.png
layout: post
---

As I move closer to the world of development within my career I have been
looking for more efficient ways to spend my time, along with assisting my colleagues
and myself follow the programming, documenting and best practices we have set.

When we create a new project there are many repetitive tasks that take place,
such as creating `pyproject.toml`, directory structures, documentation folders
and many other tasks, these tasks are time consuming, repetitive and prone to
user error.

# Some context

Starting a new repository for a new project is always a chore, specially when
working with large teams where others are collaborating with you. You have to
follow the same standards and coding practices to ensure all developers know
what is happening.

Working in large teams means that with many different projects and repositories
it is very likely that none of them will follow the same base structure that is
expected. To help alleviate this problem and fulfil these expectations I created
project templates that anyone can follow to ensure all base projects are the same.

# What is Cookiecutter

[Cookiecutter](https://github.com/cookiecutter/cookiecutter) is a CLI tool
built in Python that creates a project from boilerplate templates
(mainly available on Github). It uses the templating system
[Jinja2](https://jinja.palletsprojects.com/en/3.0.x/) to replace and customize folders and/or files names, as well as their content.

Although built with Python, you are not limited to templating Python projects,
it can easily be implemented with other programming languages. However, to do
this you will need to know or learn some Jinja and if you want to implement
hooks this will need to be done in Python.

# Why use cookiecutter

Well simply put, to save time building new project repositories, to avoid
missing files or commit checks and probably one important step, to make
life easier for new team members who will be expected to create projects.

We also use it as a way to enforce standards, providing the developer with
the necessary structure to ensure the rules are followed: write documentation
perform tests, follow specific syntax standards by giving them the base structure
in a boilerplate code, it makes it easier for developers to follow standards.

In certain projects you may have a lot of repetitive code, such as creating Flask
websites, with a cookiecutter template, you would be able to duplicate that
code with ease and little time spent.

# How to use Cookiecutter

Cookiecutter is super simple to use, you can either use one of the many
[templates](https://github.com/totaldebug/python-package-template)
that already exist online, or you can create one that suits your own needs.

You can access templates from various locations:

- Git repository
- Local folder
- Zip file

---
**NOTE**

If working with Git repositories, you can even start a template from any branch!

---

To try out cookie cutter, first it needs to be installed:

```bash
pip install -U cookiecutter
```

Once installed run the following command:

```bash
cookiecutter gh:totaldebug/python-package-template
```
This repository follows the standards that I use for my Python Package repositories.
When you execute it, you will be prompted for values, for example:

```bash
full_name [marksie1988]: Steve Marks
email [totaldebug@example.com]: youremail@gmail.com
github_username [totaldebug]:
version [0.1.0]:
use_pytest [n]: y
...
```

For a default value, you just press return, or to amend the value you simply type
it and hit return. This prompt is created based on the values defined in
`cookiecutter.json`, all cookiecutter templates have this file in the root.

Once you have answered all of the prompts, the template will be converted into
a new location using the data provided during the prompts.

# How Cookiecutter templates work

A basic Cookiecutter template looks like this:

```
📦template
 ┣ 📂hooks
 ┃ ┣ 📜pre_get_project.py
 ┃ ┗ 📜post_get_project.py
 ┗ 📂{{ cookiecutter.project_slug }}
 ┃ ┣ 📜your-project-files-here
 ┃ ┣ 📂{{cookiecutter.project_slug}}
 ┃ ┃ ┗ 📂3d-printer-axes-calibration
 ┗ 📜cookiecutter.json
```

What happens here:

**template:** this is the root of the repository or folder

**hooks:** Python scripts that execute before and after the generation of the repository. Pre-hooks are generally used to validate inputs from the prompts
and the post-hooks to remove files that are not require for this specific project.

**{% raw %}{{ cookiecutter.project_slug }}{% endraw %}**: is the directory for your project to be stored.
Anything stored in this directory will be copied to the new project.

For a python package you would have another subdirectory with the package name
this would usually be the **{% raw %}{{ cookiecutter.project_slug }}/{{ cookiecutter.project_slug }}{% endraw %}** directory.

This is the minimum required file structure, you can then add as required for
your projects, or copy an existing template and amend the areas that you require.

## cookiecutter.json

To allow flexibility with a template you add variables to ``cookiecutter.json``
this will create a prompt when executing the template for a value which will change
the output to the template.

For each variable within here a default text value, boolean or list of options
are required. Example:

```json
{
  "full_name": "marksie1988",
  "email": "totaldebug@example.com",
  "github_username": "totaldebug",
  "project_name": "Python Boilerplate",
  "project_slug": "{{ cookiecutter.project_name.lower().replace(' ', '_').replace('-', '_') }}",
    "minimal_python_version": [
    3.7,
    3.8,
    3.9
  ],
  "use_black": "y"
}
```

Input validity can be checked with pre_gen_project hooks, the below example validates
the data supplied in the project_slug value:

```python
MODULE_REGEX = r'^[_a-zA-Z][_a-zA-Z0-9]+$'

module_name = '{{ cookiecutter.project_slug}}'

if not re.match(MODULE_REGEX, module_name):
    print('ERROR: The project slug (%s) is not a valid Python module name. Please do not use a - and use _ instead' % module_name)
```

As you can see from the examples, you can either create a very simple template
or add Jinja / Python for more complex and error validation.

# Final Thoughts

Cookiecutter has saved me a lot of time in the creation or projects, also a lot
of the boring template work is taken out of starting a new project which is
always a bonus.

Now all of my projects start in a good standard and should be easier to keep that way.

If you would like to check out cookiecutter you could start by checking my
[python-package-template](https://github.com/totaldebug/python-package-template)

I have added things like Github actions and pre-commits to check work along
with other python best practices that I hope to cover in my next article.


Hopefully some of this information was useful for you, If you have any questions
about this article and share your thoughts head over to my [Discord](https://discord.gg/6fmekudc8Q).
