---
title: A Pythonic way to alias methods?
date: 2023-08-08 10:39:37 +0100
categories: [Python]
tags: [python, aliases, method]
pin: false
toc: true
comments: true
---

An alias method allows accesses to the original method via a different name. You can define your own alias method by adding the statement `a = b` to your class definition. This creates an alias method `a()` for the original method `b()`.

For my situation this wasn't really ideal, I wanted to standardise all of my method names easily with a deprecation warning when the old method was used. To do that, I decided the easiest way would be to use decorators with the ability to add the version the alias would be deprecated.

I did this with the following code:

{% gist f8a5c81544a737eada8a07e228c99d59 %}

This code allows for the following to be added to your class and method to add an alias, in my case, the method would be renamed to the new method name and then the alias would contain the old name.

```python
@aliased
class MyClass():
    @alias("old_method_name", deprecated_version="v2.0.0")
    def new_method_name():
        print "foo"
```
{: title='Example Usage'}

## Are alias methods pythonic?

Well, using aliases is not very pythonic, The Zen of Python clearly states that there should be one, and only one, way to accomplish a thing.

```python
>>> import this
The Zen of Python, by Tim Peters

Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!
```
{: title='The Zen of Python, by Tim Peters'}

This is why I added the `deprecated_version` option, as ideally the alias wont be around for long, but long enough for teams to migrate their code.

Hopefully this will assist someone else who finds themselves, in an ideal world we would never use this, but sometimes its unavoidable to have a little mess to get to a tidier situation.
