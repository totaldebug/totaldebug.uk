---
title: "Creating the perfect Python project"
excerpt: >-
  Best practices to setup the perfect Python project for code quality
  and team standards
date: 2022-03-23 00:00:00 +0100
thumb_img: thumb.png
content_img: thumb.png
categories: [Python]
tags: [python, project, best practices, code quality, team, standards]
---

Working on a new project its always exciting to jump straight in and get coding
without any setup time. However spending a small amount of time to setup the project
with the best tools and practices will lead to a standardised and aligned coding
experience for developers.

In this article I will go through what I consider to be the best python project setup.
Please follow along, or if you prefer to jump straight in, you can use
[cookiecutter](https://totaldebug.uk/posts/cookiecutter-automate-project-creation/)
to generate a new project following these standards, install poetry then create a new
project.

# Poetry: Dependency Management

[Poetry](https://python-poetry.org/) is a Python dependency management and packaging system
that makes package management easy!

Poetry comes with all the features you would require to manage a project's packages,
it removes the need to `freeze` and potentially include packages that are not required
for the specific project. Poetry only adds the libraries that you require for that
specific project.

No more need for the unmanageable `requirements.txt` file.

Poetry will also add a `venv` to ensure only the required packages are loaded.
with one simple command `poetry shell` you enter the `venv` with all the
required packages.

## Lets get setup with poetry

```bash
pip install poetry
poetry init
poetry add <package>
poetry shell
poetry run python your_script.py
```

So, that's a few commands! but what do they all do?

- `pip install poetry` - Installs the poetry package to your machine
- `poetry init` - Adds poetry to an existing project (for a new project use `poetry new <projectName>`)
- `poetry add <package>` - Adds a single or multiple python packages
- `poetry shell` - Activates the poetry `venv`
- `poetry run python your_script.py` - Runs the script `your_script.py` within the poetry `venv`

# Black: Code Formatting

[black](https://black.readthedocs.io/en/stable/) is an uncompromising code formatter
in Python. If your code violates pep8 then Black will notify or resolve the issues

Lets get that installed as a development dependency:

```bash
poetry add black --dev
```

We also need to add some additional configuration for Black to the end of
`pyproject.toml`

```bash
[tool.black]
line-length = 88
target_version = ['py38']
include = '\.pyi?$'
exclude = '''
(
  /(
      \.eggs         # exclude a few common directories in the
    | \.git          # root of the project
    | \.hg
    | \.mypy_cache
    | \.tox
    | \.venv
    | _build
    | buck-out
    | build
    | dist
  )/
)
'''
```

These settings can be changed to your preferences, for example I like the line length
to be 88, but you may prefer this shorter / longer.

To use black you can run the following command:

```bash
black . --check
```

This will check the formatting of the files in the current directory and its subfolders,
if you remove the `--check` option, it will automatically reformat your python code.

{% include post-picture.html img="blackoutput.png" alt="Example Black Output" %}

# isort: Import Sorting

[isort](https://github.com/PyCQA/isort) is a Python library that automatically sorts
imported libraries alphabetically and separates them into sections and types.

Lets get that installed as a development dependency:

```bash
poetry add isort --dev
```

isort and black don't get along, their configurations conflict with each other, so to get
around this issue we need to add some configuration to the end of `pyproject.toml`:

```bash
[tool.isort]
profile = "black"
force_sort_within_sections = true
known_first_party = [
    "tests",
]
forced_separate = [
    "tests",
]
```

Adding the `profile = "black"` option ensures that iSort respects changes made by Black,
It is also advisable to add the folders for `known_first_party` files, this enables iSort
to group those imports together in order.

To use isort run the following command:

```bash
isort . --diff
```

This will check the order of the imports and let you know if it is correct, if you
would like isort to automatically fix the ordering, remove the `--diff` option.

# flake8: Style Enforcement

[flake8](https://flake8.pycqa.org/en/latest/) is a python tool that checks the style
and quality of your Python code. It checks for various issues not covered by black.

Lets get this added to our project:

```bash
poetry add flake8 --dev
```

flake8 also has some configuration that is recommended with black, create a new file
called `.flake8` and place the below configuration:

```bash
[flake8]
max-line-length = 88
max-complexity = 15
exclude = build/*
extend-ignore =
    # See https://github.com/PyCQA/pycodestyle/issues/373
    E203,
ignore = E203, E266, E501, W503, W605
select = B,C,E,F,W,T4
```

This configuration will ensure that type errors that conflict with black will be
ignored.

To use flake8 you can run the below command:

```bash
flake8 . --fix
```

This will run flake8 and fix any issues on all files in the current directory and
subdirectories, if you just want to see the issues remove the `--fix` option.

{% include post-picture.html img="flake8output.png" alt="Example Flake8 Output" %}

# MyPy: Static Types Checker

[Mypy](https://mypy.readthedocs.io/en/stable/) is an optional static type checker
for Python that aims to combine the benefits of dynamic (or "duck") typing and
static typing.

MyPy does require that the static types are installed for each library, if a library
has no static types that will cause mypy to error.

```bash
poetry add mypy --dev
```

Additional configuration can be added to the `pyproject.toml` file if required similar
to below:

```bash
[tool.mypy]
python_version = "3.8"
warn_return_any = true
warn_unused_configs = true

[[tool.mypy.overrides]]
disallow_untyped_defs = true
```

To use mypy simply enter the following command:

```bash
mypy .
```

# Interrogate: DocString standardisation

[interrogate](https://interrogate.readthedocs.io/en/latest/index.html?highlight=pre-commit)
checks your codebase for missing docstrings.

Docstrings provide the ability to automatically document and also assist developers
allowing then to quickly and easily see what a specific class or function is used for.

To install interrogate, type:

```bash
poetry add interrogate --dev
```

Additional configuration for the `pyproject.toml` file:

```bash
[tool.interrogate]
ignore-init-method = true
ignore-init-module = false
ignore-magic = false
ignore-semiprivate = false
ignore-private = false
ignore-property-decorators = false
ignore-module = true
ignore-nested-functions = false
ignore-nested-classes = true
ignore-setters = false
fail-under = 95
exclude = ["setup.py", "docs", "build"]
ignore-regex = ["^get$", "^mock_.*", ".*BaseClass.*"]
verbose = 0
quiet = false
whitelist-regex = []
color = true
```

To run interrogate use the following command:

```bash
interrogate -vv
```

Remove the `-vv` to just see a success or fail message without a list of files

{% include post-picture.html img="interrogateoutput.png" alt="Example Interrogate Output" %}

# Pre-Commit hooks

Now we have all of these tests, but we don't want to run them manually every time we
make changes to code. This is where pre-commit hooks come into play.

Pre-commit hooks allow you to run multiple checks against code before `git commit`
will be applied, if any of the tests fail, the commit will not apply until the
issues raised are resolved.

This feature is great for a few reasons:

1. You don't need to remember to run all of the above manually each time you wish to check code
1. Github Actions based on code quality should continue to succeed

## Setup pre-commit hooks

First we create the configuration file in root `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: https://github.com/pycqa/isort
    rev: 5.8.0
    hooks:
      - id: isort
        name: isort (python)
  - repo: local
    hooks:
      - id: black
        name: black
        stages: [commit]
        language: system
        entry: black
        types: [python]
  - repo: https://gitlab.com/pycqa/flake8
    rev: 4.0.1
    hooks:
      - id: flake8
        additional_dependencies: [flake8-bugbear]
  - repo: https://github.com/compilerla/conventional-pre-commit
    rev: v1.2.0
    hooks:
      - id: conventional-pre-commit
        stages: [commit-msg]
        args: [] # optional: list of Conventional Commits types to allow
  - repo: https://github.com/econchick/interrogate
    rev: 1.5.0
    hooks:
      - id: interrogate
```

Install pre-commit & tell pre-commit to register our config:

```bash
poetry install pre-commit --dev
pre-commit install -t pre-commit -t commit-msg
```

Now when you run a commit you will see each hook running, this will then show any errors
prior to committing, you can then fix the issues and try the commit again.

You can also see I have `conventional-pre-commit` applied with the `-t commit-msg` tag
this enforces the use of [conventional commit](https://www.conventionalcommits.org) messages for all commits, ensuring that
our commit messages all follow the same standard.

{% include post-picture.html img="pre-commitoutput.png" alt="Example pre-commit Output" %}

# Final Thoughts

This method of utilising cookie cutter, and pre-commit hooks has saved me a lot of time,
I think there is more to be explored with pre-commit hooks such as adding tests for my
code etc. that will come with time on my development journey.

With these methods I know my commit messages are tidy, and my code is cleaner than before
its a great start with more to come.

I also execute these as github actions on my projects, that way anyone else who contributes
but doesn't install the pre-commit hooks will be held accountable to resolve any issues prior
to merging their pull requests.

Hopefully some of this information was useful for you, If you have any questions about this article and share your thoughts head over to my [Discord](https://discord.gg/6fmekudc8Q).
