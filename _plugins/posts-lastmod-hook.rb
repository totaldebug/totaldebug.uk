#!/usr/bin/env ruby
#
# Check for changed posts

Jekyll::Hooks.register :posts, :pre_render do |post|
    STDOUT.write "------ last_mod date -------\n"
    git_version = `git --version`
    STDOUT.write "Ver: #{git_version}"
    commit_num = `git rev-list --count HEAD "#{ post.path }"`

    if commit_num.to_i > 1
      lastmod_date = `git log -1 --pretty="%ad" --date=iso "#{ post.path }"`
      STDOUT.write "lastmod date: #{lastmod_date}\n"
      post.data['last_modified_at'] = lastmod_date
    end
    STDOUT.write "-------------\n"
  end
