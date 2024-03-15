---
title: "Type hinting and checking in Python"
date: 2022-07-05 14:50:00 +0100
image:
  path: assets/img/posts/type-hinting-and-checking-in-python/thumb.png
categories: [Python, Code Quality]
tags: [type hints, typing, python, best practices, code quality, standards]
---

Type hinting is a formal solution that statically indicates the type of a value within your Python code. Specified by
PEP 484 and then introduced to Python 3.5.

Type hints help to structure your projects better, however they are just hints, they don't impact the runtime.

As your code base gets larger or you utilise unfamiliar libraries type hints can help with debugging and stopping mistakes from being made when writing new code. When utilising an IDE such as VSCode (with extensions) and PyCharm you will be presented with warning messages each time an incorrect type is used.

## Pros and Cons

Adding Type hints comes with some great pros:

- Great to assist in the documentation of your code
- Enable IDEs to provide better autocomplete functionality
- Help discover errors during development
- Force you to think about what type should be used and returned, enabling better design decisions.

However, there are also some downsides to type hinting:

- Adds development time
- Only works with Python 3.5+. (although this shouldn't be an issue now)
- Can cause a minor start-up delay in code that uses it especially when using the `typing` module
- Code can be harder to write, especially for complex types

When should type hinting be added:

- Large projects with multiple developers
- Design and development of libraries, type hints will help developers that are not familiar with the library
- If you plan on writing tests it is recommended to use type hinting

## Function Typing

Type hints can be added to a function as follows:

- After each parameter, add a colon and a data type
- After the function add an arrow function `->` and data type

A function with type hints should look similar to the one below:

```python
def add_numbers(num1: int, num2: int) -> int:
  return num1 + num2
```

Here you can see that the data types are all `int` so if a float ia supplied you would be presented with a warning in your IDE or if you use mypy an error would be displayed.

Return types can get more complex when expecting multiple different types, for this we usually would need to add `assert` to make sure mypy knows which type to expect and when.

## Variable type hinting

Variables can also have type hints, in the same way that we add them to functions we would issue a colon, the type then our variable data, as the below example:

```python
my_int: int = 1
my_string: str = "string"
my_dict: dict = {"item1": "value1"}
my_list: list = [a,b,c]
```

## `Optional` and `Union` types

Some objects may contain a couple of different types of objects. `Union` allows us to indicate that several different types are accepted. `Optional` indicates that an object may be given or `None`. If we take the example from earlier, we are able to make it accept both a `float` and `int`.

```python
def add_numbers(num1: Union[int, float], num2: Union[int, float]) -> Union[int, float]:
  return num1 + num2
```

With this updated example if we used `add_numbers(1.1, 1.2)` the output would work without error and type hints would not display a warning.

## Static Type Checking - Mypy

Mypy will run against your code and print out any type errors that are found. Mypy doesn't need to execute the code, it will simply run through it much the same as a linter tool would do.

If no type hinting is present in the code, no errors will be produced by Mypy.

Mypy can be run against a single file or an entire folder. I also utilise pre-commits which wont allow code to be committed if there are any errors present. I also introduced these checks with Github Actions to ensure any contributions to my projects follow these requirements.

# Final Thoughts

Type hints are a great way to ensure your code is used in the correct manner and to reduce the risk of errors being introduced during development. Although they are not required by Python, I feel that type hints should be added to all projects as it assists with clean code and reduces errors.

The following resources are great for additional help with type hinting:

- [Mypy type hinting cheatsheet](https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html)
- Python's [typing module](https://docs.python.org/3/library/typing.html) documentation
