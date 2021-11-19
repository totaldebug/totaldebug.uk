---
title: "Creating the perfect Python project"
excerpt: >-
  Best practices to setup the perfect Python project for code quality
  and team standards
date: '2021-11-18'
thumb_img: thumb.png
content_img: thumb.png
layout: post
---

Working on a new project its always exciting to jump straight in and get coding
without any setup time. However spending a small amount of time to setup the project
with the best tools and practices will lead to a standardised and aligned coding
experience for developers.

In this article I will go through what I consider to be the best python project setup.
Please follow along, or if you prefer to jump straight in, you can use
[cookiecutter](https://totaldebug.uk/posts/cookiecutter-automate-project-creation/)
to generate a new project following these standards install poetry then create a new
project.

# Poetry: Dependency Management

Python dependency management and packaging made easy.
Poetry comes with all the tools you might need to manage your
projects in a deterministic way.

Using Python allows an easy way to manage libraries and to ensure all developers
use the same library versions. No more need for the unmanagale `requirements.txt` file.

```bash
pip install poetry
```

To initialise a new project run the following:

```bash
poetry init
```

This will create a new file called `pyproject.toml` this is an important file as it holds
all out project metadata, dependencies and other important configuration information.

# Black: Code Formatting

[black](https://black.readthedocs.io/en/stable/) is an uncompromising code formatter
in Python. If your code violates pep8 then Black will resolve this for you

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

# isort: Import Sorting

[isort](https://github.com/PyCQA/isort) is a Python library that automatically sorts
imported libraries alphabetically and separates them into sections and types.

Lets get that installed as a development dependency:

```bash
poetry add isort --dev
```

isort and black dont get along, their configurations conflict with eachother, so to get
around this issue we need to add some configuration to the end of `pyproject.toml`:

```bash
[tool.isort]
profile = "black"
multi_line_output = 3
include_trailing_comma = true
force_grid_wrap = 0
use_parentheses = true
line_length = 88
```

This configuration ensures that isort respects the formatting that black has applied.

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

This configuration will ensure that stype errors that conflict with black will be
ignored.

To use flake8 you can run the below command:

```bash
flake8 . --fix
```

This will run flake8 and fix any issues on all files in the current directory and
subdirectories, if you just want to see the issues remove the `--fix` option.

# MyPy: Static Types Checker

[Mypy](https://mypy.readthedocs.io/en/stable/) is an optional static type checker
for Python that aims to combine the benefits of dynamic (or "duck") typing and
static typing.

MyPy does require that the static types are installed for each library, if a library
has no static types that will cause mypy to error.

```bash
pip install mypy
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

# Interrogate: Dockstring standardisation

[interrogate](https://interrogate.readthedocs.io/en/latest/index.html?highlight=pre-commit)
checks your codebase for missing docstrings.

Docstrings provide the ability to automatically document and also assist in developers
quickly seeing what a specific class or function is used for.

To install interrogate, type:

```bash
pip install interrogate
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

# Git hooks with Pre-Commit
