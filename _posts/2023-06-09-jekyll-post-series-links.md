---
title: Add series links to Jekyll posts
date: 2023-06-09 09:06:40 +0100
image:
  name:
categories: [Website]
tags: [Jekyll, how-to]
---

Creating blog posts for my website I sometimes find that I want top create multiple articles as part of a series, usually because I have done some research and got to a stage that makes sense to have an article to itself, something like my recent post on [Proxmox Template with Cloud Image and Cloud Init]({% post_url 2022-10-04-proxmox-template-with-cloud-image-and-cloud-init %}).

Rather than having to manually link to other articles related to the series, I thought it would be better to have a section at the top that lists all articles related to the series.

## The metadata

For this to work each post that is required to be part of a series should contain some metadata with a name for that series. For example:

```markdown
---
series: Automating Proxmox Deployments
---
```

{: title='Front Matter Example',}

With this metadata we are able to search for all articles that contain the **series** that matches **Automating Proxmox Deployments**. Each article must contain the same name exactly, if there are any spaces or punctuation that is different it will not work.

## Create an include

Now personally I like to add features like this as includes, it keeps the main `posts.html` file much cleaner and easier to understand.

So go ahead and create a new include called `post-series.html` and add the code below:

{% raw %}
```html

{% if page.series %}
{% assign posts = site.posts | where: "series", page.series | sort: 'date' %}
<div class="row justify-content-center" id="post-series">
  <div class="card series-list">
    <div class="card-header">
        {{ page.series | upcase }} ({{ posts | size }} part series)
    </div>
    <ul class="list-group list-group-flush">
            {% for post in posts %}
                {% if post.title == page.title %}
                  <a href="#" class="list-group-item list-group-item-action active" aria-current="true">{{ post.title }}</a>
                {% else %}
                <a href="{{ post.url | relative_url }}" class="list-group-item list-group-item-action">{{ post.title }}</a>
                {% endif %}
            {% endfor %}
        </ul>
  </div>
</div>
{% endif %}
```
{% endraw %}
{: file='post-series.html'}

This works as follows:

1. Check that the page has the `series` medatada
1. Get all posts that have `series` that match. Sort these in ascending order.
1. Display a card with:
    1. The series name
    1. How many parts there are in the series
    1. Clickable link to the other posts in the series

## Add to layout

We have everything we need to get this working, but we need to add it to the layout for our posts, edit the `post.hhml` file and add the include as follows:

{% raw %}
```html
{% include post-series.html %}
```
{% endraw %}

You can add this anywhere you would like it to appear on your post, for my website, I have it appear after the meta but before the article begins as per the below screenshot:

{% include post-picture.html img="series_example.png" alt="Series Example" h="200" w="400" shadow="true" align="true" %}

## Final Thoughts

We now have a great new feature on our blog, super easy to add to the website and this is one of the reasons I love using Jekyll for my website, so much is possible and with very little effort.

There are many additional features that could be added with this small snippet, for example you could create a page that shows all of the series that you have or you could add the series to a menu rather than just the top of the post page.

Hope this helped!
